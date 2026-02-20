import Student from '../models/student.js';

// ---------------- CREATE ----------------
export const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            data: student
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ---------------- GET ALL (with optional filtering + pagination) ----------------
export const getStudents = async (req, res) => {
    try {
        const { course, page = 1, limit = 10 } = req.query;

        const filter = course ? { course } : {};

        const students = await Student.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit);

        res.json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ---------------- GET SINGLE STUDENT----------------
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ---------------- UPDATE ----------------
export const updateStudent = async (req, res) => {
    try {
            const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',  // replaces new: true
            runValidators: true // enforce schema validations
        });

            if (!student) return res.status(404).json({ success: false, message: "Student not found" });

            res.json({ success: true, data: student });
    } catch (error) {
            if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ---------------- DELETE ----------------
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        res.json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};