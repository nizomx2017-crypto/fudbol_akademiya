const AuthUser = require("./AuthUserModel");
const Role = require("./RoleModel");
const Access = require("./AccessModel");
const { hashPassword } = require("../utils/password");
const { ACCESS_CATALOG } = require("../constants/accessCatalog");

const ROLES = ["ADMIN", "DIRECTOR", "MANAGER", "TEACHER", "STUDENT"];

function getSeedAccounts() {
  return Object.keys(process.env)
    .filter((key) => /^LOGIN_USER_\d+$/.test(key))
    .map((key) => key.split("_").pop())
    .sort((a, b) => Number(a) - Number(b))
    .map((index) => ({
      login: process.env[`LOGIN_USER_${index}`]?.trim(),
      password: process.env[`LOGIN_PASSWORD_${index}`]?.trim(),
      role: process.env[`LOGIN_ROLE_${index}`]?.trim() || (index === "1" ? "ADMIN" : "MANAGER"),
    }))
    .filter((account) => account.login && account.password);
}

async function seedAuthUsers() {
  await Promise.all(
    ROLES.map((name) =>
      Role.findOrCreate({
        where: { name },
        defaults: { name },
      })
    )
  );

  await Promise.all(
    ACCESS_CATALOG.map((name) => {
      const [resource, action] = name.split(":");

      return Access.findOrCreate({
        where: { name },
        defaults: {
          name,
          resource,
          action,
        },
      });
    })
  );

  const accounts = getSeedAccounts();

  await Promise.all(
    accounts.map(async (account) => {
      const role = ROLES.includes(account.role)
        ? account.role
        : "MANAGER";
      const user = await AuthUser.findOne({
        where: {
          login: account.login,
        },
      });

      if (user) {
        user.passwordHash = hashPassword(account.password);
        user.role = role;
        user.status = "active";
        await user.save();
        return user;
      }

      return AuthUser.create({
        login: account.login,
        passwordHash: hashPassword(account.password),
        role,
        status: "active",
      });
    })
  );
}

module.exports = seedAuthUsers;
