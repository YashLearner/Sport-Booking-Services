import express from "express";
import {
  createCourt,
  getAllCourts,
  getCourtById,
  updateCourt,
  deleteCourt,
} from "../controllers/courtController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.post("/",authMiddleware,authorizeRoles("admin"),createCourt);

router.get("/", getAllCourts);

router.get("/:id", getCourtById);

router.put("/:id",authMiddleware,authorizeRoles("admin"),updateCourt);

router.delete("/:id",authMiddleware,authorizeRoles("admin"),deleteCourt);

export default router;