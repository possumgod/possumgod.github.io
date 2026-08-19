document.writeln(' \
    <head> \
        <meta charset="utf-8"> \
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
        <title>Devlin Gallagher | Data Analyst & Programmer</title> \
        <link rel="icon" type="image/x-icon" href="/images/favicon.png"> \
        <meta name="description" content=""> \
        <meta name="viewport" content="width=device-width, initial-scale=1"> \
        <link rel="stylesheet" href="style/overall_style.css"> \
        <script src="scripts/script.js" async defer></script> \
    </head> \
\
        <header> \
            <div style="width: 100%;" id="header_nav"> \
                <div style="width: 5.5em;"> \
                    <img id="icon" src="images/logo.png" alt="possum icon drawn by Bea Amurao" style="height: 5em;"> \
                </div> \
                <div> \
                    <h1 id="title" style="text-align: left; margin-bottom: -5px; margin-top: 15px">POSSUMGOD</h1> \
                    <figcaption style="text-align: left; color: rgb(244, 237, 237); margin-bottom: 5px;">icon drawn by <a href="https://beaamurao-designer.framer.website" target="_blank" style="font-size: 16px; color: rgb(244, 237, 237); text-decoration: underline;">Bea Amurao </a></figcaption> \
                </div> \
                <nav id="main_nav"> \
                    <div> \
                        <a href="index.html">Portfolio</a> \
                    </div> \
                    <div> \
                        <a href="personal.html">Personal</a> \
                    </div> \
')


document.writeln((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? 
    ' \
        <div> \
            <a href="linkedin://in/devlin-gallagher/" target="_blank">LinkedIn</a> \
        </div> \
        ':
    ' \
        <div> \
            <a href="mylinkedin.html">LinkedIn</a> \
        </div> \
    ')

document.writeln(' \
                <div> \
                    <a href="/files/DevlinGallagher_Resume.pdf" download>Resume</a> \
                </div> \
                <div> \
                    <a href="mailto:devlin@rgallagher.com" target="_blank">Email</a> \
                </div> \
                </nav> \
            </div> \
        </header> \
')

// Find all h3 and h3 on the page, in doc order
document.addEventListener("DOMContentLoaded", function() {
    // Get all H2 (main) and H3 (sub)
    const headings = document.querySelectorAll("h2, h3");
    const navData = [];
    let currentSection = null;

    headings.forEach(heading => {
        const title = heading.textContent.split("|")[0].trim();
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