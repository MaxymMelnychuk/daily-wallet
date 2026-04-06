const MIN_LENGTH = 8;

/** Returns a user-facing error string or `null` when the password meets policy. */
export function validatePassword(password: string): string | null {
  const trimmed = password.trim();
  if (trimmed.length < MIN_LENGTH) {
    return `Password must be at least ${MIN_LENGTH} characters`;
  }
  if (!/[a-z]/.test(trimmed)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(trimmed)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(trimmed)) {
    return "Password must contain at least one number";
  }
  return null;
}
