import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllUserFromDB = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await userService.getUserById(id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await userService.updateUserById(id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await userService.deleteUserById(id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userController = {
  createUser,
  getAllUserFromDB,
  getUserById,
  updateUserById,
  deleteUserById,
};
