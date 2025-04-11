// Shared functionality across the application
document.addEventListener("DOMContentLoaded", function () {
  // Load current user data and update UI
  function loadUserData() {
    const currentUser =
      JSON.parse(localStorage.getItem("jobportal_current_user")) || {};

    // Update employer dashboard
    if (document.getElementById("userName")) {
      document.getElementById("userName").textContent =
        currentUser.name || "Company Name";
    }

    // Update seeker dashboard
    if (document.getElementById("fullName")) {
      document.getElementById("fullName").value = currentUser.name || "";
      document.getElementById("email").value = currentUser.email || "";
      document.getElementById("phone").value = currentUser.phone || "";
      document.getElementById("location").value = currentUser.location || "";
      document.getElementById("userName").textContent =
        currentUser.name || "Seeker name";
    }
  }

  // Navigation between sections (for seeker dashboard)
  const dashboardLink = document.querySelector(".dashboard-link");
  if (dashboardLink) {
    dashboardLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".profile-section").classList.remove("active");
      document.querySelector(".jobs-section").classList.remove("active");
      document
        .querySelector(".applications-section")
        .classList.remove("active");
      document.querySelector(".sidebar li.active").classList.remove("active");
      this.parentElement.classList.add("active");
    });
  }

  const jobsLink = document.querySelector(".jobs-link");
  if (jobsLink) {
    jobsLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".profile-section").classList.remove("active");
      document.querySelector(".jobs-section").classList.add("active");
      document
        .querySelector(".applications-section")
        .classList.remove("active");
      document.querySelector(".sidebar li.active").classList.remove("active");
      this.parentElement.classList.add("active");
      if (typeof updateJobSeekerJobListings === "function") {
        updateJobSeekerJobListings();
      }
    });
  }

  const applicationsLink = document.querySelector(".applications-link");
  if (applicationsLink) {
    applicationsLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".profile-section").classList.remove("active");
      document.querySelector(".jobs-section").classList.remove("active");
      document.querySelector(".applications-section").classList.add("active");
      document.querySelector(".sidebar li.active").classList.remove("active");
      this.parentElement.classList.add("active");
      if (typeof updateApplicationsUI === "function") {
        updateApplicationsUI();
      }
    });
  }

  const profileLink = document.querySelector(".profile-link");
  if (profileLink) {
    profileLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".profile-section").classList.add("active");
      document.querySelector(".jobs-section").classList.remove("active");
      document
        .querySelector(".applications-section")
        .classList.remove("active");
      document.querySelector(".sidebar li.active").classList.remove("active");
      this.parentElement.classList.add("active");
    });
  }

  // Profile form submission (for seeker)
  const profileForm = document.querySelector(".profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser =
        JSON.parse(localStorage.getItem("jobportal_current_user")) || {};
      currentUser.name = document.getElementById("fullName").value;
      currentUser.email = document.getElementById("email").value;
      currentUser.phone = document.getElementById("phone").value;
      currentUser.location = document.getElementById("location").value;

      // Get skills
      const skills = Array.from(document.querySelectorAll(".skill-tag"))
        .map((tag) => tag.textContent.replace("×", "").trim())
        .filter((skill) => skill.length > 0);
      currentUser.skills = skills;

      localStorage.setItem(
        "jobportal_current_user",
        JSON.stringify(currentUser)
      );
      document.getElementById("userName").textContent =
        currentUser.name || "Seeker name";

      alert("Profile saved successfully!");
    });
  }

  // Add skill functionality (for seeker profile)
  const addSkillBtn = document.querySelector(".add-skill button");
  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", function () {
      const input = document.querySelector(".add-skill input");
      if (input.value.trim() !== "") {
        const skillsContainer = document.querySelector(".skills-input");
        const newSkill = document.createElement("div");
        newSkill.className = "skill-tag";
        newSkill.innerHTML = `
                ${input.value.trim()} <button type="button"><i class="fas fa-times"></i></button>
            `;
        skillsContainer.insertBefore(
          newSkill,
          document.querySelector(".add-skill")
        );
        input.value = "";

        // Add event to remove button
        newSkill.querySelector("button").addEventListener("click", function () {
          newSkill.remove();
        });
      }
    });
  }

  // Initialize on page load
  loadUserData();
});
