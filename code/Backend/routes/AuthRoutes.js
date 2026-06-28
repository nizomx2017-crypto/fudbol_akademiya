const express = require("express");
const requireAuthorization = require("../middleware/auth");
const { requireFullAccess } = require("../middleware/access");
const AuthUser = require("../models/AuthUserModel");
const Access = require("../models/AccessModel");
const UserAccess = require("../models/UserAccessModel");
const { hashPassword, verifyPassword } = require("../utils/password");
const { ACCESS_CATALOG } = require("../constants/accessCatalog");
const { DEFAULT_ROLE_ACCESSES } = require("../constants/roleAccessDefaults");
const ROLE_TYPES = ["ADMIN", "DIRECTOR", "MANAGER", "TEACHER", "STUDENT"];

const router = express.Router();

function toPublicUser(user) {
  return {
    id: user.id,
    login: user.login,
    role: user.role,
    status: user.status,
    accesses: user.userAccesses?.map((item) => item.access?.name).filter(Boolean) || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await AuthUser.findOne({
      where: {
        login,
        status: "active",
      },
    });

    if (!user || !verifyPassword(password || "", user.passwordHash)) {
      return res.status(401).json({
        error: "Login yoki parol xato",
      });
    }

    return res.json({
      token: requireAuthorization.createSessionToken(user),
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/me", requireAuthorization, async (req, res) => {
  res.json({ user: req.user });
});

router.get("/users", requireAuthorization, requireFullAccess, async (req, res) => {
  try {
    const users = await AuthUser.findAll({
      include: [
        {
          model: UserAccess,
          as: "userAccesses",
          include: [
            {
              model: Access,
              as: "access",
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(users.map(toPublicUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users", requireAuthorization, requireFullAccess, async (req, res) => {
  const { login, password, role = "MANAGER", status = "active" } = req.body;

  try {
    if (!login || !password) {
      return res.status(400).json({
        error: "Login va parol kiritilishi kerak",
      });
    }

    if (!ROLE_TYPES.includes(role)) {
      return res.status(400).json({
        error: "Role noto'g'ri",
      });
    }

    const user = await AuthUser.create({
      login,
      passwordHash: hashPassword(password),
      role,
      status,
    });

    if (!["ADMIN", "DIRECTOR"].includes(role)) {
      await setUserAccesses(user.id, getRoleAccesses(role, req.body.accesses));
    }

    const createdUser = await findUserWithAccesses(user.id);
    res.json(toPublicUser(createdUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/users/:id", requireAuthorization, requireFullAccess, async (req, res) => {
  const { id } = req.params;
  const { login, password, role, status, accesses } = req.body;

  try {
    const user = await AuthUser.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    if (login !== undefined) user.login = login;
    if (status !== undefined) user.status = status;
    if (role !== undefined) {
      if (!ROLE_TYPES.includes(role)) {
        return res.status(400).json({
          error: "Role noto'g'ri",
        });
      }

      user.role = role;
    }
    if (password) user.passwordHash = hashPassword(password);

    await user.save();

    if (Array.isArray(accesses)) {
      await setUserAccesses(
        user.id,
        ["ADMIN", "DIRECTOR"].includes(user.role) ? [] : accesses
      );
    }

    const updatedUser = await findUserWithAccesses(user.id);
    res.json(toPublicUser(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/users/:id", requireAuthorization, requireFullAccess, async (req, res) => {
  const { id } = req.params;

  try {
    await AuthUser.destroy({
      where: { id },
    });

    res.json({ message: "Auth user deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/accesses", requireAuthorization, requireFullAccess, async (req, res) => {
  try {
    const accesses = await Access.findAll({
      order: [
        ["resource", "ASC"],
        ["action", "ASC"],
      ],
    });

    res.json(accesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/users/:id/accesses", requireAuthorization, requireFullAccess, async (req, res) => {
  try {
    const user = await findUserWithAccesses(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    res.json({
      user: toPublicUser(user),
      catalog: ACCESS_CATALOG,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/users/:id/accesses", requireAuthorization, requireFullAccess, async (req, res) => {
  const { accesses = [] } = req.body;

  try {
    const user = await AuthUser.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    if (user.role === "ADMIN" || user.role === "DIRECTOR") {
      await UserAccess.destroy({ where: { userId: user.id } });
      const updatedUser = await findUserWithAccesses(user.id);
      return res.json(toPublicUser(updatedUser));
    }

    await setUserAccesses(user.id, accesses);
    const updatedUser = await findUserWithAccesses(user.id);
    res.json(toPublicUser(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function findUserWithAccesses(id) {
  return AuthUser.findByPk(id, {
    include: [
      {
        model: UserAccess,
        as: "userAccesses",
        include: [
          {
            model: Access,
            as: "access",
          },
        ],
      },
    ],
  });
}

async function setUserAccesses(userId, accessNames) {
  const uniqueAccessNames = [...new Set(accessNames)].filter((name) =>
    ACCESS_CATALOG.includes(name)
  );

  const accesses = await Access.findAll({
    where: {
      name: uniqueAccessNames,
    },
  });

  await UserAccess.destroy({
    where: {
      userId,
    },
  });

  await Promise.all(
    accesses.map((access) =>
      UserAccess.create({
        userId,
        accessId: access.id,
      })
    )
  );
}

function getRoleAccesses(role, accesses) {
  if (Array.isArray(accesses)) {
    return accesses;
  }

  return DEFAULT_ROLE_ACCESSES[role] || [];
}

module.exports = router;
