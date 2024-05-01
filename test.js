const axios = require('axios');

// Base URL for your server
const baseURL = 'http://localhost:3000';

// Function to register a new user
const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${baseURL}/register`, {
            username,
            password
        });
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
};

// Function to login a user and obtain the token
const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${baseURL}/login`, {
            username,
            password
        });
        console.log('Login successful:', response.data);
        return response.data.token; // Return the token
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Function to retrieve all tasks
const getAllTasks = async (token) => {
    try {
        const response = await axios.get(`${baseURL}/tasks`, {
            headers: {
                Authorization: token // Include the token in the request headers
            }
        });
        console.log('All tasks:', response.data);
    } catch (error) {
        console.error('Failed to retrieve tasks:', error.response ? error.response.data : error.message);
    }
};

// Function to retrieve a specific task by ID
const getTaskById = async (taskId, token) => {
    try {
        const response = await axios.get(`${baseURL}/tasks/${taskId}`, {
            headers: {
                Authorization: token // Include the token in the request headers
            }
        });
        console.log('Task:', response.data);
    } catch (error) {
        console.error('Failed to retrieve task:', error.response ? error.response.data : error.message);
    }
};

// Function to create a new task
const createTask = async (title, description, status, assignee_id, token) => {
    try {
        const response = await axios.post(`${baseURL}/tasks`, {
            title,
            description,
            status,
            assignee_id
        }, {
            headers: {
                Authorization: token // Include the token in the request headers
            }
        });
        console.log('New task created:', response.data);
    } catch (error) {
        console.error('Failed to create task:', error.response ? error.response.data : error.message);
    }
};

// Function to update an existing task
const updateTask = async (taskId, title, description, status, assignee_id, token) => {
    try {
        const response = await axios.put(`${baseURL}/tasks/${taskId}`, {
            title,
            description,
            status,
            assignee_id
        }, {
            headers: {
                Authorization: token // Include the token in the request headers
            }
        });
        console.log('Task updated:', response.data);
    } catch (error) {
        console.error('Failed to update task:', error.response ? error.response.data : error.message);
    }
};

// Function to delete an existing task
const deleteTask = async (taskId, token) => {
    try {
        const response = await axios.delete(`${baseURL}/tasks/${taskId}`, {
            headers: {
                Authorization: token // Include the token in the request headers
            }
        });
        console.log('Task deleted:', response.data);
    } catch (error) {
        console.error('Failed to delete task:', error.response ? error.response.data : error.message);
    }
};

// Example usage of the functions
(async () => {
    try {
        const token = await loginUser('john_doe', 'password1');
        await getAllTasks(token);
        await registerUser('john_doe', 'password1');
        await getTaskById(1, token);
        await createTask('New Task', 'Description of New Task', 'pending', 1, token);
        await updateTask(1, 'Updated Task', 'Updated Description', 'completed', 2, token);
        await deleteTask(2, token);
    } catch (error) {
        console.error('Error:', error);
    }
})();
