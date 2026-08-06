import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../../lib/auth/jwt";
export async function signup(input) {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    const token = signToken({ id: user.id, email: user.email });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
    // hash password
    // don't return password
}
