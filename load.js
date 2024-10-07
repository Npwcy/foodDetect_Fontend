function goToNextPage() {
    // Redirect to the next page after 5 seconds
    setTimeout(function() {
        window.location.href = "index.html"; // Replace with the actual URL of the next page
    }, 5000); // 5000 milliseconds = 5 seconds
}

// Call the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", goToNextPage);