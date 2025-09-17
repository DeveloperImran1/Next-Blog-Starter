import express from "express";
import { AuthController } from "./auth.controller";
const router = express.Router();

router.post("/", AuthController.loginWithEmail);

export const authRouter = router;
