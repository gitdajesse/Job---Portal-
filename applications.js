// Application-related functionality for both employer and seeker dashboards
document.addEventListener("DOMContentLoaded", function () {
  // Update employer's view of applications
  function updateEmployerApplications() {
    const container = document.getElementById("applicationsList");
    if (!container) return;

    container.innerHTML = "";

    const currentUser = JSON.parse(
      localStorage.getItem("jobportal_current_user")
    );
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    // Filter applications for this employer's jobs
    const employerApplications = applications.filter(
      (app) => app.employerId === currentUser.email
    );

    employerApplications.forEach((app) => {
      const card = document.createElement("div");
      card.className = "application-card";
      card.innerHTML = `
        <h3>${app.seekerName} - ${app.title}</h3>
        <div class="applicant-info">
          <p><strong>Email:</strong> ${app.seekerEmail}</p>
          <p><strong>Phone:</strong> ${app.seekerPhone || "Not provided"}</p>
          <p><strong>Skills:</strong> ${
            app.seekerSkills?.join(", ") || "None listed"
          }</p>
        </div>
        <p><strong>Status:</strong> 
          <span class="status-${app.status}">${app.status}</span>
        </p>
        ${
          app.status === "pending"
            ? `
          <div class="application-actions">
            <button class="btn btn-primary accept-btn" data-app-id="${app.id}">
              Accept
            </button>
            <button class="btn btn-danger reject-btn" data-app-id="${app.id}">
              Reject
            </button>
          </div>
          `
            : ""
        }
      `;
      container.appendChild(card);
    });

    // Add event listeners
    document.querySelectorAll(".accept-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateApplicationStatus(this.getAttribute("data-app-id"), "accepted");
      });
    });

    document.querySelectorAll(".reject-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateApplicationStatus(this.getAttribute("data-app-id"), "rejected");
      });
    });
  }

  // Update application status (for employer)
  function updateApplicationStatus(appId, status) {
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    applications = applications.map((app) => {
      if (app.id == appId) {
        return { ...app, status: status };
      }
      return app;
    });

    localStorage.setItem("applications", JSON.stringify(applications));

    if (typeof updateEmployerApplications === "function") {
      updateEmployerApplications();
    }
    if (typeof updateApplicationsUI === "function") {
      updateApplicationsUI();
    }

    alert(`Application status updated to ${status}`);
  }

  // Update job seeker's view of their applications
  function updateApplicationsUI() {
    const container = document.querySelector(
      ".applications-section .job-listings"
    );
    if (!container) return;

    container.innerHTML = "";

    const currentUser = JSON.parse(
      localStorage.getItem("jobportal_current_user")
    );
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const userApplications = applications.filter(
      (app) => app.seekerEmail === currentUser.email
    );

    if (userApplications.length === 0) {
      container.innerHTML = "<p>You haven't applied to any jobs yet.</p>";
      return;
    }

    userApplications.forEach((app) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
              <h3>${app.title}</h3>
              <p class="company"><i class="fas fa-building"></i> ${app.company}</p>
              <div class="details">
                  <span class="detail"><i class="fas fa-map-marker-alt"></i> ${app.location}</span>
                  <span class="detail salary"><i class="fas fa-money-bill-wave"></i> ${app.salary}</span>
                  <span class="type">${app.type}</span>
                  <span class="status ${app.status}">${app.status}</span>
              </div>
              <p class="description">Applied on: ${app.appliedDate}</p>
          `;
      container.appendChild(card);
    });
  }

  // Initialize applications if on relevant page
  if (document.getElementById("applicationsList")) {
    updateEmployerApplications();
  }

  if (document.querySelector(".applications-section")) {
    updateApplicationsUI();
  }
});
