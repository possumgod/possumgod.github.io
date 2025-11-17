document.writeln('\
    <h1>PLEASE WORK!!!</h1>')


// Highlight current page as 'active-link' for formatting
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll("a");

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active-link");
        }
    });
});