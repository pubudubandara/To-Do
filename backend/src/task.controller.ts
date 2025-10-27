import { Request, Response } from 'express';
import { pool } from './db';
import { RowDataPacket } from 'mysql2';
import { Task } from './task.model';

// Get 5 most recent incomplete tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<Task[] & RowDataPacket[]>(
      'SELECT * FROM task WHERE is_completed = FALSE ORDER BY created_at DESC LIMIT 5'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Add a new task
export const addTask = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO task (title, description) VALUES (?, ?)',
      [title, description]
    );
    
    // Fetch the newly created task to return it
    const [rows] = await pool.query<Task[] & RowDataPacket[]>(
      'SELECT * FROM task WHERE id = ?',
      [(result as any).insertId]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding task', error });
  }
};

// Mark a task as complete
export const completeTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'UPDATE task SET is_completed = TRUE WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task marked as complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error completing task', error });
  }
};

// Update a task (title/description)
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body as Partial<Pick<Task, 'title' | 'description'>>;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE task SET title = ?, description = ? WHERE id = ? AND is_completed = FALSE',
      [title, description ?? null, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or already completed' });
    }

    const [rows] = await pool.query<Task[] & RowDataPacket[]>(
      'SELECT * FROM task WHERE id = ?',
      [id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task permanently
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM task WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task', error });
  }
};