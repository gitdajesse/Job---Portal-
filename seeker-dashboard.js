// Seeker-specific functionality
document.addEventListener("DOMContentLoaded", function () {
  // Update job seeker's view of available jobs
  function updateJobSeekerJobListings() {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const container = document.querySelector(".jobs-section .job-listings");
    if (!container) return;

    container.innerHTML = "";

    // Filter only open jobs
    const openJobs = jobs.filter((job) => job.status === "open");

    openJobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
      jobCard.innerHTML = `
              <h3>${job.title}</h3>
              <p class="company"><i class="fas fa-building"></i> ${
                job.company
              }</p>
              <div class="details">
                  <span class="detail"><i class="fas fa-map-marker-alt"></i> ${
                    job.location
                  }</span>
                  <span class="detail salary"><i class="fas fa-money-bill-wave"></i> ${
                    job.salary
                  }</span>
                  <span class="type">${job.type}</span>
                  <span class="status">Open</span>
              </div>
              <p class="description">${job.description.substring(0, 100)}...</p>
              <div class="actions">
                  <button class="btn btn-outline view-details-btn" data-job-id="${
                    job.id
                  }">View Details</button>
                  <button class="btn btn-primary apply-btn" data-job-id="${
                    job.id
                  }">
                      Apply Now
                  </button>
              </div>
          `;
      container.appendChild(jobCard);
    });
  }

  // Initialize seeker dashboard
  updateJobSeekerJobListings();
  if (typeof updateApplicationsUI === "function") {
    updateApplicationsUI();
  }
});
