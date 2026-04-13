/**
 * Shapes that mirror the `users` table in MySQL. The app never sends `password`
 * back to the browser — use `SafeUser` (or pick fields) for API responses.
 */

/** Full row as returned by `SELECT *` — includes the bcrypt hash. */
export type UserRow = {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
  created_at: string;
};

/**
 * Same as `UserRow` but without `password`. Handy when typing `/api/me` or
 * any code path that must not accidentally serialize the hash.
 */
export type SafeUser = Omit<UserRow, "password">;
