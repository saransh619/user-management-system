import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import validate from "../middlewares/validateMiddleware";
import { CreateUser, UpdateUser } from "../utils/userValidation";

const router = express.Router();

router.post(
  "/users",
  authenticate,
  authorize("admin", "editor"),
  validate(CreateUser),
  createUser
);
router.get("/users", authenticate, getUsers);
router.get("/users/:id", authenticate, getUser);
router.put(
  "/users/:id",
  authenticate,
  authorize("admin", "editor"),
  validate(UpdateUser),
  updateUser
);
router.delete("/users/:id", authenticate, authorize("admin"), deleteUser);

export default router;
