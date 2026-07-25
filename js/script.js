document.addEventListener("DOMContentLoaded", function () {
    setupAttendancePage();
    setupContactPage();
});

function setupAttendancePage() {
    const attendanceForm = document.getElementById("attendanceForm");
    const clearAttendanceBtn = document.getElementById("clearAttendanceBtn");

    if (!attendanceForm) {
        return;
    }

    setTodayDate();
    displayAttendanceRecords();

    attendanceForm.addEventListener("submit", function (event) {
        event.preventDefault();
        saveAttendance();
    });

    if (clearAttendanceBtn) {
        clearAttendanceBtn.addEventListener("click", function () {
            clearAllAttendance();
        });
    }
}

function setTodayDate() {
    const attendanceDate = document.getElementById("attendanceDate");

    if (attendanceDate) {
        const today = new Date().toISOString().split("T")[0];
        attendanceDate.value = today;
    }
}

function getAttendanceRecords() {
    const records = localStorage.getItem("attendanceRecords");

    if (records) {
        return JSON.parse(records);
    }

    return [];
}

function saveAttendanceRecords(records) {
    localStorage.setItem("attendanceRecords", JSON.stringify(records));
}

function saveAttendance() {
    const studentPhotoInput = document.getElementById("studentPhoto");
    const studentId = document.getElementById("studentId").value.trim();
    const studentName = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const attendanceDate = document.getElementById("attendanceDate").value;
    const attendanceStatus = document.getElementById("attendanceStatus").value;

    if (!studentPhotoInput.files[0]) {
        alert("Please upload a student photo.");
        return;
    }

    if (!studentId || !studentName || !studentClass || !attendanceDate || !attendanceStatus) {
        alert("Please complete all attendance fields.");
        return;
    }

    const file = studentPhotoInput.files[0];

    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const studentPhoto = reader.result;
        const records = getAttendanceRecords();

        const newRecord = {
            id: Date.now(),
            studentPhoto: studentPhoto,
            studentId: studentId,
            studentName: studentName,
            studentClass: studentClass,
            attendanceDate: attendanceDate,
            attendanceStatus: attendanceStatus
        };

        records.push(newRecord);
        saveAttendanceRecords(records);

        document.getElementById("attendanceForm").reset();
        setTodayDate();
        displayAttendanceRecords();

        alert("Attendance saved successfully.");
    };

    reader.readAsDataURL(file);
}

function displayAttendanceRecords() {
    const cardGrid = document.getElementById("attendanceCardGrid");
    const emptyMessage = document.getElementById("emptyMessage");

    if (!cardGrid) {
        return;
    }

    const records = getAttendanceRecords();

    cardGrid.innerHTML = "";

    if (records.length === 0) {
        if (emptyMessage) {
            emptyMessage.style.display = "block";
        }
        return;
    }

    if (emptyMessage) {
        emptyMessage.style.display = "none";
    }

    records.forEach(function (record) {
        const card = document.createElement("div");
        card.className = "student-card";

        card.innerHTML = `
            <div class="student-card-image-wrapper">
                <img src="${record.studentPhoto}" alt="Student Photo" class="student-card-image">
            </div>

            <div class="student-card-body">
                <h3>${record.studentName}</h3>
                <p><strong>ID:</strong> ${record.studentId}</p>
                <p><strong>Class:</strong> ${record.studentClass}</p>
                <p><strong>Date:</strong> ${record.attendanceDate}</p>

                <span class="status-badge ${getStatusClass(record.attendanceStatus)}">
                    ${record.attendanceStatus}
                </span>

                <button class="delete-btn card-delete-btn" onclick="deleteAttendanceRecord(${record.id})">
                    Delete
                </button>
            </div>
        `;

        cardGrid.appendChild(card);
    });
}

function getStatusClass(status) {
    if (status === "Present") {
        return "status-present";
    }

    if (status === "Absent") {
        return "status-absent";
    }

    if (status === "Late") {
        return "status-late";
    }

    return "";
}

function deleteAttendanceRecord(recordId) {
    const confirmDelete = confirm("Are you sure you want to delete this attendance record?");

    if (!confirmDelete) {
        return;
    }

    let records = getAttendanceRecords();

    records = records.filter(function (record) {
        return record.id !== recordId;
    });

    saveAttendanceRecords(records);
    displayAttendanceRecords();
}

function clearAllAttendance() {
    const confirmClear = confirm("Are you sure you want to delete all attendance records?");

    if (!confirmClear) {
        return;
    }

    localStorage.removeItem("attendanceRecords");
    displayAttendanceRecords();
}

function setupContactPage() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendContactMessage();
    });
}

function sendContactMessage() {
    const contactName = document.getElementById("contactName").value.trim();
    const contactEmail = document.getElementById("contactEmail").value.trim();
    const contactMessage = document.getElementById("contactMessage").value.trim();
    const contactResult = document.getElementById("contactResult");

    if (!contactName || !contactEmail || !contactMessage) {
        alert("Please complete all contact fields.");
        return;
    }

    if (!validateEmail(contactEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    contactResult.textContent = `Thank you, ${contactName}. Your message has been received.`;

    document.getElementById("contactForm").reset();
}

function validateEmail(email) {
    return email.includes("@") && email.includes(".");
}
