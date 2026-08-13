# NexaTech Solutions Company Website

## Project Description

This project is the initial semantic HTML structure for a fictional technology company website. It was created as part of Task 01 of the Blue Full-Stack Development Training Program.

The page includes a header, navigation menu, hero section, About Us section, services, company statistics, contact information, a contact form, and a footer.

The main focus of Task 01 is development environment setup, Git and GitHub workflow, project organization, and semantic HTML.

## Technologies and Tools

- HTML5
- CSS3
- JavaScript
- Visual Studio Code
- Git
- GitHub
- Google Chrome
- Node.js and npm
- PHP
- MySQL
- Laragon
- Composer
- Postman

## Project Structure

```text
task-01-responsive-website/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- images/
|   `-- .gitkeep
`-- README.md
```

## How to Run the Project

1. Download or clone the repository.
2. Open the `blue-fullstack-training` folder in Visual Studio Code.
3. Open the `task-01-responsive-website` folder.
4. Open the `index.html` file in Google Chrome or another modern web browser.

No additional packages or installation commands are required to run Task 01.

## Task 01 Summary

During Task 01, I completed the following work:

- Installed and verified the required development tools.
- Created a public GitHub repository.
- Created the required project folder structure.
- Initialized Git and connected the local project to GitHub.
- Built the company website using semantic HTML5 elements.
- Added the required page sections and navigation links.
- Added six service cards and three company statistics.
- Created an accessible contact form with visible labels and suitable input types.
- Added basic HTML form validation.
- Linked the external CSS and JavaScript files.
- Added basic placeholder styling.
- Used meaningful Git commits to document the development progress.

## Challenges and Blockers

I initially faced an issue while connecting the local repository to GitHub because the remote repository URL was incorrect. I corrected the remote URL and successfully pushed the project.

No remaining blockers were encountered during Task 01.

## Future Improvements

Full responsive styling and JavaScript interactions will be added during the upcoming training tasks.

## Task 02 Progress

During Task 02, I converted the semantic HTML structure into a complete desktop-styled company website.

### Styling Approach

- Organized the CSS file into variables, base styles, typography, reusable utilities, and section-specific styles.
- Used CSS custom properties for colors, spacing, border radii, shadows, transitions, and the maximum container width.
- Applied a consistent typography hierarchy and reusable spacing values across the page.
- Added visible hover and keyboard-focus states to interactive elements.

### Layout Systems

- Used Flexbox for the header, navigation, buttons, and footer alignment.
- Used CSS Grid for the hero, About section, service cards, statistics, contact section, and form rows.
- Used a reusable centered container to maintain consistent alignment and horizontal spacing.

### Reusable Components

The design uses reusable classes including:

- `container`
- `section`
- `section-title`
- `button`
- `card`
- `form-control`

### Design Decisions

- Used blue tones to create a professional technology-company appearance.
- Used consistent cards, shadows, spacing, and border radii.
- Kept the page focused on desktop styling because responsive behavior and mobile navigation will be implemented in Task 03.
- Avoided frameworks, inline styles, copied templates, and unnecessary absolute positioning.

### Desktop Screenshot

![Task 02 desktop design](images/task-02-desktop.png)

### Challenges and Blockers

No major challenges or blockers were encountered during Task 02.

## Task 03 Progress

During Task 03, I converted the desktop website into a responsive interface that works across desktop, tablet, and mobile screen sizes.

### Responsive Implementation

- Added organized media queries for screen widths around `1024px`, `768px`, and `480px`.
- Adapted typography, spacing, grids, cards, buttons, form controls, and section layouts for smaller screens.
- Preserved the original desktop design while preventing horizontal scrolling, overlapping content, and clipped text.
- Changed the services layout from three columns on desktop to two columns on tablets and one column on mobile.
- Stacked the About, Contact, form fields, statistics, and footer content when the available width becomes limited.

### Mobile Navigation

- Added a real mobile-menu `button` with `aria-label`, `aria-controls`, and `aria-expanded`.
- Used JavaScript to open and close the navigation menu by toggling the `is-open` class.
- Updated the button label and accessibility state when the menu opens or closes.
- Closed the menu after selecting a navigation link.
- Added support for closing the menu with the `Escape` key and returning focus to the menu button.
- Tested the menu using mouse and keyboard controls.

### Cross-Device Testing

The website was tested at approximately:

- `1440px`
- `1024px`
- `768px`
- `390px`
- `320px`

The tested layouts contain no horizontal scrolling, overlapping sections, or clipped content.

### Task 03 Screenshots

#### Desktop View

![Task 03 desktop view](images/task-03-desktop.png)

#### Tablet View

![Task 03 tablet view](images/task-03-tablet.png)

#### Mobile View

![Task 03 mobile view](images/task-03-mobile.png)

### Challenges and Blockers

I encountered a small issue with the mobile menu toggle behavior. I reviewed the JavaScript class-toggle logic, corrected it, and verified that the menu now opens and closes correctly.

No remaining blockers were encountered during Task 03.

## Task 04 Progress

During Task 04, I added an organized JavaScript layer to the existing responsive website. The implementation includes accessible contact-form validation and several DOM-based page interactions.

### Contact-Form Validation

- Added field-level validation with readable error messages.
- Validated required, whitespace-only, short, long, and malformed values.
- Made the phone field optional and validated it based on the number of digits when entered.
- Added a live character counter for the message field.
- Focused the first invalid field after an unsuccessful submission.
- Preserved entered values when validation errors exist.
- Added accessible validation states using `aria-invalid`, `aria-describedby`, and live status messages.
- Added a successful client-side submission state that resets the form and clearly explains that no data was sent to a server.

### DOM Interactions

- Added a back-to-top button that appears after scrolling and returns the page smoothly to the top.
- Updated the active navigation link according to the visible page section using `IntersectionObserver`.
- Animated the statistics counters when the statistics section first enters the viewport.
- Prevented the statistics animation from running repeatedly.
- Preserved the accessible mobile navigation functionality from Task 03.
- Respected `prefers-reduced-motion` for smooth scrolling and counter animations.

### Testing

The following cases were tested:

- Empty and whitespace-only values.
- Invalid email addresses.
- Optional, short, long, and malformed phone numbers.
- Short and valid subject and message values.
- Invalid and valid form submissions.
- Keyboard navigation and visible focus states.
- Mobile navigation, back-to-top behavior, active navigation, and statistics counters.
- Responsive layouts at desktop, tablet, and mobile sizes.
- Browser console output and JavaScript regressions.

### Task 04 Screenshots

#### Invalid Form State

![Task 04 invalid form](images/task-04-invalid-form.png)

#### Successful Submission State

![Task 04 successful form](images/task-04-success-form.png)

#### Page Interaction

![Task 04 page interaction](images/task-04-page-interaction.png)

### Challenges and Blockers

A local `file://` security warning appeared while testing anchor links inside browser device emulation. The website functionality worked correctly, and the warning can be avoided by running the project through a local HTTP server or GitHub Pages.

No remaining implementation blockers were encountered during Task 04.