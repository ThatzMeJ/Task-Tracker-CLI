const { program } = require("commander");
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: "localhost",
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS, // In production, use environment variables
};

// Helper function to get database connection
async function getDbClient() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// Define the CLI program
program.version("1.0.0");

// First command: greet
program
  .command("add")
  .argument("<newTask>", "Add new task")
  .action(async (newTask) => {
    const db = await getDbClient();
    try {
      const createTask = await db.query(
        `
      INSERT INTO task (description) 
      VALUES ($1);`,
        [newTask]
      );

      // Query was unsuccessful
      if (createTask.rowCount < 1) throw new Error("Unable to complete query.");
      else console.log("Created new task!");
    } catch (error) {
      console.error("Error add command: ", error);
    } finally {
      await db.end();
    }
  });

// Second command: info
program
  .command("update")
  .argument("<taskID>", "The task ID number you want to update.")
  .argument("<newTask>", "The new task description")
  .option("--detailed", "show detailed information")
  .action(async (taskID, newTask, options) => {
    const db = await getDbClient();
    try {
      if (!taskID || !newTask) throw new Error("Need task_id and the name of the new task.");


      const updateTaskById = await db.query(
        `
        UPDATE task 
        SET description = $1
        WHERE task_id = $2;`,
        [newTask, taskID]
      );

      if (updateTaskById.rowCount < 1)
        throw new Error("Unable to complete query.");
      else console.log("Updated task!");
    } catch (error) {
      console.error("Update command error: ", error);
    } finally {
      await db.end();
    }
  });

program
  .command("delete")
  .argument("<taskID>", "The task ID number you want to update.")
  .option("--detailed", "show detailed information")
  .action(async (taskID, options) => {
    const db = await getDbClient();

    try {
      if (!taskID) throw new Error("Need task id to delete specifc task.");

      const deleteTask = await db.query(
        `
        DELETE FROM task 
        WHERE task_id = $1 
        RETURNING *;`,
        [taskID]
      );

      if (deleteTask.rowCount < 1) throw new Error("Task ID not found.");
      else console.log(deleteTask.rows[0]);

    } catch (error) {
      console.error(error);
    } finally {
      await db.end();
    }
  });

program
  .command("list")
  .argument("[status]", "Give all tasks that are have a status of done.")
  .option(
    "--help",
    "Show detail information about this command and what arguemnts can go into [status]."
  )
  .action(async (status, options) => {
    const db = await getDbClient();

    try {
      const validStatuses = ["done", "todo", "inprogress"];

      if (status && !validStatuses.includes(status)) {
        throw new Error("Please select the correct status option.");
      }

      switch (status) {
        case validStatuses[0]:
          const tasksDone = await db.query(`
          SELECT * FROM task 
          WHERE status = 'done';
          `);
          console.log(tasksDone.rows);
          break;
        case validStatuses[1]:
          const tasksToDo = await db.query(`
            SELECT * FROM task 
            WHERE status = 'todo';
            `);
          console.log(tasksToDo.rows);
          break;
        case validStatuses[2]:
          const tasksInProgress = await db.query(`
            SELECT * FROM task 
            WHERE status = 'in-progress';
            `);
          console.log(tasksInProgress.rows);
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      await db.end();
    }
  });

program
  .command("mark-in-progress")
  .argument(
    "<taskID>",
    "The task ID number you want to mark status as in-progress."
  )
  .option("--detailed", "show detailed information")
  .action(async (taskID, options) => {
    const db = await getDbClient();

    try {
      if (!taskID) throw new Error("Need task id to delete specifc task.");

      const updateStatus = await db.query(
        `
        UPDATE task 
        SET status='in-progress'
        where task_id = $1
        RETURNING *;`,
        [taskID]
      );

      if (updateStatus.rows[0] === null)
        throw new Error("Unable to find task id.");
      else console.log(updateStatus.rows[0]);
    } catch (error) {
      console.error(error);
    } finally {
      await db.end();
    }
  });


  program
  .command("mark-done")
  .argument(
    "<taskID>",
    "The task ID number you want to mark status as done."
  )
  .option("--detailed", "show detailed information")
  .action(async (taskID, options) => {
    const db = await getDbClient();

    try {
      if (!taskID) throw new Error("Need task id to delete specifc task.");

      const updateStatus = await db.query(
        `
        UPDATE task 
        SET status='done'
        where task_id = $1
        RETURNING *;`,
        [taskID]
      );

      if (updateStatus.rows[0] === null)
        throw new Error("Unable to find task id.");
      else console.log(updateStatus.rows[0]);
    } catch (error) {
      console.error(error);
    } finally {
      await db.end();
    }
  });

// Add a default command that requires no input
program
  .command("help")
  .description("Display help information")
  .action(() => {
    console.log("Welcome to My CLI Tool!");
    console.log("------------------------");
    console.log("Available commands:");
    console.log("  greet <name> [dest] - Greet someone");
    console.log("  info <age> [home] - Display information");
    console.log("  help - Display this help message");
    console.log("\nFor more details, use --help with any command");
  });

// Add default behavior when no command is specified
if (process.argv.length <= 2) {
  console.log("Welcome to My CLI Tool!");
  console.log("------------------------");
  console.log('Run "node index.js help" to see available commands');
  console.log("");
}

console.log("Length of argv: ", process.argv.length);
program.parse(process.argv);
