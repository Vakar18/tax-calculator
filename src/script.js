document.addEventListener("DOMContentLoaded", function() {
  // Initialize tooltips for "?" icons
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('.tooltip-icon'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize tooltips for error icons
  var errorIconList = [].slice.call(document.querySelectorAll('.error-icon'));
  var errorIconTooltips = errorIconList.map(function (errorIcon) {
    return new bootstrap.Tooltip(errorIcon);
  });

  const form = document.getElementById("taxForm");
  const modal = document.getElementById("taxDetails");
  const submitBtn = document.getElementById("submitBtn");
  const closeModalBtns = modal.querySelectorAll("[data-bs-dismiss='modal']");

  submitBtn.addEventListener("click", function(event) {
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");

    // Check for valid numbers in input fields
    const inputs = form.querySelectorAll("input[type=text]");
    inputs.forEach(input => {
      const errorMessage = input.nextElementSibling;
      const errorIcon = input.parentElement.querySelector(".error-icon");

      if (!input.validity.valid) {
        input.classList.add("is-invalid");
        errorIcon.style.display = "block";
      } else {
        input.classList.remove("is-invalid");
        errorMessage.style.display = "none";
        errorIcon.style.display = "none";
      }
    });

    // Validate age dropdown
    const ageSelect = form.querySelector("#age");
    const ageErrorIcon = ageSelect.parentElement.querySelector(".error-icon");
    if (ageSelect.value === "") {
      ageSelect.classList.add("is-invalid");
      ageErrorIcon.style.display = "block";
    } else {
      ageSelect.classList.remove("is-invalid");
      ageErrorIcon.style.display = "none";
    }

    // Perform tax calculation only if form is valid
    if (form.checkValidity() === true) {
      calculateTax();
      showModal();
    }
  });

  function calculateTax() {
    const grossIncome = parseFloat(document.getElementById("grossIncome").value);
    const extraIncome = parseFloat(document.getElementById("extraIncome").value);
    const deductions = parseFloat(document.getElementById("deductions").value);
    const age = document.getElementById("age").value;

    let totalIncome = grossIncome + extraIncome - deductions;
    let tax = 0;

    if (totalIncome > 800000) {
      if (age === "<40") {
        tax = 0.3 * (totalIncome - 800000);
      } else if (age === "≥40 & <60") {
        tax = 0.4 * (totalIncome - 800000);
      } else if (age === "≥60") {
        tax = 0.1 * (totalIncome - 800000);
      }
    }

    // Display tax details in modal
    const modalBody = modal.querySelector(".modal-body");
    modalBody.innerHTML = `
      Gross Income: ₹${grossIncome}<br>
      Extra Income: ₹${extraIncome}<br>
      Deductions: ₹${deductions}<br>
      Age Group: ${age}<br>
      Total Tax: ₹${tax}`;
  }

  function showModal() {
    modal.classList.add("show");
    modal.style.display = "block";
    modal.removeAttribute("aria-hidden");
  }

  // Close the modal when the user clicks on the close button inside the modal
  closeModalBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      closeModal();
    });
  });

  // Function to close the modal
  function closeModal() {
    modal.style.display = "none";
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  // Close the modal when the user clicks outside of it
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Remove the error message when the user inputs a valid number
  form.querySelectorAll("input[type=text]").forEach(input => {
    input.addEventListener("input", function() {
      const errorMessage = input.nextElementSibling;
      const errorIcon = input.parentElement.querySelector(".error-icon");

      if (input.validity.valid) {
        input.classList.remove("is-invalid");
        errorMessage.style.display = "none"; // Hide the error message
        errorIcon.style.display = "none"; // Hide the error icon
      }
    });
  });
});
