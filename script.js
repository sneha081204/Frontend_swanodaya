let students = JSON.parse(
    localStorage.getItem("students")
) || [];

let editId = null;


const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const rollNumber = document.getElementById("rollNumber");

const maths = document.getElementById("maths");
const science = document.getElementById("science");
const english = document.getElementById("english");
const computer = document.getElementById("computer");

const studentTableBody =
    document.getElementById("studentTableBody");

const emptyMessage =
    document.getElementById("emptyMessage");

const totalStudents =
    document.getElementById("totalStudents");

const classAverage =
    document.getElementById("classAverage");

const searchInput =
    document.getElementById("searchInput");

const gradeFilter =
    document.getElementById("gradeFilter");

const submitBtn =
    document.getElementById("submitBtn");


function calculatePercentage(student) {

    const total =
        student.maths +
        student.science +
        student.english +
        student.computer;

    return total / 4;


function calculateGrade(percentage) {

    if (percentage >= 90) {
        return "A";
    }

    if (percentage >= 75) {
        return "B";
    }

    if (percentage >= 60) {
        return "C";
    }

    if (percentage >= 40) {
        return "D";
    }

    return "F";
}



function calculateResult(student) {

   

    const passedAllSubjects =
        student.maths >= 40 &&
        student.science >= 40 &&
        student.english >= 40 &&
        student.computer >= 40;

    if (passedAllSubjects) {
        return "PASS";
    }

    return "FAIL";
}


function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

function validMarks(mark) {

    return (
        mark !== "" &&
        !isNaN(mark) &&
        Number(mark) >= 0 &&
        Number(mark) <= 100
    );
}


studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        studentName.value.trim();

    const roll =
        rollNumber.value.trim();


    const mathsMark =
        Number(maths.value);

    const scienceMark =
        Number(science.value);

    const englishMark =
        Number(english.value);

    const computerMark =
        Number(computer.value);

    if (
        name === "" ||
        roll === "" ||
        maths.value === "" ||
        science.value === "" ||
        english.value === "" ||
        computer.value === ""
    ) {

        alert("Please fill in all fields.");

        return;
    }


    if (
        !validMarks(maths.value) ||
        !validMarks(science.value) ||
        !validMarks(english.value) ||
        !validMarks(computer.value)
    ) {

        alert(
            "Marks must be numbers between 0 and 100."
        );

        return;
    }

    const duplicateRoll =
        students.some(function(student) {

            return (
                student.rollNumber === roll &&
                student.id !== editId
            );

        });


    if (duplicateRoll) {

        alert(
            "A student with this roll number already exists."
        );

        return;
    }


    if (editId !== null) {

        const student =
            students.find(function(student) {

                return student.id === editId;

            });


        if (student) {

            student.name = name;

            student.rollNumber = roll;

            student.maths = mathsMark;

            student.science = scienceMark;

            student.english = englishMark;

            student.computer = computerMark;
        }


        // Exit edit mode
        editId = null;

        submitBtn.textContent =
            "Add Student";
    }


    else {

        const newStudent = {

            id: Date.now(),

            name: name,

            rollNumber: roll,

            maths: mathsMark,

            science: scienceMark,

            english: englishMark,

            computer: computerMark
        };


        students.push(newStudent);
    }



    saveStudents();

    studentForm.reset();

    renderStudents();

});


function renderStudents(list = students) {

   
    studentTableBody.innerHTML = "";


   
    if (list.length === 0) {

        emptyMessage.style.display =
            "block";

        updateStatistics();

        return;
    }


    emptyMessage.style.display =
        "none";


    list.forEach(function(student) {

        const percentage =
            calculatePercentage(student);

        const grade =
            calculateGrade(percentage);

        const result =
            calculateResult(student);


        const row =
            document.createElement("tr");


       
        const resultClass =
            result === "PASS"
                ? "pass"
                : "fail";


        row.innerHTML = `

            <td>
                ${escapeHTML(student.name)}
            </td>

            <td>
                ${escapeHTML(student.rollNumber)}
            </td>

            <td>
                ${percentage.toFixed(2)}%
            </td>

            <td>
                <strong>${grade}</strong>
            </td>

            <td>
                <span class="${resultClass}">
                    ${result}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>

        `;


        studentTableBody.appendChild(row);

    });


    updateStatistics();
}


function editStudent(id) {

    const student =
        students.find(function(student) {

            return student.id === id;

        });


    if (!student) {
        return;
    }

    studentName.value =
        student.name;

    rollNumber.value =
        student.rollNumber;

    maths.value =
        student.maths;

    science.value =
        student.science;

    english.value =
        student.english;

    computer.value =
        student.computer;


    
    editId = id;


    submitBtn.textContent =
        "Update Student";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}

function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(function(student) {

            return student.id !== id;

        });


   
    saveStudents();

    if (editId === id) {

        editId = null;

        studentForm.reset();

        submitBtn.textContent =
            "Add Student";
    }

    renderStudents();
}

searchInput.addEventListener(
    "input",
    function() {

        applyFilters();

    }
);




gradeFilter.addEventListener(
    "change",
    function() {

        applyFilters();

    }
);



function applyFilters() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedGrade =
        gradeFilter.value;


    const filteredStudents =
        students.filter(function(student) {

            
            const matchesName =
                student.name
                    .toLowerCase()
                    .includes(searchTerm);


            
            const matchesRoll =
                student.rollNumber
                    .toLowerCase()
                    .includes(searchTerm);


           
            const percentage =
                calculatePercentage(student);

            const grade =
                calculateGrade(percentage);


            
            const matchesSearch =
                matchesName ||
                matchesRoll;


            
            const matchesGrade =
                selectedGrade === "all" ||
                grade === selectedGrade;


            return (
                matchesSearch &&
                matchesGrade
            );

        });


    renderStudents(filteredStudents);
}



function updateStatistics() {

    
    totalStudents.textContent =
        students.length;


   
    if (students.length === 0) {

        classAverage.textContent =
            "0%";

        return;
    }


    
    let totalPercentage = 0;


    students.forEach(function(student) {

        totalPercentage +=
            calculatePercentage(student);

    });


    
    const average =
        totalPercentage /
        students.length;


    classAverage.textContent =
        average.toFixed(2) + "%";
}




function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}



renderStudents();

