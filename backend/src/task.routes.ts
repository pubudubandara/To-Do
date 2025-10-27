import { Router } from 'express';
import { getTasks, addTask, updateTask, deleteTask } from './task.controller';

export const taskRouter = Router();

taskRouter.get('/', getTasks);
taskRouter.post('/', addTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);