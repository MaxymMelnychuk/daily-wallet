export type SessionUser = {
  id: number;
  username: string;
  email: string;
};

export type TransactionType = "deposit" | "spend";

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
