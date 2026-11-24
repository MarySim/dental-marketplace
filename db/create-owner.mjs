import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { betterAuth } from "better-auth";
import pg from "pg";
import { hasOwnerAuthSecret, ownerAuthOptions } from "../src/lib/owner-auth-options.mjs";

async function createOwner() {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("Запусти команду в обычном интерактивном терминале.");
  }
  if (!process.env.DATABASE_URL || !hasOwnerAuthSecret()) {
    throw new Error("Сначала настрой DATABASE_URL и OWNER_AUTH_SECRET.");
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
  try {
    const existing = await pool.query("SELECT 1 FROM owner_user LIMIT 1");
    if (existing.rowCount) throw new Error("Аккаунт владельца уже создан.");

    const terminal = createInterface({ input: stdin, output: stdout });
    let email;
    try {
      email = (await terminal.question("Электронная почта владельца: ")).trim().toLowerCase();
    } finally {
      terminal.close();
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Проверь адрес электронной почты.");
    }

    const password = randomBytes(24).toString("base64url");
    const auth = betterAuth(ownerAuthOptions(pool, { provision: true }));
    try {
      await auth.api.signUpEmail({ body: { email, password, name: "Store owner" } });
    } catch {
      throw new Error("Не удалось создать аккаунт владельца. Проверь настройки базы и повтори команду.");
    }

    stdout.write(`Аккаунт владельца создан. Сохрани пароль в менеджере паролей.\nПароль: ${password}\n`);
  } finally {
    await pool.end();
  }
}

try {
  await createOwner();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
