import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { accessChat, addToGroup, createGroupChat, renameGroup, removeFromGroup } from "../controllers/chatControllers.js";
import { fetchChats } from "../controllers/chatControllers.js";


const router = express.Router();

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat);
router.put('/rename', protect, renameGroup);
router.put('/groupadd', protect, addToGroup);
router.put('/groupremove', protect, removeFromGroup);

export default router;