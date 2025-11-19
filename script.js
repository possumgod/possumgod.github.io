// Highlight current page as 'active-link' for formatting
const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });


// Highlight active sidebar item based on the current hash (#section)
document.addEventListener("DOMContentLoaded", function() {

    const currentHash = window.location.hash;
    const links = document.querySelectorAll(".prof_nav a");

    links.forEach(link => {
        if (link.hash === currentHash) {
            // Highlight the clicked or active link
            link.classList.add("active");

            // Highlight the <li> surrounding the link
            const li = link.closest("li");
            if (li) li.classList.add("active");

            // If it's a submenu link, highlight its .main_info parent
            const mainInfoParent = link.closest("ul")?.closest("li.main_info");
            if (mainInfoParent) mainInfoParent.classList.add("active");
        }
    });
});
