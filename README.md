## Endpoint Test Data

This document provides details about the endpoint test data for the API.

### Base URL

The base URL for the API is `http://localhost:3000`.

### Endpoints

#### 1. Register User

- **Endpoint**: `POST /register`
- **Description**: Registers a new user with the system.
- **Input Data**:
  - `username` (string): The username of the user to be registered.
  - `password` (string): The password of the user account.
- **Sample Request**:
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **Sample Response** (Success):
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Sample Response** (Failure):
  ```json
  {
    "error": "Username already exists"
  }
  ```

#### 2. Login User

- **Endpoint**: `POST /login`
- **Description**: Logs in a registered user and returns an authentication token.
- **Input Data**:
  - `username` (string): The username of the user.
  - `password` (string): The password of the user account.
- **Sample Request**:
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **Sample Response** (Success):
  ```json
  {
    "token": "<authentication_token>"
  }
  ```
- **Sample Response** (Failure):
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

#### 3. Retrieve All Tasks

- **Endpoint**: `GET /tasks`
- **Description**: Retrieves all tasks from the system.
- **Authentication**: Requires a valid authentication token in the request headers.
- **Sample Response** (Success):
  ```json
  [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Description of Task 1",
      "status": "pending",
      "assignee_id": 1,
      "created_at": "2024-05-01T12:00:00Z",
      "updated_at": "2024-05-01T12:00:00Z"
    },
    {
      "id": 2,
      "title": "Task 2",
      "description": "Description of Task 2",
      "status": "completed",
      "assignee_id": 2,
      "created_at": "2024-05-02T12:00:00Z",
      "updated_at": "2024-05-03T12:00:00Z"
    }
  ]
  ```
- **Sample Response** (Failure):
  ```json
  {
    "error": "Unauthorized"
  }
  ```

#### 4. Retrieve Task by ID

- **Endpoint**: `GET /tasks/:id`
- **Description**: Retrieves a specific task by its ID.
- **Authentication**: Requires a valid authentication token in the request headers.
- **Input Data**:
  - `id` (integer): The ID of the task to retrieve.
- **Sample Response** (Success):
  ```json
  {
    "id": 1,
    "title": "Task 1",
    "description": "Description of Task 1",
    "status": "pending",
    "assignee_id": 1,
    "created_at": "2024-05-01T12:00:00Z",
    "updated_at": "2024-05-01T12:00:00Z"
  }
  ```
- **Sample Response** (Failure):
  ```json
  {
    "error": "Task not found"
  }
  ```

---

You can continue documenting other endpoints in a similar manner, providing details about their input data requirements, authentication requirements, and sample responses for success and failure cases. This documentation can help developers understand how to interact with your API endpoints and what to expect in terms of input and output data.

## Sample Executed Images
![image](https://github.com/Tallamjayaram/epimax/assets/113671913/3f5ac555-d80c-4eb4-9eaf-d1bcc6ff069e)
![image](https://github.com/Tallamjayaram/epimax/assets/113671913/91706bbf-093c-4d3d-92df-e71ddb0e4567)

