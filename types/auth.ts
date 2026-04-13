/**
 * Types for anything that crosses the network boundary: JSON from API routes,
 * the Redux client, and the iron-session cookie. Keeping shapes here means the
 * UI and the server agree on field names (and we catch drift in TypeScript).
 */

/** Who is logged in — stored in the session cookie (no password, ever). */
export type SessionUser = {
  id: number;
  username: string;
  email: string;
};

/**
 * Allowed values for a ledger row’s `type` column. Exported as a const array
 * so routes can validate query params without duplicating string literals.
 */
export const TRANSACTION_TYPES = ["deposit", "spend"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/** One row from `transactions` as the API returns it (snake_case matches MySQL). */
export type TransactionRow = {
  id: number;
  user_id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  created_at: string;
};

/** Default `limit` for GET `/api/transactions` when missing or not a number. */
export const DEFAULT_TRANSACTIONS_LIMIT = 10;

/** Upper bound for `limit` so a client cannot request unbounded rows. */
export const MAX_TRANSACTIONS_LIMIT = 50;

/** Page size the dashboard ledger UI uses (can differ from API default). */
export const LEDGER_UI_PAGE_SIZE = 8;

/** POST `/api/login` — either a success payload or an `error` string. */
export type LoginResponse = {
  message?: string;
  user?: SessionUser;
  error?: string;
};

/** POST `/api/register` — `userId` is the new row’s auto-increment id. */
export type RegisterResponse = {
  message?: string;
  userId?: number;
  error?: string;
};

/** Deposit/spend routes: updated balance (and optional future transaction echo). */
export type WalletResponse = {
  message?: string;
  balance?: number;
  transaction?: TransactionRow;
  error?: string;
};

/** GET `/api/transactions` — paginated list plus metadata for the UI pager. */
export type TransactionsResponse = {
  transactions?: TransactionRow[];
  total?: number;
  page?: number;
  totalPages?: number;
  error?: string;
};

/** GET `/api/me` — full public profile row for refresh-from-server patterns. */
export type MeResponse = {
  user?: {
    id: number;
    username: string;
    email: string;
    balance: number;
    created_at: string;
  };
  error?: string;
};

/**
 * Tell iron-session what we stash in the encrypted cookie. Without this,
 * `session.user` would be untyped.
 */
declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}
