import mogoose from 'mongoose';

const studentSchema = new mogoose.Schema({
    name: {
        type: String, 
        required: [true, "Student name is required"]
    },
    age: { 
        type: Number, 
        required: [true, "Student age is required"],
        min: [0, "Age cannot be negative"],
        max: [60, "Student age cannot be greater than 60"]
    },
    course: {
        type: String, 
        required: [true, "Student course is required"]  
    },
    enrolled: {
        type: Boolean, 
        default: true
    },
    gpa: {
        type: Number, 
        min: 0, 
        max: 4
    }
}, {
    timestamps: true
});

const Student = mogoose.model('students', studentSchema);

export default Student;