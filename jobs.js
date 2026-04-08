document.addEventListener("DOMContentLoaded", () => {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let todayJobs = JSON.parse(localStorage.getItem("todayJobs")) || [];
    let technicians = JSON.parse(localStorage.getItem("technicians")) || [];

    const techContainer = document.getElementById("availableTechs");
    const todayContainer = document.getElementById("jobsTodayList");
    const activeContainer = document.getElementById("jobsActiveList");

    function save() {
        localStorage.setItem("jobs", JSON.stringify(jobs));
        localStorage.setItem("todayJobs", JSON.stringify(todayJobs));
        renderJobs();
    }

    function isBusy(name) {
        return jobs.some(j => j.technician === name && j.sessions?.some(s => !s.end));
    }

    function renderJobs() {

        techContainer.innerHTML = "";
        technicians.forEach(t => {
            if (!isBusy(t.name)) {
                const div = document.createElement("div");
                div.textContent = t.name;
                div.style.display = "inline-block";
                div.style.margin = "5px";
                div.style.padding = "6px";
                div.style.border = "1px solid #ccc";
                techContainer.appendChild(div);
            }
        });

        todayContainer.innerHTML = "";
        todayJobs.forEach((job, i) => {

            const row = document.createElement("div");
            row.textContent = `${job.customer} - ${job.vehicle} - ${job.repair}`;

            row.onclick = () => {
                techContainer.querySelectorAll("div").forEach(tDiv => {
                    tDiv.onclick = () => {
                        jobs.push({ ...job, technician: tDiv.textContent, sessions: [] });
                        todayJobs.splice(i,1);
                        save();
                    };
                });
            };

            todayContainer.appendChild(row);
        });

        activeContainer.innerHTML = "";
        jobs.forEach(job => {

            const row = document.createElement("div");
            row.textContent = `${job.customer} - ${job.vehicle} (${job.technician})`;

            const on = document.createElement("button");
            on.textContent = "On";

            const off = document.createElement("button");
            off.textContent = "Off";

            on.onclick = () => {
                job.sessions.push({ start: new Date().toISOString(), end: null });
                save();
            };

            off.onclick = () => {
                const s = job.sessions[job.sessions.length-1];
                if (s && !s.end) s.end = new Date().toISOString();
                save();
            };

            row.appendChild(on);
            row.appendChild(off);

            activeContainer.appendChild(row);
        });
    }

    window.renderJobs = renderJobs;
});