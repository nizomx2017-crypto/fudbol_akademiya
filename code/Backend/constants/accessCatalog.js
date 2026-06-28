const RESOURCES = [
  "dashboard",
  "students",
  "teachers",
  "courses",
  "groups",
  "payments",
  "rooms",
  "settings",
  "auth-users",
  "permissions",
];

const ACTIONS = ["view", "create", "update", "delete", "archive", "approve"];

const ACCESS_CATALOG = RESOURCES.flatMap((resource) =>
  ACTIONS.map((action) => `${resource}:${action}`)
);

module.exports = {
  ACCESS_CATALOG,
  ACTIONS,
  RESOURCES,
};
