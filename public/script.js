// ---------------- CONFIG ----------------
const API_URL = '/api/students';

document.addEventListener('DOMContentLoaded', () => {

    // ---------------- DOM ELEMENTS ----------------
    const form = document.getElementById('studentForm');
    const tableBody = document.getElementById('studentTableBody');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!form || !tableBody) {
        console.error('Required DOM elements not found.');
        return;
    }

    let editMode = false;
    let editId = null;

    // ---------------- FETCH STUDENTS ----------------
    const fetchStudents = async () => {
        try {
            const res = await fetch(API_URL);

            if (!res.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await res.json();

            tableBody.innerHTML = '';

            const students = data.data || data;

            if (!students.length) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center;">
                            No students found.
                        </td>
                    </tr>
                `;
                return;
            }

            students.forEach(student => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.course}</td>
                    <td>${student.gpa}</td>
                    <td>${student.enrolled ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="edit-btn" data-id="${student._id}">Edit</button>
                        <button class="delete-btn" data-id="${student._id}">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

        } catch (error) {
            errorMessage.textContent = error.message;
            console.error(error);
        }
    };

    // ---------------- DELETE STUDENT ----------------
    const deleteStudent = async (id) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Failed to delete student');
            }

            await fetchStudents();

        } catch (error) {
            errorMessage.textContent = error.message;
            console.error(error);
        }
    };

    // ---------------- EDIT STUDENT ----------------
    const editStudent = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`);

            if (!res.ok) {
                throw new Error('Failed to fetch student data');
            }

            const data = await res.json();
            const student = data.data || data;

            document.getElementById('name').value = student.name;
            document.getElementById('age').value = student.age;
            document.getElementById('course').value = student.course;
            document.getElementById('gpa').value = student.gpa;
            document.getElementById('enrolled').checked = student.enrolled;

            editMode = true;
            editId = id;
            submitButton.textContent = 'Update Student';

        } catch (error) {
            errorMessage.textContent = error.message;
            console.error(error);
        }
    };

    // ---------------- HANDLE TABLE BUTTON CLICKS (EVENT DELEGATION) ----------------
    tableBody.addEventListener('click', (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains('delete-btn')) {
            deleteStudent(id);
        }

        if (e.target.classList.contains('edit-btn')) {
            editStudent(id);
        }
    });

    // ---------------- FORM SUBMIT ----------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const studentData = {
            name: document.getElementById('name').value.trim(),
            age: Number(document.getElementById('age').value),
            course: document.getElementById('course').value.trim(),
            gpa: Number(document.getElementById('gpa').value),
            enrolled: document.getElementById('enrolled').checked
        };

        try {
            let res;

            if (editMode) {
                res = await fetch(`${API_URL}/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentData)
                });

                editMode = false;
                editId = null;
                submitButton.textContent = 'Add Student';

            } else {
                res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentData)
                });
            }

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Operation failed');
            }

            form.reset();
            await fetchStudents();

        } catch (error) {
            errorMessage.textContent = error.message;
            console.error(error);
        }
    });

    // ---------------- INITIAL LOAD ----------------
    fetchStudents();
});