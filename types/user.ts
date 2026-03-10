export type UserRow = {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
  created_at: string;
};

export type SafeUser = {
  id: number;
  username: string;
  email: string;
  balance: number;
  created_at: string;
};
