import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskModel } from './TaskModel';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [newTask, setNewTask] = useState<Omit<TaskModel, 'id'>>({ name: '', priority: 1, status: 'Not Started' });
    const [editTask, setEditTask] = useState<TaskModel | null>(null);
    const [error, setError] = useState<string>('');

    const API_URL = 'https://localhost:7216/api/todo';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<TaskModel[]>(API_URL);
            setTasks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTask = async () => {
        try {
            await axios.post(API_URL, newTask);
            fetchTasks();
            setNewTask({ name: '', priority: 1, status: 'Not Started' });
            setError('');
        } catch (err: any) {
            setError(err.response?.data || 'Failed to add task.');
        }
    };

    const updateTask = async (id: number, updatedTask: Omit<TaskModel, 'id'>) => {
        try {
            await axios.put(`${API_URL}/${id}`, updatedTask);
            fetchTasks();
            setError('');
        } catch (err: any) {
            setError(err.response?.data || 'Failed to update task.');
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTasks();
        } catch (err: any) {
            setError(err.response?.data || 'Failed to delete task.');
        }
    };

    const startEditTask = (task: TaskModel) => {
        setEditTask(task);
    };

    const saveEditTask = async () => {
        if (editTask) {
            await updateTask(editTask.id, {
                name: editTask.name,
                priority: editTask.priority,
                status: editTask.status,
            });
            setEditTask(null);
        }
    };

    return (
        <div>
            <h1>TODO Application</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
                />
                <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button onClick={addTask}>Add Task</button>
            </div>

            <h2>Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {editTask && editTask.id === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editTask.name}
                                    onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editTask.priority}
                                    onChange={(e) => setEditTask({ ...editTask, priority: parseInt(e.target.value) })}
                                />
                                <select
                                    value={editTask.status}
                                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <button onClick={saveEditTask}>Save</button>
                                <button onClick={() => setEditTask(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {task.name} - Priority: {task.priority} - Status: {task.status}
                                <button onClick={() => startEditTask(task)}>Edit</button>
                                {task.status === 'Completed' && (
                                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
