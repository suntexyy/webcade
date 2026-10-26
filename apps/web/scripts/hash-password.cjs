const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.cjs <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log("Value for Vercel's environment settings:");
console.log(hash);
console.log("\nLine for apps/web/.env.local:");
console.log("ADMIN_PASSWORD_HASH=" + hash.replace(/\$/g, "\\$"));
