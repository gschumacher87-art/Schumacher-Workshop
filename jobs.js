// ================= JOBS.JS =================
document.addEventListener("DOMContentLoaded", () => {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const container = document.getElementById("invoicesList"); // reuse invoices section

    if (!container) return;


    function saveJobs() {
        localStorage.setItem("jobs", JSON.stringify(jobs));
        renderJobs();
    }


    function getRepairTemplate(name) {
        const repairs = JSON.parse(localStorage.getItem("repairs")) || [];
        return repairs.find(r => r.name === name);
    }


    function renderJobs() {

        container.innerHTML = "<h3>Active Jobs</h3>";

        if (jobs.length === 0) {
            container.innerHTML += "No jobs yet.";
            return;
        }

        jobs.forEach((job, index) => {

            const row = document.createElement("div");

            Object.assign(row.style, {
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "8px"
            });

            // ===== HEADER =====
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


            // CLOCK ON
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

            // CLOCK OFF
            clockOff.onclick = () => {
                if (job.sessions?.length && !job.sessions[job.sessions.length - 1].end) {
                    job.sessions[job.sessions.length - 1].end = new Date().toISOString();
                    saveJobs();
                }
            };

            // FINISH
            finish.onclick = () => {
                job.status = "finished";
                job.finishedAt = new Date().toISOString();
                saveJobs();
            };

            btns.appendChild(clockOn);
            btns.appendChild(clockOff);
            btns.appendChild(finish);

            row.appendChild(btns);


            // ===== SESSIONS DISPLAY =====
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


            // ===== STATUS =====
            if (job.status === "finished") {
                row.style.opacity = "0.6";
            }

            container.appendChild(row);
        });
    }


    renderJobs();

});
