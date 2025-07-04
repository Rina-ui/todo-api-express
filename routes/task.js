import express from 'express';
import {addTask, getTasks, updateTask, deleteTask} from '../controllers/task.js';
import {authenticate} from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, addTask);
router.get('/', authenticate, getTasks);        
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);


export default router;