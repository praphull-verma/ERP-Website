import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { SignupInput } from "../../types/auth";

import { signToken } from "../../lib/auth/jwt";
import { validateSignupInput } from "../../validation/auth";

export async function signup(input: SignupInput) {
  const { name, email, password } = input;



  validateSignupInput(name, email, password);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  // check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: { email: trimmedEmail },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,

    },
  });



  const token = signToken({ id: user.id, email: user.email });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}