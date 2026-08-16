# Frontend QA Checklist

## Project Information

- Project: NexaTech Solutions Website
- Repository: https://github.com/ziadIkhraiwesh/blue-fullstack-training
- Live website: https://ziadikhraiwesh.github.io/blue-fullstack-training/task-01-responsive-website/
- Tested browsers: Google Chrome and Microsoft Edge
- Tested widths: 320px, 375px, 768px, 1024px, and 1440px
- Zoom level tested: 200%

## Lighthouse Results

| Category | Score |
|---|---:|
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## QA Issue Log

| Issue ID | Area | Screen / Browser | Problem | Severity | Status | Fix Applied |
|---|---|---|---|---|---|---|
| QA-01 | Navigation | Desktop and Mobile / Chrome and Edge | The header was not visible while scrolling, so the active navigation state could not be seen | Medium | Fixed | Changed the site header to use sticky positioning and added section scroll margins |
| QA-02 | Browser Console | GitHub Pages / Chrome | The browser requested a missing favicon and returned a 404 error | Low | Fixed | Added an intentional favicon declaration to prevent the missing-resource request |
| QA-03 | Accessibility | Keyboard / Chrome and Edge | The page did not provide a direct way to skip repeated navigation | High | Fixed | Added a visible-on-focus skip link that moves keyboard focus to the main content |
| QA-04 | Accessibility | Keyboard / Chrome and Edge | Interactive elements required clearer keyboard-focus indicators | High | Fixed | Added consistent `:focus-visible` outlines to links, buttons, and form controls |
| QA-05 | Color Contrast | Mobile Lighthouse | Secondary blue text, service numbers, and the primary button had insufficient contrast | High | Fixed | Replaced the light secondary blue with darker accessible color values |
| QA-06 | Contact Form | Desktop and Mobile / Chrome and Edge | Form behavior required final regression testing | High | Fixed | Retested field-level validation, focus handling, character counter, success state, and form reset |
| QA-07 | Responsive Layout | 320px to 1440px / Chrome and Edge | Layout required verification for overflow, clipping, and overlap | High | Fixed | Tested all required widths and confirmed that the layout remains usable without horizontal scrolling |
| QA-08 | Performance | Mobile Lighthouse | Page performance and loading behavior required review | Medium | Fixed | Confirmed deferred JavaScript, local system fonts, no unnecessary dependencies, and no large content images |
| QA-09 | HTML Structure | Deployed website / Chrome | Duplicate HTML IDs could affect labels, navigation, and scripts | Medium | Fixed | Tested all IDs through the browser console and confirmed that no duplicate IDs exist |
| QA-10 | Motion | Supported browsers | Animations could affect users who prefer reduced motion | Medium | Fixed | Confirmed that the website respects the `prefers-reduced-motion` setting |

## Functional Testing

- [x] Desktop navigation works correctly.
- [x] Mobile menu opens and closes correctly.
- [x] Mobile menu closes after selecting a navigation link.
- [x] Mobile menu closes when the Escape key is pressed.
- [x] Navigation links move to the correct sections.
- [x] Active navigation link updates while scrolling.
- [x] The sticky header keeps the navigation visible while scrolling.
- [x] Contact-form validation works with invalid data.
- [x] Invalid fields display field-level error messages.
- [x] The first invalid field receives focus.
- [x] Entered values are preserved when validation fails.
- [x] Contact-form success state works correctly.
- [x] The successful demonstration does not send data to a server.
- [x] Message character counter works correctly.
- [x] Statistics counters animate when they enter the viewport.
- [x] Statistics counters animate only once.
- [x] Back-to-top button appears and works correctly.
- [x] All buttons and links were checked.
- [x] Browser console contains no JavaScript or missing-resource errors.
- [x] No duplicate HTML IDs were found.

## Accessibility Testing

- [x] Skip-to-content link appears when it receives keyboard focus.
- [x] Skip-to-content link moves focus to the main content.
- [x] All interactive elements are keyboard accessible.
- [x] Tab and Shift+Tab navigation work correctly.
- [x] Enter and Space activate applicable controls.
- [x] Escape closes the mobile navigation menu.
- [x] Focus order is logical.
- [x] Every interactive element has a visible focus style.
- [x] Form fields have visible labels.
- [x] Validation messages are programmatically associated with their fields.
- [x] Status messages are announced accessibly.
- [x] Text and controls have sufficient color contrast.
- [x] Meaning is not communicated through color alone.
- [x] The page works at 200% zoom without layout-breaking horizontal scrolling.
- [x] Reduced-motion preference is supported.
- [x] Lighthouse accessibility score is 100.

## Responsive and Browser Testing

- [x] Tested at 320px.
- [x] Tested at 375px.
- [x] Tested at 768px.
- [x] Tested at 1024px.
- [x] Tested at 1440px.
- [x] Tested in Google Chrome.
- [x] Tested in Microsoft Edge.
- [x] Tested using responsive developer tools.
- [x] Tested using a regular browser window.
- [x] No horizontal scrolling was found.
- [x] No overlapping or clipped content was found.
- [x] Text remains readable across the tested widths.
- [x] Buttons and form controls remain usable.
- [x] Form errors do not break the layout.
- [x] Mobile navigation does not remain open after selecting a link.
- [x] Mobile navigation does not trap keyboard focus unintentionally.

## Performance Testing

- [x] Website assets were reviewed.
- [x] No large content images require compression or resizing.
- [x] Image dimension and lazy-loading requirements are not applicable because the website does not use content images.
- [x] CSS-based visual elements remain clear at different screen sizes.
- [x] The main JavaScript file loads using `defer`.
- [x] No unnecessary external libraries are loaded.
- [x] No unnecessary external font or icon packages are loaded.
- [x] Lighthouse was run in an Incognito window.
- [x] Lighthouse performance score is 99.
- [x] Optimization changes did not break validation, animation, navigation, or responsive behavior.

## Code Quality Review

- [x] HTML, CSS, and JavaScript were reviewed.
- [x] No unnecessary `console.log` statements remain.
- [x] No `debugger` statements remain.
- [x] No temporary TODO markers remain.
- [x] Heading hierarchy was reviewed.
- [x] Section IDs are unique.
- [x] Form labels match their controls.
- [x] No duplicate event listeners were identified.
- [x] Main JavaScript functionality is organized inside `main.js`.

## Final Regression Test

- [x] All functionality from Tasks 1-4 was retested after the final fixes.
- [x] Keyboard and accessibility behavior was retested.
- [x] Contact-form validation was retested with valid and invalid data.
- [x] Responsive behavior was retested after the accessibility fixes.
- [x] GitHub Pages opens the website correctly.
- [x] No stylesheets or scripts are missing.
- [x] The deployed browser console is clean.
- [x] No major functional, accessibility, responsive, or performance issues remain.

## Known Limitations

- The contact form is a frontend demonstration and does not send information to a server.
- The website does not currently include content images; therefore image compression and lazy loading are not applicable.
- No known critical or major issues remain.