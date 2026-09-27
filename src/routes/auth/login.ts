import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { LoginInput } from "../../types/auth";
import { LoginToken } from "../../lib/auth/jwt";
import { validateLoginInput } from "../../validation/auth";

export async function login(input: LoginInput) {
  const { email, password } = input;

  validateLoginInput(email, password);

  const trimmedEmail = email.trim();

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // find user by email only
  const user = await prisma.users.findFirst({
    where: { email:trimmedEmail },
  });

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  // compare plain password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
    
  }


  const token = LoginToken({ id: user.id, email: user.email });
  const { password: _, ...safeUser } = user;
  return {user:safeUser, token}
}