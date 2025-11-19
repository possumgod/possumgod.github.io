
document.writeln(' \
    <head> \
        <meta charset="utf-8"> \
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
        <title>Devlin Gallagher | Data Analyst & Programmer</title> \
        <link rel="icon" type="image/x-icon" href="/images/favicon.png"> \
        <meta name="description" content=""> \
        <meta name="viewport" content="width=device-width, initial-scale=1"> \
        <link rel="stylesheet" href="style.css"> \
        <script src="script.js" async defer></script> \
    </head> \
\
        <header> \
            <table style="width: 100%;"> \
                <tr> \
                    <td style="width: 5.5em;"> \
                        <img src="images/logo.png" alt="possum icon drawn by me" style="height: 5em;"> \
                    </td> \
                    <td> \
                        <h1 style="text-align: left;">POSSUMGOD</h1> \
                    </td> \
                    <nav id="main_nav"> \
                    <td> \
                        <a href="/index.html" class="active-link">Home</a> \
                    </td> \
                    <td> \
                        <a href="/personal.html">Personal</a> \
                    </td> \
                    <td> \
                        <a href="https://www.linkedin.com/in/devlin-gallagher" target="_blank">LinkedIn</a> \
                    </td> \
                    <td> \
                        <a href="/Files/DG_Resume.pdf" download>Resume</a> \
                    </td> \
                    <td> \
                        <a href="mailto:eli@rgallagher.com" target="_blank">Email</a> \
                    </td> \
                    </nav> \
                </tr> \
            </table> \
        </header> \
')


// stack overflow for general content

// Find all h3 and h3 on the page, in doc order
document.addEventListener("DOMContentLoaded", function() {
    // Get all H2 (main) and H3 (sub)
    const headings = document.querySelectorAll("h2, h3");
    const navData = [];
    let currentSection = null;

    headings.forEach(heading => {
        const title = heading.textContent.trim().split("|")[0];
        const id = heading.id || title.replace(/\s+/g, "-").toLowerCase();
        heading.id = id;

        if (heading.tagName === "H2") { //main
            currentSection = { title: title, id: id, subs: [] };
            navData.push(currentSection);
        } else if (heading.tagName === "H3" && currentSection) { //sub
            currentSection.subs.push({ title: title, id: id });
        }
    });

    // HTML string
    let html = '<nav class="prof_nav" style="z-index:0"><ul>';

    navData.forEach(section => {
        html += `<li class="main_info"><a href="#${section.id}">${section.title}</a></li>`;
        if (section.subs.length > 0) {
            html += '<ul>';
            section.subs.forEach(sub => {
                html += `<li><a href="#${sub.id}">${sub.title}</a></li>`;
            });
            html += '</ul>';
        }
    });

    html += '</ul></nav>';

    // insert before body elt
    const navContainer = document.createElement("div");
    navContainer.innerHTML = html;
    document.body.insertBefore(navContainer, document.body.firstChild);
});