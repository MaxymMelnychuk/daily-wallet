import { db } from "./db";
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { UserRow } from "@/types/user";
import type { SessionUser } from "@/types/auth";

export async function createUser(
  username: string,
  email: string,
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [existingRows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );
  const existing = existingRows as { id: number }[];
  if (existing.length > 0) throw new Error("Email already registered");

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, 0)",
    [username, email, hashedPassword],
  );

  return result.insertId;
}

export async function verifyUser(email: string, password: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  const users = rows as UserRow[];

  if (users.length === 0) return null;

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return { id: user.id, username: user.username, email: user.email } satisfies SessionUser;
}
