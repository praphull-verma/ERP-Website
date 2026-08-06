// validation/auth.ts
export function validateSignupInput(name: string, email: string, password: string) {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new Error("Name, email, and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
}

export function validateLoginInput(email: string, password: string) {
  if (!email?.trim() || !password) {
    throw new Error("Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error("Invalid email format");
  }
}