// Employer-specific functionality
document.addEventListener("DOMContentLoaded", function () {
  // Load saved profile data when page loads
  function loadEmployerProfile() {
    const currentUser =
      JSON.parse(localStorage.getItem("jobportal_current_user")) || {};

    if (currentUser.companyName) {
      document.getElementById("companyName").value = currentUser.companyName;
      document.getElementById("companyDescription").value =
        currentUser.companyDescription || "";
      document.getElementById("companyPhone").value =
        currentUser.companyPhone || "";
      document.getElementById("companyLocation").value =
        currentUser.companyLocation || "";
      document.getElementById("companyWebsite").value =
        currentUser.companyWebsite || "";
      document.getElementById("userName").textContent = currentUser.companyName;
    }
  }

  // Update employer's view of their job listings
  function updateEmployerJobListings() {
    const currentUser = JSON.parse(
      localStorage.getItem("jobportal_current_user")
    );
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const container = document.querySelector("#manage-jobs .job-listings");
    if (!container) return;

    container.innerHTML = "";

    // Filter jobs for this employer
    const employerJobs = jobs.filter(
      (job) => job.employerId === currentUser.email
    );

    employerJobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
      jobCard.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.description.substring(0, 100)}...</p>
          <div class="form-row">
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
          </div>
          <div class="form-row">
            <p><strong>Type:</strong> ${job.type}</p>
            <p><strong>Status:</strong> <span class="status-${job.status.replace(
              " ",
              "-"
            )}">${job.status}</span></p>
          </div>
          <div class="job-actions">
            <button class="btn btn-primary edit-btn" data-job-id="${
              job.id
            }">Edit</button>
            <button class="btn btn-danger delete-btn" data-job-id="${
              job.id
            }">Delete</button>
          </div>
        `;
      container.appendChild(jobCard);
    });
  }

  // Company profile form submission (Updated)
  const companyProfileForm = document.getElementById("companyProfileForm");
  if (companyProfileForm) {
    companyProfileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser =
        JSON.parse(localStorage.getItem("jobportal_current_user")) || {};

      // Update employer profile data
      currentUser.companyName = document.getElementById("companyName").value;
      currentUser.companyDescription =
        document.getElementById("companyDescription").value;
      currentUser.companyPhone = document.getElementById("companyPhone").value;
      currentUser.companyLocation =
        document.getElementById("companyLocation").value;
      currentUser.companyWebsite =
        document.getElementById("companyWebsite").value;

      // Save to localStorage
      localStorage.setItem(
        "jobportal_current_user",
        JSON.stringify(currentUser)
      );
      document.getElementById("userName").textContent = currentUser.companyName;

      alert("Profile saved successfully!");
    });
  }

  // Navigation highlighting for employer dashboard
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll("nav li")
        .forEach((li) => li.classList.remove("active"));
      this.parentElement.classList.add("active");

      // Hide all sections
      document.querySelectorAll(".dashboard-section").forEach((section) => {
        section.style.display = "none";
      });
      document.querySelector(".dashboard-header").style.display = "block";

      // Show the selected section
      const target = this.getAttribute("href");
      if (target && target.startsWith("#")) {
        document.querySelector(target).style.display = "block";
      }
    });
  });

  // Initialize employer dashboard
  loadEmployerProfile(); // <--- Added this line
  updateEmployerJobListings();
  if (typeof updateEmployerApplications === "function") {
    updateEmployerApplications();
  }

  // Show dashboard by default
  const defaultNavLink = document.querySelector("nav li.active a");
  if (defaultNavLink) {
    defaultNavLink.click();
  }
});
