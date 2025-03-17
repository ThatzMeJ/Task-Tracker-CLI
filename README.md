# Task Tracker CLI

A command-line interface application to efficiently track and manage your tasks.

## Features

- Add, update, and delete tasks
- Mark tasks as in-progress or done
- List all tasks
- Filter tasks by status (todo, in-progress, done)
- PostgreSQL database integration for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

## Installation

1. Clone this repository

   ```
   git clone https://github.com/yourusername/TaskTrackerCLI.git
   cd TaskTrackerCLI
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up your PostgreSQL database

   - Create a database named `TaskTracker`
   - Create a task table using the following SQL:

   ```sql
   CREATE TABLE task (
     task_id SERIAL PRIMARY KEY,
     description TEXT NOT NULL,
     status VARCHAR(20) DEFAULT 'todo',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT NULL
   );
   ```

4. Configure environment variables
   - Create a `.env` file in the root directory with the following content:
   ```
   DB_PORT=5432
   DB_NAME=TaskTracker
   DB_USERNAME=your_postgres_username
   DB_PASS=your_postgres_password
   ```

## Usage

### Adding a new task

```
node index.js add "Buy groceries"
```

### Updating a task

```
node index.js update 1 "Buy groceries and cook dinner"
```

### Deleting a task

```
node index.js delete 1
```

### Marking a task as in-progress

```
node index.js mark-in-progress 1
```

### Marking a task as done

```
node index.js mark-done 1
```

### Listing all tasks

```
node index.js list
```

### Listing tasks by status

```
node index.js list done
node index.js list todo
node index.js list inprogress
```

## Task Properties

Each task has the following properties:

- `task_id`: A unique identifier for the task
- `description`: A description of the task
- `status`: The status of the task (todo, in-progress, done)
- `created_at`: When the task was created
- `updated_at`: When the task was last updated

## Tech Stack

- **Node.js**: JavaScript runtime
- **Commander.js**: Complete solution for Node.js command-line interfaces
- **PostgreSQL**: Robust relational database for storing tasks
- **pg**: PostgreSQL client for Node.js
- **dotenv**: Environment variable management

## Project Structure

```
TaskTrackerCLI/
├── index.js          # Main CLI application
├── .env              # Environment variables
├── package.json      # Project metadata and dependencies
└── README.md         # Documentation
```

## Future Enhancements

- Add due dates for tasks
- Add priority levels
- Add categories/tags for tasks
- Export tasks to different formats (CSV, JSON)
- Add search functionality

## License

This project is licensed under the ISC License.
