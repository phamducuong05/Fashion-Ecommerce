import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";
import { AppError } from "../../utils/AppError";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
    }
  );
};

// 1. Register
const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new AppError("Email already in use!", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${data.name}`,
    },
  });

  const token = generateToken(newUser);

  const { password, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

// 2. Login
const login = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Email not found!", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Incorrect password!", 404);
  }

  const token = generateToken(user);

  const { password: pwd, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export default { register, login };
