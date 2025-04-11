// Job-related functionality for both employer and seeker dashboards
document.addEventListener("DOMContentLoaded", function () {
  // Simplified employer job posting functionality
  const postJobForm = document.getElementById("postJobForm");
  if (postJobForm) {
    postJobForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser = JSON.parse(
        localStorage.getItem("jobportal_current_user")
      );

      const jobData = {
        id: Date.now(),
        title: document.getElementById("jobTitle").value,
        description: document.getElementById("jobDescription").value,
        location: document.getElementById("jobLocation").value,
        salary: document.getElementById("jobSalary").value,
        type: document.getElementById("jobType").value,
        status: document.getElementById("jobStatus").value,
        company: currentUser.companyName || "My Company",
        postedDate: new Date().toLocaleDateString(),
        employerId: currentUser.email,
      };

      let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
      jobs.push(jobData);
      localStorage.setItem("jobs", JSON.stringify(jobs));

      alert("Job posted successfully!");
      postJobForm.reset();

      if (typeof updateEmployerJobListings === "function") {
        updateEmployerJobListings();
      }
      if (typeof updateJobSeekerJobListings === "function") {
        updateJobSeekerJobListings();
      }
      filterJobs(); // Refresh filters
    });
  }

  function editJob(jobId) {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const job = jobs.find((j) => j.id == jobId);
    if (!job) return;

    document.getElementById("jobTitle").value = job.title;
    document.getElementById("jobDescription").value = job.description;
    document.getElementById("jobLocation").value = job.location;
    document.getElementById("jobSalary").value = job.salary;
    document.getElementById("jobType").value = job.type;
    document.getElementById("jobStatus").value = job.status;

    document.getElementById("post-job").scrollIntoView();
    const form = document.getElementById("postJobForm");
    form.dataset.editMode = "true";
    form.dataset.jobId = jobId;
    form.querySelector("button").textContent = "Update Job";
  }

  function deleteJob(jobId) {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs = jobs.filter((job) => job.id != jobId);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    if (typeof updateEmployerJobListings === "function") {
      updateEmployerJobListings();
    }
    if (typeof updateJobSeekerJobListings === "function") {
      updateJobSeekerJobListings();
    }

    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    applications = applications.filter((app) => app.jobId != jobId);
    localStorage.setItem("applications", JSON.stringify(applications));

    filterJobs(); // Refresh filters
  }

  function applyForJob(jobId) {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const job = jobs.find((j) => j.id == jobId);
    if (!job) {
      alert("Job not found!");
      return;
    }

    const currentUser = JSON.parse(
      localStorage.getItem("jobportal_current_user")
    );
    const application = {
      id: Date.now(),
      jobId: jobId,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      status: "pending",
      appliedDate: new Date().toLocaleDateString(),
      seekerName: currentUser.name || "Anonymous",
      seekerEmail: currentUser.email,
      seekerPhone: currentUser.phone || "",
      seekerSkills: currentUser.skills || [],
      employerId: job.employerId,
    };

    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));

    const applyBtn = document.querySelector(
      `.apply-btn[data-job-id="${jobId}"]`
    );
    if (applyBtn) {
      applyBtn.textContent = "Applied!";
      applyBtn.disabled = true;
    }

    const applicationModal = document.getElementById("applicationModal");
    if (applicationModal) {
      applicationModal.classList.add("active");
    }

    if (typeof updateApplicationsUI === "function") {
      updateApplicationsUI();
    }
    if (typeof updateEmployerApplications === "function") {
      updateEmployerApplications();
    }
  }

  function showJobDetails(jobId) {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const job = jobs.find((j) => j.id == jobId);
    if (!job) {
      alert("Job details not found!");
      return;
    }

    document.getElementById("modalJobTitle").textContent = job.title;
    document.getElementById("modalJobCompany").textContent = job.company;
    document.getElementById("modalJobLocation").textContent = job.location;
    document.getElementById("modalJobSalary").textContent = job.salary;
    document.getElementById("modalJobType").textContent = job.type;
    document.getElementById("modalJobPosted").textContent =
      job.postedDate || "Recently";
    document.getElementById("modalJobDescription").innerHTML = job.description;

    const applyBtn = document.getElementById("applyJobBtn");
    if (applyBtn) {
      applyBtn.setAttribute("data-job-id", jobId);
      applyBtn.textContent = "Apply Now";
      applyBtn.disabled = false;

      const applications =
        JSON.parse(localStorage.getItem("applications")) || [];
      const currentUser = JSON.parse(
        localStorage.getItem("jobportal_current_user")
      );
      const hasApplied = applications.some(
        (app) => app.jobId == jobId && app.seekerEmail === currentUser.email
      );

      if (hasApplied) {
        applyBtn.textContent = "Already Applied";
        applyBtn.disabled = true;
      }
    }

    document.getElementById("jobModal").classList.add("active");
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
      editJob(e.target.getAttribute("data-job-id"));
    }

    if (e.target.classList.contains("delete-btn")) {
      deleteJob(e.target.getAttribute("data-job-id"));
    }

    if (e.target.classList.contains("apply-btn")) {
      applyForJob(e.target.getAttribute("data-job-id"));
    }

    if (e.target.classList.contains("view-details-btn")) {
      showJobDetails(e.target.getAttribute("data-job-id"));
    }
  });

  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      document.getElementById("jobModal").classList.remove("active");
      document.getElementById("applicationModal").classList.remove("active");
    });
  });

  window.addEventListener("click", function (e) {
    if (
      e.target === document.getElementById("jobModal") ||
      e.target === document.getElementById("applicationModal")
    ) {
      document.getElementById("jobModal").classList.remove("active");
      document.getElementById("applicationModal").classList.remove("active");
    }
  });

  const modalApplyBtn = document.getElementById("applyJobBtn");
  if (modalApplyBtn) {
    modalApplyBtn.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id");
      applyForJob(jobId);
      document.getElementById("jobModal").classList.remove("active");
    });
  }

  const closeApplicationModal = document.getElementById(
    "closeApplicationModal"
  );
  if (closeApplicationModal) {
    closeApplicationModal.addEventListener("click", function () {
      document.getElementById("applicationModal").classList.remove("active");
    });
  }

  // Initialize filter on load
  filterJobs();
});

// Filter Jobs Function
function filterJobs() {
  const searchTerm = document.getElementById("jobSearch").value.toLowerCase();
  const jobType = document.getElementById("filterJobType").value;
  const location = document.getElementById("filterLocation").value;
  const minSalary = document.getElementById("filterSalary").value;

  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm);

    const matchesJobType = jobType ? job.type === jobType : true;
    const matchesLocation = location ? job.location.includes(location) : true;

    const salary = parseInt(job.salary.replace(/[^0-9]/g, "")) || 0;
    const matchesSalary = minSalary ? salary >= parseInt(minSalary) : true;

    return matchesSearch && matchesJobType && matchesLocation && matchesSalary;
  });

  displayFilteredJobs(filteredJobs);
}

// Display Filtered Jobs
function displayFilteredJobs(jobs) {
  const container = document.getElementById("jobListingsContainer");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = "<p>No jobs match your filters.</p>";
    return;
  }

  jobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.className = "job-card";
    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <p class="company"><i class="fas fa-building"></i> ${job.company}</p>
      <div class="details">
        <span class="detail"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
        <span class="detail salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
        <span class="type">${job.type}</span>
      </div>
      <button class="btn btn-primary apply-btn" data-job-id="${job.id}">
        Apply Now
      </button>
    `;
    container.appendChild(jobCard);
  });
}

// Event Listeners for Filter Inputs
document.getElementById("jobSearch").addEventListener("input", filterJobs);
document.getElementById("filterJobType").addEventListener("change", filterJobs);
document
  .getElementById("filterLocation")
  .addEventListener("change", filterJobs);
document.getElementById("filterSalary").addEventListener("change", filterJobs);
