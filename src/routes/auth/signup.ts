import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { SignupInput } from "../../types/auth";


export async function signup(input: SignupInput) {
  const { name, email, password } = input;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  // check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      
    },
  });

  // don't return password
  const { password: _, ...safeUser } = user;
  return safeUser;
}