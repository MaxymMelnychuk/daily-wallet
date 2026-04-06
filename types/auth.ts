/**
 * Shared API and session DTOs. Keeps route handlers and the Redux client aligned on shapes.
 */

export type SessionUser = {
  id: number;
  username: string;
  email: string;
};

/** Ledger line items — matches DB `transactions.type` enum values. */
export const TRANSACTION_TYPES = ["deposit", "spend"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export type TransactionRow = {
  id: number;
  user_id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  created_at: string;
};

export type LoginResponse = {
  message?: string;
  user?: SessionUser;
  error?: string;
};

export type RegisterResponse = {
  message?: string;
  userId?: number;
  error?: string;
};

export type WalletResponse = {
  message?: string;
  balance?: number;
  transaction?: TransactionRow;
  error?: string;
};

export type TransactionsResponse = {
  transactions?: TransactionRow[];
  total?: number;
  page?: number;
  totalPages?: number;
  error?: string;
};

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

declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}
