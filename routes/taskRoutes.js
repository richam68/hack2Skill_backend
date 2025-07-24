const express = require("express");
const {
  createTask,
  getTasks,
  editTask,
  removeTask,
  getSubtasksController,
  updateSubtasksController,
} = require("../controllers/taskController");

const validateTokenHandler = require("../middlewares/validateToken");
const router = express.Router();

// Apply token validation middleware to all routes in this router
router.use(validateTokenHandler);
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task and Subtask management
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - lastDate
 *               - status
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Complete NodeJS project
 *               lastDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-24
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed]
 *                 example: pending
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - subject
 *                     - lastDate
 *                     - status
 *                   properties:
 *                     subject:
 *                       type: string
 *                       example: Setup project structure
 *                     lastDate:
 *                       type: string
 *                       format: date
 *                       example: 2026-12-24
 *                     status:
 *                       type: string
 *                       enum: [pending, in progress, completed]
 *                       example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 lastDate:
 *                   type: string
 *                   format: date
 *                 status:
 *                   type: string
 *                   enum: [pending, in progress, completed]
 *                 isDeleted:
 *                   type: boolean
 *                 subtasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subject:
 *                         type: string
 *                       lastDate:
 *                         type: string
 *                         format: date
 *                       status:
 *                         type: string
 *                         enum: [pending, in progress, completed]
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all non-deleted tasks and subtasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */

// Route to create a new task
router.route("/").post(createTask).get(getTasks);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to update, use only _id:68817df3591137b9ba5dbaa1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               lastDate:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Soft delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.route("/:taskId").put(editTask).delete(removeTask);

/**
 * @swagger
 * /api/tasks/{taskId}/subtasks:
 *   get:
 *     summary: Get all subtasks for a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: List of subtasks
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/tasks/{taskId}/subtasks:
 *   put:
 *     summary: Update subtasks of a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     lastDate:
 *                       type: string
 *                     status:
 *                       type: string
 *     responses:
 *       200:
 *         description: Subtasks updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */

// Route to get all subtasks for a specific task
router
  .route("/:taskId/subtasks")
  .get(getSubtasksController)
  .put(updateSubtasksController);

module.exports = router;
