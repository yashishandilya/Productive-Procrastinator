// src/utils/database.ts
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: import.meta.env.VITE_GCP_INSTANCE_IP,
  port: 5432,
  user: import.meta.env.VITE_GCP_USER,
  password: import.meta.env.VITE_GCP_PASSWORD,
  database: import.meta.env.VITE_GCP_DATABASE,
});

export interface TaskData {
  task_id?: string;
  task_name: string;
  importance: string;
  urgency: string;
  difficulty: string;
  mode: string;
  image_url?: string;
}

export async function createTask(taskData: TaskData): Promise<TaskData> {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO tasks (
        task_name, 
        importance, 
        urgency, 
        difficulty, 
        mode,
        image_url
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      taskData.task_name,
      taskData.importance,
      taskData.urgency,
      taskData.difficulty,
      taskData.mode,
      taskData.image_url
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAllTasks(): Promise<TaskData[]> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  } finally {
    client.release();
  }
}