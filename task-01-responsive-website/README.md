# NexaTech Solutions Company Website

## Project Overview

NexaTech Solutions is a responsive single-page website created for a fictional technology company as part of the Blue Full-Stack Development Training Program.

The project was developed and improved throughout Tasks 01-05. It includes semantic HTML, reusable CSS architecture, responsive layouts, accessible mobile navigation, contact-form validation, DOM interactions, frontend quality assurance, accessibility improvements, performance testing, and GitHub Pages deployment.

## Live Website

- Live website: https://ziadikhraiwesh.github.io/blue-fullstack-training/task-01-responsive-website/
- GitHub repository: https://github.com/ziadIkhraiwesh/blue-fullstack-training
- QA checklist: [qa-checklist.md](qa-checklist.md)

## Main Features

- Semantic single-page company website.
- Responsive desktop, tablet, and mobile layouts.
- Accessible mobile navigation menu.
- Sticky navigation header.
- Active navigation state while scrolling.
- Visible keyboard-focus indicators.
- Skip-to-main-content link.
- Six reusable service cards.
- Animated company statistics.
- Accessible contact-form validation.
- Field-level validation messages.
- Live message character counter.
- Successful form-submission state.
- Back-to-top button.
- Reduced-motion support.
- Cross-browser and responsive testing.
- GitHub Pages deployment.

## Technologies and Tools

### Frontend Technologies

- HTML5
- CSS3
- JavaScript
- CSS Flexbox
- CSS Grid
- CSS custom properties
- Media queries
- DOM APIs
- Intersection Observer API

### Development and Testing Tools

- Visual Studio Code
- Git
- GitHub
- GitHub Pages
- Google Chrome
- Microsoft Edge
- Chrome DevTools
- Lighthouse

### Environment Tools Verified During Task 01

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
|-- qa-checklist.md
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- images/
|   |-- task-02-desktop.png
|   |-- task-03-desktop.png
|   |-- task-03-tablet.png
|   |-- task-03-mobile.png
|   |-- task-04-invalid-form.png
|   |-- task-04-success-form.png
|   |-- task-04-page-interaction.png
|   |-- task-05-desktop.png
|   |-- task-05-mobile.png
|   |-- task-05-lighthouse.png
|   `-- task-05-keyboard-focus.png
`-- README.md
```

## How to Run the Project

No packages or build commands are required.

### Option 1: Open Directly

1. Clone or download the repository.
2. Open the `blue-fullstack-training` folder.
3. Open the `task-01-responsive-website` folder.
4. Open `index.html` in a modern browser.

### Option 2: Run Through a Local Server

From the repository directory, run:

```bash
php -S localhost:8000 -t task-01-responsive-website
```

Then open:

```text
http://localhost:8000
```

The project can also be opened using the Live Server extension in Visual Studio Code.

## Task 01 - Semantic HTML and Project Setup

During Task 01, I:

- Installed and verified the required development tools.
- Created and connected the public GitHub repository.
- Created the required project folder structure.
- Built the website using semantic HTML5 elements.
- Added a header, navigation, hero, About section, services, statistics, contact section, contact form, and footer.
- Added six company services and three statistics.
- Added visible form labels and suitable input types.
- Linked the external CSS and JavaScript files.
- Used meaningful Git commits.

### Task 01 Challenge

The initial remote GitHub repository URL was incorrect. I corrected the remote URL and successfully pushed the project.

## Task 02 - CSS Architecture and Desktop Styling

During Task 02, I:

- Organized the stylesheet into variables, base rules, typography, reusable components, and section-specific styles.
- Used CSS custom properties for colors, spacing, borders, shadows, transitions, and container widths.
- Used Flexbox for navigation, buttons, and alignment.
- Used CSS Grid for the hero, About section, services, statistics, contact section, and form.
- Created reusable classes for containers, sections, buttons, cards, and form controls.
- Applied consistent typography, spacing, colors, shadows, and border radii.
- Completed the full desktop layout without using CSS frameworks.

### Task 02 Screenshot

![Task 02 desktop design](images/task-02-desktop.png)

## Task 03 - Responsive Design and Mobile Navigation

During Task 03, I:

- Added media queries for desktop, tablet, and mobile layouts.
- Adapted typography, spacing, grids, buttons, cards, and form controls.
- Changed the services layout from three columns to two columns and then one column.
- Stacked content where necessary on smaller screens.
- Prevented horizontal scrolling, overlap, and clipped content.
- Added a real mobile-menu button.
- Used `aria-label`, `aria-controls`, and `aria-expanded`.
- Added mouse and keyboard support.
- Closed the menu after selecting a link.
- Added Escape-key support and returned focus to the menu button.

### Task 03 Screenshots

#### Desktop View

![Task 03 desktop view](images/task-03-desktop.png)

#### Tablet View

![Task 03 tablet view](images/task-03-tablet.png)

#### Mobile View

![Task 03 mobile view](images/task-03-mobile.png)

### Task 03 Challenge

The mobile-menu toggle initially had a small behavior issue. I corrected the class-toggle logic and retested the menu using mouse and keyboard controls.

## Task 04 - JavaScript DOM Interactions and Form Validation

During Task 04, I organized the JavaScript inside `main.js` and implemented accessible contact-form validation and DOM interactions.

### Contact-Form Validation

- Validated required and whitespace-only values.
- Validated name length.
- Validated email format.
- Kept the phone field optional while validating its digit length when entered.
- Validated subject and message lengths.
- Added field-level error messages.
- Added a live message character counter.
- Focused the first invalid field.
- Preserved entered values when validation failed.
- Used `aria-invalid`, `aria-describedby`, and accessible status messages.
- Added a successful client-side state.
- Reset the form after successful validation.
- Clearly explained that the demonstration does not send data to a server.

### Page Interactions

- Added a back-to-top button.
- Updated the active navigation link while scrolling.
- Animated the statistics counters once when they entered the viewport.
- Preserved accessible mobile-navigation behavior.
- Added reduced-motion support.

### Task 04 Screenshots

#### Invalid Form State

![Task 04 invalid form](images/task-04-invalid-form.png)

#### Successful Submission State

![Task 04 successful form](images/task-04-success-form.png)

#### Page Interaction

![Task 04 page interaction](images/task-04-page-interaction.png)

### Task 04 Challenge

A local `file://` security warning appeared during browser device-emulation testing. The deployed website works correctly, and the warning is avoided by using a local HTTP server or GitHub Pages.

## Task 05 - Frontend QA, Accessibility, Performance, and Deployment

During Task 05, I completed a structured final quality review of the work implemented during Tasks 01-04.

### Functional QA and Code Review

- Retested desktop and mobile navigation.
- Retested section links and active navigation states.
- Retested contact-form validation and successful submission.
- Retested the character counter, statistics animation, and back-to-top button.
- Reviewed the HTML, CSS, and JavaScript.
- Checked for unnecessary console statements and temporary debugging code.
- Confirmed that section IDs are unique.
- Confirmed that form labels match their controls.
- Confirmed that the deployed browser console is clean.
- Documented the test results in [qa-checklist.md](qa-checklist.md).

### Accessibility Improvements

- Added a visible-on-focus skip link.
- Added clear `:focus-visible` styles.
- Tested the page using Tab, Shift+Tab, Enter, Space, and Escape.
- Confirmed logical keyboard-focus order.
- Confirmed accessible form labels, errors, and status messages.
- Improved text and button color contrast.
- Tested the website at 200% zoom.
- Confirmed reduced-motion support.
- Achieved a Lighthouse Accessibility score of 100.

### Performance Review

- Confirmed that the main JavaScript file loads using `defer`.
- Confirmed that no unnecessary external libraries, fonts, or icon packages are loaded.
- Confirmed that the CSS-based visuals do not require image optimization.
- Verified that no large content images require compression or lazy loading.
- Ran Lighthouse in an Incognito browser window.
- Achieved a Lighthouse Performance score of 99.

### Responsive and Cross-Browser Testing

The final website was tested at:

- `320px`
- `375px`
- `768px`
- `1024px`
- `1440px`
- `200%` browser zoom

The website was tested in:

- Google Chrome
- Microsoft Edge

No major horizontal scrolling, overlap, clipping, keyboard, validation, or browser-console issues remain.

## Lighthouse Results

| Category | Score |
|---|---:|
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Task 05 Evidence

### Final Desktop View

![Task 05 desktop view](images/task-05-desktop.png)

### Final Mobile View

![Task 05 mobile view](images/task-05-mobile.png)

### Lighthouse Results

![Task 05 Lighthouse results](images/task-05-lighthouse.png)

### Visible Keyboard-Focus State

![Task 05 keyboard focus](images/task-05-keyboard-focus.png)

## QA Documentation

The full functional, accessibility, responsive, cross-browser, performance, and regression-testing results are available in:

[Frontend QA Checklist](qa-checklist.md)

## Task 06 - Modern JavaScript and REST API Integration

During Task 06, I extended the existing website with two data-driven sections using modern vanilla JavaScript.

### Featured Projects

- Created an array containing six structured project objects.
- Included an ID, title, category, description, technology, and year for each project.
- Generated all project cards dynamically instead of hardcoding repeated HTML.
- Added All, Web, Mobile, and UI/UX category filters.
- Updated the visible project count whenever a filter is selected.
- Saved the selected category in `localStorage` and restored it after page refresh.
- Used modern JavaScript features including `const`, `let`, arrow functions, destructuring, template literals, spread syntax, `map()`, and `filter()`.

### REST API Integration

The Latest Posts section loads data from the JSONPlaceholder REST API:

https://jsonplaceholder.typicode.com/posts

- Used `fetch()` inside an asynchronous function with `async` and `await`.
- Checked `response.ok` before processing the response.
- Converted the response to JSON and displayed nine returned posts.
- Used `textContent` to safely render external API content.
- Implemented loading, success, empty, no-results, and error states.
- Added a Retry button that repeats the request without reloading the page.
- Prevented repeated Retry actions from duplicating cards or event listeners.

### Search and UI State

- Added case-insensitive client-side search.
- Matched the search value against post titles and body content.
- Filtered the already loaded data without sending additional API requests.
- Added a live visible-result count.
- Added a Clear Search button.
- Added a clear no-matching-results message.
- Kept loading, error, empty, no-results, and successful data states separate.

### API and Quality Testing

- Inspected the request using the browser Network panel.
- Confirmed that the endpoint uses the GET method and returns a successful response.
- Simulated an offline request failure.
- Confirmed that the error message and Retry button work correctly.
- Restored the connection and successfully loaded the posts through Retry without refreshing.
- Tested the new sections at 320px, 375px, 768px, 1024px, and 1440px.
- Tested keyboard navigation and visible focus states.
- Confirmed that the final browser console contains no JavaScript errors.

### Task 06 Screenshots

#### Dynamic Projects and Category Filters

![Task 06 projects](images/task-06-projects.png)

#### Successfully Loaded API Posts

![Task 06 API posts](images/task-06-posts.png)

#### API Search No-Results State

![Task 06 no-results state](images/task-06-no-results.png)

## Known Limitations

- The contact form is a frontend demonstration and does not send information to a backend, email service, database, or external API.
- The website does not currently contain content images; therefore image compression and lazy loading are not applicable.
- No known critical or major issues remain.
- The Latest Posts section depends on the external JSONPlaceholder API and requires an internet connection.

## Deployment

The final frontend version is deployed through GitHub Pages:

https://ziadikhraiwesh.github.io/blue-fullstack-training/task-01-responsive-website/