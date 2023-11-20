import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/postsController.js";
import { verifyToken } from "../middleware/middleAuth.js";
import { verify } from "crypto";

const router = express.Router();

// Read
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// Write
router.patch("/:id/like", verifyToken, likePost);

export default router;
