const RENDER_URL = 'https://std-mgt-o4m9.onrender.com';

const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const errorMessage = document.getElementById('errorMessage');

let editMode = false;
let editId = null;

// ---------------- FETCH STUDENTS ----------------
const fetchStudents = async () => {
    try {
        const res = await fetch(`${RENDER_URL}/api/students`);
        const data = await res.json();

        tableBody.innerHTML = '';

        data.data.forEach(student => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.course}</td>
                <td>${student.gpa}</td>
                <td>${student.enrolled ? 'Yes' : 'No'}</td>
                <td>
                    <button onclick="editStudent('${student._id}')">Edit</button>
                    <button onclick="deleteStudent('${student._id}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        errorMessage.textContent = 'Failed to fetch students.';
    }
};

// ---------------- DELETE STUDENT ----------------
const deleteStudent = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
        const res = await fetch(`${RENDER_URL}/api/students/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error('Failed to delete student');
        }

        fetchStudents();

    } catch (error) {
        errorMessage.textContent = error.message;
    }
};

// ---------------- LOAD STUDENT INTO FORM (EDIT MODE) ----------------
const editStudent = async (id) => {
    try {
        const res = await fetch(`${RENDER_URL}/api/students/${id}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error('Failed to fetch student data');
        }

        const student = data.data;

        document.getElementById('name').value = student.name;
        document.getElementById('age').value = student.age;
        document.getElementById('course').value = student.course;
        document.getElementById('gpa').value = student.gpa;
        document.getElementById('enrolled').checked = student.enrolled;

        editMode = true;
        editId = id;

    } catch (error) {
        errorMessage.textContent = error.message;
    }
};

// ---------------- CREATE OR UPDATE STUDENT ----------------
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const studentData = {
        name: document.getElementById('name').value,
        age: Number(document.getElementById('age').value),
        course: document.getElementById('course').value,
        gpa: Number(document.getElementById('gpa').value),
        enrolled: document.getElementById('enrolled').checked
    };

    try {

        let res;

        if (editMode) {
            // UPDATE
            res = await fetch(`${RENDER_URL}/api/students/${editId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            editMode = false;
            editId = null;

        } else {
            // CREATE
            res = await fetch(`${RENDER_URL}/api/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });
        }

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || 'Operation failed');
        }

        form.reset();
        fetchStudents();

    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

// ---------------- INITIAL LOAD ----------------
fetchStudents();