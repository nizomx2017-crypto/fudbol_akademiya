"use strict";

require("dotenv").config();

const db = require("./config/db");
const AuthUser = require("./models/AuthUserModel");
const Access = require("./models/AccessModel");
const UserAccess = require("./models/UserAccessModel");
const { hashPassword } = require("./utils/password");
const { ACCESS_CATALOG } = require("./constants/accessCatalog");
const { DEFAULT_ROLE_ACCESSES } = require("./constants/roleAccessDefaults");

const LOGIN_PATTERN = /^[a-zA-Z0-9._-]+$/;

function getCredentials() {
  const login = String(process.env.BOOTSTRAP_ADMIN_LOGIN || "").trim();
  const password = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || "");

  if (!login) {
    throw new Error("BOOTSTRAP_ADMIN_LOGIN environment variable kiritilmagan");
  }

  if (login.length > 80 || !LOGIN_PATTERN.test(login)) {
    throw new Error("BOOTSTRAP_ADMIN_LOGIN formati noto'g'ri");
  }

  if (password.length < 8 || password.length > 128) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD uzunligi 8 dan 128 belgigacha bo'lishi kerak"
    );
  }

  return { login, password };
}

async function bootstrapAdmin() {
  const { login, password } = getCredentials();
  const transaction = await db.transaction();

  try {
    const existingAdmin = await AuthUser.findOne({
      where: { role: "ADMIN" },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingAdmin) {
      await transaction.rollback();
      console.log("Natija: SKIPPED_ADMIN_EXISTS");
      return;
    }

    const existingLogin = await AuthUser.findOne({
      where: { login },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingLogin) {
      throw new Error("Berilgan login boshqa foydalanuvchida mavjud");
    }

    const admin = await AuthUser.create(
      {
        login,
        passwordHash: hashPassword(password),
        role: "ADMIN",
        status: "active",
      },
      { transaction }
    );

    const adminAccessNames =
      DEFAULT_ROLE_ACCESSES.ADMIN || ACCESS_CATALOG;
    const accessRecords = [];

    for (const name of adminAccessNames) {
      const [resource, action] = name.split(":");
      const [access] = await Access.findOrCreate({
        where: { name },
        defaults: { name, resource, action },
        transaction,
      });

      accessRecords.push(access);
    }

    await UserAccess.bulkCreate(
      accessRecords.map((access) => ({
        userId: admin.id,
        accessId: access.id,
      })),
      {
        transaction,
        ignoreDuplicates: true,
      }
    );

    await transaction.commit();
    console.log(
      `Natija: ADMIN_CREATED; access_count=${accessRecords.length}`
    );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

bootstrapAdmin()
  .catch((error) => {
    console.error(`Natija: ERROR; ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
