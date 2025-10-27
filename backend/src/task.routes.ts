import { Router } from 'express';
import { getTasks, addTask, completeTask, updateTask, deleteTask } from './task.controller';

export const taskRouter = Router();

taskRouter.get('/', getTasks);
taskRouter.post('/', addTask);
taskRouter.put('/:id', updateTask);
taskRouter.put('/:id/complete', completeTask);
taskRouter.delete('/:id', deleteTask);