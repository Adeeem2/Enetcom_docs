// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.menu-toggle') && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });


    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Load Google Drive files from JSON
    loadDriveFiles();
        document.querySelectorAll('.course-card h4').forEach(title => {
        console.log(title);
        title.addEventListener('click', () => {
          title.parentElement.classList.toggle('open');

        });
    });
});



// Helper function to determine which JSON file to load based on the current page
function getJsonFileForPage(pageName) {
    // Map page names to their corresponding JSON files
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

// Function to load Google Drive files from JSON
function loadDriveFiles() {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop();

    // Determine which JSON file to load based on the current page
    const jsonFile = getJsonFileForPage(currentPage);
    console.log(`Loading drive files from ${jsonFile}...`);

    // If no JSON file is mapped for this page, exit
    if (!jsonFile) {
        console.log(`No JSON file mapped for page: ${currentPage}`);
        return;
    }

    // Check if we have course lists on the page
    const semester1List = customQuerySelector('.semester-title:contains("Semester 1") + .course-list');
    const semester2List = customQuerySelector('.semester-title:contains("Semester 2") + .course-list');

    if (!semester1List && !semester2List) {
        console.log('No course lists found on the page');
        return; // No course lists found, exit
    }

    // Fetch the JSON file
    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Loaded JSON data:', data);

            // Check if data is an array
            if (!Array.isArray(data)) {
                console.error('JSON data is not an array');
                return;
            }

            // Process the data
            data.forEach(semester => {
                // Check if semester has required properties
                if (!semester || typeof semester !== 'object' || !semester.subject) {
                    console.error('Invalid semester object:', semester);
                    return;
                }

                let semesterElement;

                // Determine which semester we're dealing with
                if (semester.subject.toLowerCase().includes('semestre 1') || 
                    semester.subject.toLowerCase().includes('semester 1')) {
                    semesterElement = customQuerySelector('.semester-title:contains("Semester 1") + .course-list');
                } else if (semester.subject.toLowerCase().includes('semestre 2') || 
                           semester.subject.toLowerCase().includes('semester 2')) {
                    semesterElement = customQuerySelector('.semester-title:contains("Semester 2") + .course-list');
                }
                console.log(`Semester element: ${semesterElement}`);
                if (semesterElement) {
                    console.log(`Processing ${semester.subject} with ${semester.files ? semester.files.length : 0} files`);

                    // Clear existing content
                    semesterElement.innerHTML = '';

                    // Process the semester's files and subfolders
                    const filesBySubject = {};

                    // Process direct files in the semester folder
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

                    // Process subfolders
                    if (semester.subfolders && semester.subfolders.length > 0) {
                        semester.subfolders.forEach(subfolder => {
                            // Skip invalid subfolders
                            if (!subfolder || typeof subfolder !== 'object' || !subfolder.name) {
                                return;
                            }

                            // Create a category for this subfolder
                            const subjectName = subfolder.name;
                            if (!filesBySubject[subjectName]) {
                                filesBySubject[subjectName] = [];
                            }

                            // Add files from this subfolder
                            if (subfolder.files && subfolder.files.length > 0) {
                                subfolder.files.forEach(file => {
                                    if (file && typeof file === 'object') {
                                        filesBySubject[subjectName].push(file);
                                    }
                                });
                            }

                            // Process nested subfolders recursively
                            processNestedFolders(subfolder, subjectName, filesBySubject);
                        });
                    }

                    // Create course cards for each subject
                    for (const subject in filesBySubject) {
                        const courseCard = document.createElement('div');
                        courseCard.className = 'course-card';

                        const courseTitle = document.createElement('h4');
                        courseTitle.textContent = subject;
                        courseTitle.addEventListener('click', () => {
                          courseCard.classList.toggle('open');

        });
                        courseCard.appendChild(courseTitle);

                        const documentList = document.createElement('div');
                        documentList.className = 'document-list';

                        // Add files to the document list
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
                                link.textContent = file.name || 'Unnamed file';
                                documentItem.appendChild(link);

                                documentList.appendChild(documentItem);
                            });
                        } else {
                            // If no files, show a message
                            const noFiles = document.createElement('p');
                            noFiles.textContent = 'No files available';
                            documentList.appendChild(noFiles);
                        }

                        courseCard.appendChild(documentList);
                        semesterElement.appendChild(courseCard);
                    }
                } else {
                    console.log(`Could not find element for ${semester.subject}`);
                }
            });
        })
        .catch(error => {
            console.error('Error loading drive files:', error);
        });
}

// Helper function to recursively process nested folders
function processNestedFolders(folder, parentSubject, filesBySubject) {
    // Validate folder object
    if (!folder || typeof folder !== 'object') {
        console.error('Invalid folder object in processNestedFolders:', folder);
        return;
    }

    // Process nested subfolders
    if (folder.subfolders && Array.isArray(folder.subfolders) && folder.subfolders.length > 0) {
        folder.subfolders.forEach(subfolder => {
            // Skip invalid subfolders
            if (!subfolder || typeof subfolder !== 'object' || !subfolder.name) {
                console.warn('Skipping invalid subfolder:', subfolder);
                return;
            }

            // Create a nested category name
            const nestedSubjectName = `${parentSubject} / ${subfolder.name}`;

            if (!filesBySubject[nestedSubjectName]) {
                filesBySubject[nestedSubjectName] = [];
            }

            // Add files from this subfolder
            if (subfolder.files && Array.isArray(subfolder.files) && subfolder.files.length > 0) {
                subfolder.files.forEach(file => {
                    if (file && typeof file === 'object') {
                        filesBySubject[nestedSubjectName].push(file);
                    } else {
                        console.warn('Skipping invalid file in nested folder:', file);
                    }
                });
            }

            // Recursively process deeper nested folders
            processNestedFolders(subfolder, nestedSubjectName, filesBySubject);
        });
    }
}

// Helper function to find elements containing text
function findElementContainingText(baseSelector, text) {
    try {
        console.log(`Searching for elements matching "${baseSelector}" containing text "${text}"`);
        const elements = document.querySelectorAll(baseSelector);
        console.log(`Found ${elements.length} elements matching "${baseSelector}"`);

        for (const element of elements) {
            const elementText = element.textContent.trim();
            console.log(`Checking element with text: "${elementText}"`);

            if (elementText.toLowerCase().includes(text.toLowerCase())) {
                console.log(`Match found: "${elementText}" contains "${text}"`);
                return element;
            }
        }

        console.log(`No elements matching "${baseSelector}" contain the text "${text}"`);
        return null;
    } catch (error) {
        console.error(`Error in findElementContainingText with selector "${baseSelector}" and text "${text}":`, error);
        return null;
    }
}

// Helper function to find next sibling matching a selector
function findNextSiblingMatching(element, selector) {
    try {
        console.log(`Looking for next sibling of element "${element.tagName}" matching "${selector}"`);

        let sibling = element.nextElementSibling;
        let count = 0;

        while (sibling) {
            count++;
            console.log(`Checking sibling #${count}: ${sibling.tagName} with classes "${sibling.className}"`);

            if (sibling.matches(selector)) {
                console.log(`Match found: ${sibling.tagName} with classes "${sibling.className}"`);
                return sibling;
            }

            sibling = sibling.nextElementSibling;
        }

        console.log(`No matching sibling found after checking ${count} siblings`);
        return null;
    } catch (error) {
        console.error(`Error in findNextSiblingMatching with selector "${selector}":`, error);
        return null;
    }
}

// Function to parse a selector with :contains
function parseContainsSelector(selector) {
    if (selector.includes(':contains(')) {
        const baseSelector = selector.substring(0, selector.indexOf(':contains('));

        // Extract the text between the first opening and last closing parenthesis
        const startPos = selector.indexOf(':contains(') + 10; // 10 is the length of ':contains('
        let endPos = selector.lastIndexOf(')');

        // If no closing parenthesis is found, use the end of the string
        if (endPos === -1 || endPos < startPos) {
            endPos = selector.length;
        }

        const searchText = selector.substring(startPos, endPos);

        // Remove surrounding quotes if they exist
        const cleanedText = searchText.replace(/^["'](.*)["']$/, '$1');

        return { baseSelector, searchText: cleanedText };
    }
    return { baseSelector: selector, searchText: null };
}

// Custom querySelector that supports :contains and adjacent sibling
function customQuerySelector(selector) {
    try {
        if (selector.includes(':contains(') && selector.includes('+')) {
            // Handle case like '.semester-title:contains("Semester 1") + .course-list'
            const [firstPart, secondPart] = selector.split('+').map(s => s.trim());
            const { baseSelector, searchText } = parseContainsSelector(firstPart);

            console.log(`Looking for element matching ${baseSelector} containing text "${searchText}"`);

            const element = findElementContainingText(baseSelector, searchText);
            if (element) {
                console.log(`Found element, now looking for sibling matching ${secondPart}`);
                return findNextSiblingMatching(element, secondPart);
            } else {
                console.log(`No element found matching ${baseSelector} containing text "${searchText}"`);
            }
            return null;
        } else if (selector.includes(':contains(')) {
            const { baseSelector, searchText } = parseContainsSelector(selector);
            console.log(`Looking for element matching ${baseSelector} containing text "${searchText}"`);
            return findElementContainingText(baseSelector, searchText);
        }

        return document.querySelector(selector);
    } catch (error) {
        console.error(`Error in customQuerySelector with selector "${selector}":`, error);
        return null;
    }
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
    // Create <summary> with the same content as <h4>
    const summary = document.createElement('summary');
    summary.className = h4.className;
    summary.innerHTML = h4.innerHTML;

    // Create <details> and append the summary
    const details = document.createElement('details');
    details.appendChild(summary);

    // Move all sibling elements after <h4> into the <details> (until the next h4 or end)
    let next = h4.nextElementSibling;
    while (next && !(next.tagName === 'H4' && next.classList.contains('semester-title'))) {
      const temp = next.nextElementSibling;
      details.appendChild(next);
      next = temp;
    }

    // Replace the <h4> with the new <details> element
    h4.parentNode.replaceChild(details, h4);
  });