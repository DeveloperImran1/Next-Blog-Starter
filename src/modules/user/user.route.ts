import express from "express";
import { userController } from "./user.controller";
const router = express.Router();

router.get("/", userController.getAllUserFromDB);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUserById);
router.post("/", userController.createUser);
router.put("/", userController.updateUserById);

export const userRouter = router;
