import express from 'express';
import {addTask, getTasks, updateTask, deleteTask} from '../controllers/task.js';
import {authenticate} from '../middlewares/auth.js';

const router = express.Router();

export default router;