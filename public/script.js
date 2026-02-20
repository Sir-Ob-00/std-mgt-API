const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const errorMessage = document.getElementById('errorMessage');

// ---------------- FETCH STUDENTS ----------------
const fetchStudents = async () => {
    try {
        const res = await fetch('/api/students');
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
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        errorMessage.textContent = 'Failed to fetch students.';
    }
};

// ---------------- CREATE STUDENT ----------------
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
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || 'Failed to create student');
        }

        form.reset();
        fetchStudents();

    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

// Load students on page load
fetchStudents();