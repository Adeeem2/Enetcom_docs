# ENET'Com Academic Document Archive

A static, responsive website for ENET'Com (École Nationale d'Électronique et des Télécommunications de Sfax) that serves as an academic document archive. The site features a clean and modern design with a homepage introducing ENET'Com and its mission, and includes navigation to four main academic branches: IDSD, GII, GT, and GEC.

## Features

- Responsive design that works on desktop, tablet, and mobile devices
- Clean, modern interface with intuitive navigation
- Document organization by academic branch, year, and course
- Search functionality to find documents across all branches
- Filter functionality within each branch page
- Fast loading with optimized assets
- Integration with Google Drive for IDSD first year documents

## Technologies Used

- HTML5
- CSS3
- JavaScript (vanilla, no frameworks)
- Font Awesome for icons
- Google Fonts for typography

## Directory Structure

```
ENET'Com-Academic-Archive/
├── index.html
├── idsd.html
├── gii.html
├── gt.html
├── gec.html
├── search-results.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── img/
│   └── hero-bg.jpg (optional)
└── documents/
    ├── idsd/
    │   ├── 2022/
    │   │   ├── decision_theory.pdf
    │   │   ├── game_theory.pdf
    │   │   └── ...
    │   └── 2023/
    │       ├── data_science_intro.pdf
    │       ├── data_visualization.pdf
    │       └── ...
    ├── gii/
    │   ├── 2022/
    │   │   └── ...
    │   └── 2023/
    │       └── ...
    ├── gt/
    │   ├── 2022/
    │   │   └── ...
    │   └── 2023/
    │       └── ...
    └── gec/
        ├── 2022/
        │   └── ...
        └── 2023/
            └── ...
```

## Setup Instructions

1. Clone or download this repository
2. Create the directory structure for documents as shown above
3. Add your PDF documents to the appropriate directories
4. Open `index.html` in a web browser to view the website

## PDF Document Requirements

For the website to work correctly with your PDF documents:

1. Create the directory structure as shown above
2. Name your PDF files to match the links in the HTML files, or update the links in the HTML files to match your PDF filenames
3. Ensure all PDF files are properly formatted and accessible

## Customization

You can customize this website by:

1. Updating the content in the HTML files
2. Modifying the styles in `css/style.css`
3. Adding or removing document categories in the branch pages
4. Changing the color scheme by updating the CSS variables

## Browser Compatibility

This website is compatible with:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)
- Opera (latest)

## Mobile Responsiveness

The website is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## External Document Integration

The website includes integration with external document repositories:

- IDSD first year documents are linked directly to a Google Drive folder: https://drive.google.com/drive/u/0/folders/1wpv5j8nH6OAxRue3VfS9xJ54JMAtWuad
- Users can access all IDSD first year documents by clicking on any document link in the IDSD page
- An information box on the IDSD page informs users that documents are hosted on Google Drive
- This approach allows for easy document updates without modifying the website code

## License

This project is available for use under the MIT License.

## Credits

- Font Awesome for icons
- Google Fonts for typography
