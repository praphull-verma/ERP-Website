import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { LoginInput } from "../../types/auth";

export async function login(input: LoginInput) {
  const { email, password } = input;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // find user by email only
  const user = await prisma.users.findFirst({
    where: { email },
  });

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  // compare plain password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}