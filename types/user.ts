/**
 * Database row shapes for `users`. `SafeUser` is what we expose after stripping `password`.
 */

export type UserRow = {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
  created_at: string;
};

export type SafeUser = Omit<UserRow, "password">;
