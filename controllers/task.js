import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';

export const addTask = async (req, res) => {
    const {title, description} = req.body;
    const userId = req.userId;

    if (!title || !description) {
        return res.status(400).json({error: 'Title and description are required'});
    };

    try{
        const task = new Task({
            title,
            description,
            userId,
        })

        await task.save();
        res.status(201).json({message: 'Task added successfully', task});
    }catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({error: 'Internal server error'});
    }

}

export const getTasks = async (req, res) => {
    const userId = req.userId;

    try {
        const tasks = await Task.find({userId});
        res.status(200).json(tasks);
    }catch (error) {
        console.error('Error fecting tasks:', error);
        res.status(500).json({error: 'Internal server error'});
    }

}

export const updateTask = async (req, res) => {
    const userId = req.userId;
    const {title, description} = req.body;
    const {id} = req.params;

    try {
        const task = await Task.findOne({_id: id, userId});

        if (!task){
            return res.status(404).json({error: 'Task not found'});
        };

        task.title = title || task.title;
        task.description = description || task.description;

        await task.save();
        res.status(200).json({message: 'Task updated successfully', task});

    }catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const deleteTask = async (req, res) => {
    const userId = req.userId;
    const {id} = req.params;

    try{
        const task = await Task.findOne({_id: id, userId});

        if (!task) {
            return res.status(404).json({error: 'Task not found'})
        };

        res.status(200).json({message: 'Task deleted successfully', task});
    }catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({error: 'Internal server error'});
    }

}