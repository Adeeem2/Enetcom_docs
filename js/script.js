// Mobile and Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    // Theme toggle functionality
    if (themeToggleBtn) {
        // Check for saved theme preference or use default light theme
        const currentTheme = localStorage.getItem('theme') || 'light';

        // Apply the saved theme on page load
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = sunIcon;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = moonIcon;
        }

        // Toggle theme when button is clicked
        themeToggleBtn.addEventListener('click', function() {
            let theme = 'light';

            // If current theme is light, switch to dark
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggleBtn.innerHTML = sunIcon;
                theme = 'dark';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeToggleBtn.innerHTML = moonIcon;
                theme = 'light';
            }

            // Save theme preference to localStorage
            localStorage.setItem('theme', theme);
        });
    }

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.menu-toggle') && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });

    loadDriveFiles();
    document.querySelectorAll('.course-card h4').forEach(title => {
        title.addEventListener('click', () => {
            title.parentElement.classList.toggle('open');
        });
    });
    document.querySelectorAll('details').forEach(details => {
        details.addEventListener('toggle', () => {
            if(!details.open){
                details.querySelectorAll('.course-card').forEach(card => {
                    card.classList.remove('open');
                });
            }
        });
    });
    // Ajouter après le code de toggle du thème

});



function getJsonFileForPage(pageName) {
    const pageToJsonMap = {
        'idsd-year1.html': 'js/IDSD_1st_Year.json',
        'idsd-year2.html': 'js/IDSD_2nd_Year.json',
        'idsd-year3.html': 'js/IDSD_3rd_Year.json',
        'gt-year1.html': 'js/GT_1st_Year.json',
        'gt-year2.html': 'js/GT_2nd_Year.json',
        'gt-year3.html': 'js/GT_3rd_Year.json',
        'gii-year1.html': 'js/GII_1st_Year.json',
        'gii-year2.html': 'js/GII_2nd_Year.json',
        'gii-year3.html': 'js/GII_3rd_Year.json',
        'gec-year1.html': 'js/GEC_1st_Year.json',
        'gec-year2.html': 'js/GEC_2nd_Year.json',
        'gec-year3.html': 'js/GEC_3rd_Year.json'
    };

    return pageToJsonMap[pageName] || null;
}

function loadDriveFiles() {

    const currentPage = window.location.pathname.split('/').pop();
    const jsonFile = getJsonFileForPage(currentPage);

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        })
        .then(data => {

            data.forEach(semester => {
                if (!semester || typeof semester !== 'object' || !semester.subject) {
                    console.error('Invalid semester object:', semester);
                    return;
                }

                let semesterElement;

                if (semester.subject.toLowerCase().includes('semester 1')) {
                    semesterElement = customQuerySelector('.semester-title:contains("Semester 1") + .course-list');
                } else if (semester.subject.toLowerCase().includes('semester 2')) {
                    semesterElement = customQuerySelector('.semester-title:contains("Semester 2") + .course-list');
                }
                if (semesterElement) {
                    semesterElement.innerHTML = '';
                    const filesBySubject = {};

                    if (semester.files && semester.files.length > 0) {
                        if (!filesBySubject['General']) {
                            filesBySubject['General'] = [];
                        }

                        semester.files.forEach(file => {
                            if (file && typeof file === 'object') {
                                filesBySubject['General'].push(file);
                            }
                        });
                    }

                    if (semester.subfolders && semester.subfolders.length > 0) {
                        semester.subfolders.forEach(subfolder => {

                            if (!subfolder || typeof subfolder !== 'object' || !subfolder.name) {
                                return;
                            }
                            const subjectName = subfolder.name;
                            if (!filesBySubject[subjectName]) {
                                filesBySubject[subjectName] = [];
                            }
                            if (subfolder.files && subfolder.files.length > 0) {
                                subfolder.files.forEach(file => {
                                    if (file && typeof file === 'object') {
                                        filesBySubject[subjectName].push(file);
                                    }
                                });
                            }
                        });
                    }
                    const sortedSubjects = Object.keys(filesBySubject).sort((a, b) => {
                        if (a.toLowerCase().includes('examen & ds')) return -1;
                        if (b.toLowerCase().includes('examen & ds')) return 1;
                        return 0;
                    });

                    for (const subject of sortedSubjects) {
                        const courseCard = document.createElement('div');
                        courseCard.className = 'course-card';

                        const courseTitle = document.createElement('h4');
                        if(subject.toLowerCase().includes('examen & ds')){
                            courseCard.style.borderColor = 'var(--borderleft)';
                        }
                        courseTitle.textContent = subject;
                        courseTitle.addEventListener('click', () => {
                          courseCard.classList.toggle('open');

                        });
                        courseCard.appendChild(courseTitle);

                        const documentList = document.createElement('div');
                        documentList.className = 'document-list';

                        if (filesBySubject[subject] && filesBySubject[subject].length > 0) {
                            filesBySubject[subject].forEach(file => {
                                const documentItem = document.createElement('div');
                                documentItem.className = 'document-item';

                                const icon = document.createElement('i');
                                icon.className = file.icon || 'fas fa-file';
                                documentItem.appendChild(icon);

                                const link = document.createElement('a');
                                link.href = file.link || '#';
                                link.target = '_blank';
                                link.textContent = file.name || 'fichier sans nom';
                                documentItem.appendChild(link);

                                documentList.appendChild(documentItem);
                            });
                        } else {
                            const noFiles = document.createElement('p');
                            noFiles.textContent = 'No files available';
                            documentList.appendChild(noFiles);
                        }

                        courseCard.appendChild(documentList);
                        semesterElement.appendChild(courseCard);
                    }
                } else {
                    console.log(`Error`);
                }
            });
        })
        .catch(error => {
            console.error('Error loading drive files:', error);
        });
}

function parseContainsSelector(selector) {
    if (selector.includes(':contains(')) {
        const baseSelector = selector.substring(0, selector.indexOf(':contains('));

        const startPos = selector.indexOf(':contains(') + 10; // 10 is the length of ':contains('
        let endPos = selector.lastIndexOf(')');

        if (endPos === -1 || endPos < startPos) {
            endPos = selector.length;
        }

        const searchText = selector.substring(startPos, endPos);
        const cleanedText = searchText.replace(/^["'](.*)["']$/, '$1'); // remove quotes

        return { baseSelector, searchText: cleanedText };
    }
    return { baseSelector: selector, searchText: null };
}

function customQuerySelector(selector) {
    if (selector.includes(':contains(') && selector.includes('+')) {
        // Handle case like '.semester-title:contains("Semester 1") + .course-list'
            const [firstPart, secondPart] = selector.split('+').map(s => s.trim());
            const { baseSelector, searchText } = parseContainsSelector(firstPart);

            const elements = document.querySelectorAll(baseSelector);
            for(const element of elements){
                const elementText = element.textContent.trim();
                if (searchText && elementText.toLowerCase().includes(searchText.toLowerCase())) {
                    let nextSibling = element.nextElementSibling;
                    if(nextSibling && nextSibling.matches(secondPart)) {
                        return nextSibling;
                    }
                }
            }
            return null;
        }
        return document.querySelector(selector);
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.course-card h4').forEach(title => {
        console.log(title);
        title.addEventListener('click', () => {
          title.parentElement.classList.toggle('open');

        });
    });
})
document.querySelectorAll('h4.semester-title').forEach(h4 => {

    const summary = document.createElement('summary');
    summary.className = h4.className;
    summary.innerHTML = h4.innerHTML;

    const details = document.createElement('details');
    details.appendChild(summary);

    let next = h4.nextElementSibling;
    while (next && !(next.tagName === 'H4' && next.classList.contains('semester-title'))) {
      const temp = next.nextElementSibling;
      details.appendChild(next);
      next = temp;
    }

    h4.parentNode.replaceChild(details, h4);
  });

const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const PARTICLE_COUNT = 150;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(0, canvas.width);
    this.y = random(0, canvas.height);
    this.size = random(0.3, 1);
    this.speedX = random(-0.1, 0.1);
    this.speedY = random(-0.4, -0.1); // upward drift
    this.opacity = random(0.3, 1);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
      this.reset();
      this.y = canvas.height;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
window.addEventListener('scroll', function() {
    const blur1 = document.querySelector('.blur-square1');
    const blur2 = document.querySelector('.blur-square2');
    if (window.scrollY > 120) {
        blur1?.classList.remove('fadein');
        blur1?.classList.add('fadeout');

        blur2?.classList.remove('fadein');
        blur2?.classList.add('fadeout');
    } if( window.scrollY <= 120) {
        blur1?.classList.remove('fadeout');
        blur1?.classList.add('fadein');

        blur2?.classList.remove('fadeout');
        blur2?.classList.add('fadein');
    }
});