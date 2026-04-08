// ================= JOBS.JS =================
document.addEventListener("DOMContentLoaded", () => {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let todayJobs = JSON.parse(localStorage.getItem("todayJobs")) || [];
    let technicians = JSON.parse(localStorage.getItem("technicians")) || [];

    // ===== CHANGED CONTAINERS =====
    const todayContainer = document.getElementById("jobsTodayList");
    const activeContainer = document.getElementById("jobsActiveList");
    const techContainer = document.getElementById("availableTechs");

    if (!todayContainer || !activeContainer || !techContainer) return;


    function saveJobs() {
        localStorage.setItem("jobs", JSON.stringify(jobs));
        renderJobs();
    }

    function saveToday() {
        localStorage.setItem("todayJobs", JSON.stringify(todayJobs));
        renderJobs();
    }

    function getRepairTemplate(name) {
        const repairs = JSON.parse(localStorage.getItem("repairs")) || [];
        return repairs.find(r => r.name === name);
    }

    // ===== BUSY CHECK =====
    function isBusy(name) {
        return jobs.some(j =>
            j.technician === name &&
            j.sessions?.some(s => !s.end)
        );
    }


    function renderJobs() {

        // ===== AVAILABLE TECHS =====
        techContainer.innerHTML = "";

        technicians.forEach(t => {
            if (!isBusy(t.name)) {
                const div = document.createElement("div");
                div.textContent = t.name;
                div.style.cursor = "pointer";
                techContainer.appendChild(div);
            }
        });


        // ===== TODAY JOBS (UNASSIGNED) =====
        todayContainer.innerHTML = "";

        if (todayJobs.length === 0) {
            todayContainer.textContent = "No arrived jobs.";
        }

        todayJobs.forEach((job, index) => {

            const row = document.createElement("div");

            Object.assign(row.style, {
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "8px",
                cursor: "pointer"
            });

            row.textContent = `${job.customer} - ${job.vehicle} - ${job.repair}`;

            // CLICK JOB → THEN CLICK TECH
            row.onclick = () => {

                techContainer.querySelectorAll("div").forEach(tDiv => {

                    tDiv.onclick = () => {

                        jobs.push({
                            ...job,
                            technician: tDiv.textContent,
                            sessions: [],
                            status: "active"
                        });

                        todayJobs.splice(index, 1);

                        saveJobs();
                        saveToday();
                    };
                });
            };

            todayContainer.appendChild(row);
        });


        // ===== ACTIVE JOBS =====
        activeContainer.innerHTML = "<h3>Active Jobs</h3>";

        if (jobs.length === 0) {
            activeContainer.innerHTML += "No jobs yet.";
            return;
        }

        jobs.forEach((job, index) => {

            const row = document.createElement("div");

            Object.assign(row.style, {
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "8px"
            });

            const title = document.createElement("div");
            title.textContent = `${job.customer} - ${job.vehicle} - ${job.repair}`;
            row.appendChild(title);

            const tech = document.createElement("div");
            tech.textContent = `Technician: ${job.technician}`;
            row.appendChild(tech);


            // ===== CHECKLIST =====
            if (!job.checklist) {
                const template = getRepairTemplate(job.repair);
                job.checklist = template?.checklist?.map(c => ({ text: c, done: false })) || [];
                saveJobs();
                return;
            }

            const checklistDiv = document.createElement("div");

            job.checklist.forEach((item, i) => {

                const line = document.createElement("div");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = item.done;

                checkbox.addEventListener("change", () => {
                    job.checklist[i].done = checkbox.checked;
                    saveJobs();
                });

                const label = document.createElement("span");
                label.textContent = " " + item.text;

                line.appendChild(checkbox);
                line.appendChild(label);
                checklistDiv.appendChild(line);
            });

            row.appendChild(checklistDiv);


            // ===== BUTTONS =====
            const btns = document.createElement("div");

            const clockOn = document.createElement("button");
            clockOn.textContent = "Clock On";

            const clockOff = document.createElement("button");
            clockOff.textContent = "Clock Off";

            const finish = document.createElement("button");
            finish.textContent = "Finish";

            clockOn.onclick = () => {
                if (!job.sessions) job.sessions = [];

                if (!job.sessions.length || job.sessions[job.sessions.length - 1].end) {
                    job.sessions.push({
                        start: new Date().toISOString(),
                        end: null
                    });
                    saveJobs();
                }
            };

            clockOff.onclick = () => {
                if (job.sessions?.length && !job.sessions[job.sessions.length - 1].end) {
                    job.sessions[job.sessions.length - 1].end = new Date().toISOString();
                    saveJobs();
                }
            };

            finish.onclick = () => {
                job.status = "finished";
                job.finishedAt = new Date().toISOString();
                saveJobs();
            };

            btns.appendChild(clockOn);
            btns.appendChild(clockOff);
            btns.appendChild(finish);

            row.appendChild(btns);


            // ===== SESSIONS =====
            if (job.sessions?.length) {
                const sess = document.createElement("div");

                job.sessions.forEach(s => {
                    const start = new Date(s.start).toLocaleTimeString();
                    const end = s.end ? new Date(s.end).toLocaleTimeString() : "-";

                    const line = document.createElement("div");
                    line.textContent = `${start} - ${end}`;
                    sess.appendChild(line);
                });

                row.appendChild(sess);
            }

            if (job.status === "finished") {
                row.style.opacity = "0.6";
            }

            activeContainer.appendChild(row);
        });
    }

    window.renderJobs = renderJobs;
    renderJobs();

});