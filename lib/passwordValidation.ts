/** Minimum length after trimming — keeps rules easy to explain in the UI. */
const MIN_LENGTH = 8;

/**
 * Client-side guard before we hit the network. Returns `null` if the password
 * is acceptable; otherwise a string we can show under the form. Trims
 * whitespace so users are not tripped up by accidental spaces.
 */
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
