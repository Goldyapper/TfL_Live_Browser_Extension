document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("train-form");
    const successMessage = document.getElementById("successMessage");
    const returnButton = document.getElementById("returnButton");

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop actual form submission

        // Hide the form and show success message
        form.classList.add("hidden");
        successMessage.classList.remove("hidden");
    });

    // "Return to form" click
    returnButton.addEventListener("click", () => {
        form.reset(); // Clear all fields
        form.classList.remove("hidden");
        successMessage.classList.add("hidden");
    });
});
