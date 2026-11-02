const STORAGE_KEY = "tickReports";
const reportForm = document.getElementById("report-form");
const dateInput = document.getElementById("sighting-date");
const timeInput = document.getElementById("sighting-time");
const locationInput = document.getElementById("location");
const speciesInput = document.getElementById("species");
const imageInput = document.getElementById("sighting-image");
const descriptionInput = document.getElementById("description");
const formMessage = document.getElementById("form-message");
const imagePreview = document.getElementById("image-preview");
const clearImageButton = document.getElementById("clear-image");

// Display error, warning or success messages
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = type;
}
function getSavedReports() {
    const savedReports = localStorage.getItem(STORAGE_KEY);

    if (!savedReports) {
        return [];
    }

    return JSON.parse(savedReports);
}
function saveReport(report) {
    const reports = getSavedReports();

    reports.push(report);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
    );
}

// Check an image when the user selects it

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (!file) {
        imagePreview.hidden = true;
        imagePreview.removeAttribute("src");
        clearImageButton.hidden = true;
        return;
    }

    if (!file.type.startsWith("image/")) {
        showMessage("Please select an image file.", "error");
        imageInput.value = "";
        imagePreview.hidden = true;
        imagePreview.removeAttribute("src");
        clearImageButton.hidden = true;
        return;
    }

    const maxImageSize = 5 * 1024 * 1024;

    if (file.size > maxImageSize) {
        showMessage("The image must be 5 MB or smaller.", "warning");
        imageInput.value = "";
        imagePreview.hidden = true;
        imagePreview.removeAttribute("src");
        clearImageButton.hidden = true;
        return;
    }

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.hidden = false;
    clearImageButton.hidden = false;
});

// Remove the selected image
clearImageButton.addEventListener("click", function () {
    imageInput.value = "";
    imagePreview.removeAttribute("src");
    imagePreview.hidden = true;
    clearImageButton.hidden = true;
});


// Handle form submission
reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const date = dateInput.value;
    const time = timeInput.value;
    const location = locationInput.value.trim();
    const species = speciesInput.value;
    const description = descriptionInput.value.trim();
    const image = imageInput.files[0];
    


    // Check required fields
    if (!date || !time || !location || !species) {
        showMessage("Please complete all required fields.", "error");
        return;
    }
    const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

if (date > todayString) {
    showMessage("The sighting date cannot be in the future.", "error");
    return;
}


    // Check the selected image again during submission
    if (image) {
        if (!image.type.startsWith("image/")) {
            showMessage("Please select an image file.", "error");
            return;
        }

        const maxImageSize = 5 * 1024 * 1024;

        if (image.size > maxImageSize) {
            showMessage("The image must be 5 MB or smaller.", "warning");
            return;
        }
    }

    // Group the report information into one object
    const report = {
        date: date,
        time: time,
        location: location,
        species: species,
        description: description
    };

    
    try {
    saveReport(report);

    console.log("Report saved:", report);

    showMessage(
        "Report saved successfully!",
        "success"
    );

    reportForm.reset();

    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
    clearImageButton.hidden = true;

} catch (error) {
    console.error("Error saving report:", error);

    showMessage(
        "Could not save the report. Please try again.",
        "error"
    );
}
    

    
});
