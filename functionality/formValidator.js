document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !submitBtn) {
    console.error("Contact form elements not found in DOM");
    return;
  }

  const fields = {
    userName: document.getElementById("userName"),
    email: document.getElementById("emailAddress"),
    reason: document.getElementById("reason"),
    message: document.getElementById("message")
  };

  function setFieldError(el, message) {
    el.classList.add("invalid");
    const err = form.querySelector(`.error[data-for="${el.id}"]`);
    if (err) err.textContent = message || "Required.";
  }

  function clearFieldError(el) {
    el.classList.remove("invalid");
    const err = form.querySelector(`.error[data-for="${el.id}"]`);
    if (err) err.textContent = "";
  }

  function validateForUI(showErrors = false) {
    let ok = true;

    Object.values(fields).forEach(el => clearFieldError(el));

    const name = fields.userName.value.trim();
    const email = fields.email.value.trim();
    const reason = fields.reason.value;
    const message = fields.message.value.trim();

    if (!name || name.length < 2) {
      ok = false;
      if (showErrors) setFieldError(fields.userName, "Enter your name (2+ chars)");
    }

    if (!email || !fields.email.checkValidity()) {
      ok = false;
      if (showErrors) setFieldError(fields.email, "Enter a valid email");
    }

    if (!reason) {
      ok = false;
      if (showErrors) setFieldError(fields.reason, "Pick a topic");
    }

    if (!message || message.length < 10) {
      ok = false;
      if (showErrors) setFieldError(fields.message, "Message must be 10+ chars");
    }

    return ok;
  }

  function updateButtonState() {
    const valid = validateForUI(false);
    submitBtn.disabled = !valid;
    submitBtn.classList.toggle("is-ready", valid);
  }

  // Start disabled
  updateButtonState();

  // Live updates
  form.addEventListener("input", e => {
    if (e.target.matches("input, textarea")) {
      clearFieldError(e.target);
      updateButtonState();
    }
  });

  form.addEventListener("change", e => {
    if (e.target.matches("select")) {
      clearFieldError(e.target);
      updateButtonState();
    }
  });

  // Submit via AJAX (no page refresh)
  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!validateForUI(true)) {
      updateButtonState();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.remove("is-ready");
    submitBtn.textContent = "Sending...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        form.reset();
      } else {
        alert("Submission failed. Try again.");
      }

    } catch {
      alert("Network error. Try again.");
    }

    submitBtn.textContent = "Send";
    updateButtonState();
  });

});
