const AuthUser = require("./AuthUserModel");
const { hashPassword } = require("../utils/password");

function getSeedAccounts() {
  return Object.keys(process.env)
    .filter((key) => /^LOGIN_USER_\d+$/.test(key))
    .map((key) => key.split("_").pop())
    .sort((a, b) => Number(a) - Number(b))
    .map((index) => ({
      login: process.env[`LOGIN_USER_${index}`]?.trim(),
      password: process.env[`LOGIN_PASSWORD_${index}`]?.trim(),
    }))
    .filter((account) => account.login && account.password);
}

async function seedAuthUsers() {
  const count = await AuthUser.count();

  if (count > 0) {
    return;
  }

  const accounts = getSeedAccounts();

  await Promise.all(
    accounts.map((account) =>
      AuthUser.create({
        login: account.login,
        passwordHash: hashPassword(account.password),
      })
    )
  );
}

module.exports = seedAuthUsers;
