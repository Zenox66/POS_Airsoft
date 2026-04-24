function renderLogs() {
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    let table = document.getElementById("logTable");

    if (!table) return;

    table.innerHTML = "";

    logs.forEach(log => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${log.username}</td>
            <td>${formatTime(log.timeIn)}</td>
            <td>${log.timeOut ? formatTime(log.timeOut) : "—"}</td>
        `;

        table.appendChild(row);
    });
}

// FORMAT TIME
function formatTime(time) {
    let date = new Date(time);
    return date.toLocaleString();
}

// CALL IT
renderLogs();