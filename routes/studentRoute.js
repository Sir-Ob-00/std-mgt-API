import express from "express";
import {createStudent, getStudents, getStudentById, updateStudent, deleteStudent} from "../controllers/studentController.js";

const router = express.Router();

// Create a new student
router.post('/', createStudent);
// Get all students (with optional filtering + pagination)
router.get('/', getStudents);   
// Get a single student by ID
router.get('/:id', getStudentById);
// Update a student by ID
router.put('/:id', updateStudent);  
// Delete a student by ID
router.delete('/:id', deleteStudent);

export default router;