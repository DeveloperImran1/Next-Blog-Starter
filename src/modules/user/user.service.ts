import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({ data: payload });
  return createdUser;
};

const getAllUserFromDB = async () => {
  const allUser = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      status: true,
      posts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return allUser;
};

const getUserById = async (id: number) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  return result;
};

const updateUserById = async (id: number, payload) => {
  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteUserById = async (id: number) => {
  const result = await prisma.user.delete({
    where: { id },
  });

  return result;
};

export const userService = {
  createUser,
  getAllUserFromDB,
  getUserById,
  updateUserById,
  deleteUserById,
};
