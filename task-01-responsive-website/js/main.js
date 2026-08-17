"use strict";

/* ========================================
   1. Shared DOM References and Helpers
======================================== */

const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function getTrimmedValue(field) {
    return field.value.trim();
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);

    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
    field.setAttribute("aria-invalid", "true");

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(field, showValidState = true) {
    const errorElement = document.getElementById(`${field.id}-error`);

    field.classList.remove("is-invalid");
    field.setAttribute("aria-invalid", "false");

    if (showValidState && getTrimmedValue(field) !== "") {
        field.classList.add("is-valid");
    } else {
        field.classList.remove("is-valid");
    }

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function clearAllValidationStates(fields) {
    fields.forEach((field) => {
        field.classList.remove("is-invalid", "is-valid");
        field.setAttribute("aria-invalid", "false");

        const errorElement = document.getElementById(`${field.id}-error`);

        if (errorElement) {
            errorElement.textContent = "";
        }
    });
}


/* ========================================
   Existing Mobile Navigation
======================================== */

function initializeMobileNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-navigation");
    const navigationLinks = document.querySelectorAll(".navigation-list a");

    if (!menuButton || !navigation) {
        return;
    }

    function closeMenu(returnFocus = false) {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");

        if (returnFocus) {
            menuButton.focus();
        }
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        const isOpen = navigation.classList.contains("is-open");

        if (event.key === "Escape" && isOpen) {
            closeMenu(true);
        }
    });
}


/* ========================================
   2. Contact-Form Validation
======================================== */

function initializeContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) {
        return;
    }

    const fullNameField = document.getElementById("full-name");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const subjectField = document.getElementById("subject");
    const messageField = document.getElementById("message");
    const messageCount = document.getElementById("message-count");
    const formStatus = document.getElementById("form-status");

    const fields = [
        fullNameField,
        emailField,
        phoneField,
        subjectField,
        messageField
    ].filter(Boolean);

    function validateFullName() {
        const value = getTrimmedValue(fullNameField);

        if (value === "") {
            showFieldError(fullNameField, "Please enter your full name.");
            return false;
        }

        if (value.length < 2) {
            showFieldError(
                fullNameField,
                "Full name must contain at least 2 characters."
            );
            return false;
        }

        if (value.length > 60) {
            showFieldError(
                fullNameField,
                "Full name must not exceed 60 characters."
            );
            return false;
        }

        clearFieldError(fullNameField);
        return true;
    }

    function validateEmail() {
        const value = getTrimmedValue(emailField);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (value === "") {
            showFieldError(emailField, "Please enter your email address.");
            return false;
        }

        if (!emailPattern.test(value)) {
            showFieldError(
                emailField,
                "Please enter a valid email address."
            );
            return false;
        }

        clearFieldError(emailField);
        return true;
    }

    function validatePhone() {
        const value = getTrimmedValue(phoneField);

        if (value === "") {
            clearFieldError(phoneField, false);
            return true;
        }

        const allowedPhoneCharacters = /^[0-9+\-().\s]+$/;
        const phoneDigits = value.replace(/\D/g, "");

        if (!allowedPhoneCharacters.test(value)) {
            showFieldError(
                phoneField,
                "Phone number contains unsupported characters."
            );
            return false;
        }

        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            showFieldError(
                phoneField,
                "Phone number must contain between 7 and 15 digits."
            );
            return false;
        }

        clearFieldError(phoneField);
        return true;
    }

    function validateSubject() {
        const value = getTrimmedValue(subjectField);

        if (value === "") {
            showFieldError(subjectField, "Please enter a subject.");
            return false;
        }

        if (value.length < 3) {
            showFieldError(
                subjectField,
                "Subject must contain at least 3 characters."
            );
            return false;
        }

        if (value.length > 100) {
            showFieldError(
                subjectField,
                "Subject must not exceed 100 characters."
            );
            return false;
        }

        clearFieldError(subjectField);
        return true;
    }

    function validateMessage() {
        const value = getTrimmedValue(messageField);

        if (value === "") {
            showFieldError(messageField, "Please enter your message.");
            return false;
        }

        if (value.length < 10) {
            showFieldError(
                messageField,
                "Message must contain at least 10 characters."
            );
            return false;
        }

        if (value.length > 500) {
            showFieldError(
                messageField,
                "Message must not exceed 500 characters."
            );
            return false;
        }

        clearFieldError(messageField);
        return true;
    }

    const validationFunctions = new Map([
        [fullNameField, validateFullName],
        [emailField, validateEmail],
        [phoneField, validatePhone],
        [subjectField, validateSubject],
        [messageField, validateMessage]
    ]);

    function updateMessageCount() {
        const usedCharacters = messageField.value.length;

        messageCount.textContent = `${usedCharacters} / 500 characters`;
        messageCount.classList.toggle(
            "is-near-limit",
            usedCharacters >= 450
        );
    }

    function hideFormStatus() {
        formStatus.hidden = true;
        formStatus.textContent = "";
        formStatus.classList.remove("is-success", "is-error");
    }

    function displayFormStatus(type, message) {
        formStatus.hidden = false;
        formStatus.textContent = message;
        formStatus.classList.remove("is-success", "is-error");
        formStatus.classList.add(type);
    }

    fields.forEach((field) => {
        const validateField = validationFunctions.get(field);

        field.addEventListener("blur", () => {
            validateField();
        });

        field.addEventListener("input", () => {
            hideFormStatus();

            if (field.getAttribute("aria-invalid") === "true") {
                validateField();
            }

            if (field === messageField) {
                updateMessageCount();
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        hideFormStatus();

        const validationResults = fields.map((field) => {
            const validateField = validationFunctions.get(field);
            return {
                field,
                isValid: validateField()
            };
        });

        const firstInvalidResult = validationResults.find(
            (result) => !result.isValid
        );

        if (firstInvalidResult) {
            displayFormStatus(
                "is-error",
                "Please correct the highlighted fields before submitting."
            );

            firstInvalidResult.field.focus();
            return;
        }

        displayFormStatus(
            "is-success",
            "Thank you! Your form was validated successfully. This demonstration did not send any data to a server."
        );

        form.reset();
        clearAllValidationStates(fields);
        updateMessageCount();
    });

    updateMessageCount();
}

/* ========================================
   3. Back-to-Top Behavior
======================================== */

function initializeBackToTop() {
    const backToTopButton = document.getElementById("back-to-top");

    if (!backToTopButton) {
        return;
    }

    function updateBackToTopVisibility() {
        const shouldShowButton = window.scrollY > 500;

        backToTopButton.classList.toggle(
            "is-visible",
            shouldShowButton
        );
    }

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotionQuery.matches
                ? "auto"
                : "smooth"
        });
    });

    window.addEventListener(
        "scroll",
        updateBackToTopVisibility,
        { passive: true }
    );

    updateBackToTopVisibility();
}


/* ========================================
   4. Active Navigation State
======================================== */

function initializeActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(
        '.navigation-list a[href^="#"]'
    );

    if (sections.length === 0 || navigationLinks.length === 0) {
        return;
    }

    function setActiveLink(sectionId) {
        navigationLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visibleSections = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (firstEntry, secondEntry) =>
                        secondEntry.intersectionRatio -
                        firstEntry.intersectionRatio
                );

            if (visibleSections.length > 0) {
                setActiveLink(visibleSections[0].target.id);
            }
        },
        {
            root: null,
            rootMargin: "-25% 0px -55% 0px",
            threshold: [0, 0.1, 0.25, 0.5]
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    setActiveLink("home");
}

/* ========================================
   5. Statistics Counters
======================================== */

function initializeStatisticsCounters() {
    const statisticsSection = document.getElementById("statistics");
    const statisticNumbers = document.querySelectorAll(
        ".statistic-number"
    );

    if (!statisticsSection || statisticNumbers.length === 0) {
        return;
    }

    let countersHaveStarted = false;

    function showFinalValues() {
        statisticNumbers.forEach((numberElement) => {
            const targetValue = Number(numberElement.dataset.target);
            const suffix = numberElement.dataset.suffix || "";

            numberElement.textContent = `${targetValue}${suffix}`;
        });
    }

    function animateCounter(numberElement) {
        const targetValue = Number(numberElement.dataset.target);
        const suffix = numberElement.dataset.suffix || "";
        const animationDuration = 1200;
        let animationStartTime = null;

        function updateCounter(currentTime) {
            if (animationStartTime === null) {
                animationStartTime = currentTime;
            }

            const elapsedTime = currentTime - animationStartTime;
            const progress = Math.min(
                elapsedTime / animationDuration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue = Math.round(
                targetValue * easedProgress
            );

            numberElement.textContent =
                `${currentValue}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            }
        }

        numberElement.textContent = `0${suffix}`;
        window.requestAnimationFrame(updateCounter);
    }

    function startCounters() {
        if (countersHaveStarted) {
            return;
        }

        countersHaveStarted = true;

        if (reducedMotionQuery.matches) {
            showFinalValues();
            return;
        }

        statisticNumbers.forEach((numberElement) => {
            animateCounter(numberElement);
        });
    }

    const statisticsObserver = new IntersectionObserver(
        (entries, observer) => {
            const sectionIsVisible = entries.some(
                (entry) => entry.isIntersecting
            );

            if (sectionIsVisible) {
                startCounters();
                observer.disconnect();
            }
        },
        {
            threshold: 0.35
        }
    );

    statisticsObserver.observe(statisticsSection);
}

/* =========================================
   Task 06 - Featured Projects
   ========================================= */

const PROJECT_FILTER_STORAGE_KEY = "nexatech-project-filter";

const featuredProjects = [
    {
        id: 1,
        title: "Business Analytics Dashboard",
        category: "web",
        categoryLabel: "Web",
        description:
            "A responsive dashboard that helps businesses monitor performance and important operational data.",
        technology: "HTML, CSS, JavaScript",
        year: 2026
    },
    {
        id: 2,
        title: "Online Booking Platform",
        category: "web",
        categoryLabel: "Web",
        description:
            "A user-friendly booking interface for managing appointments and service availability.",
        technology: "JavaScript",
        year: 2026
    },
    {
        id: 3,
        title: "Smart Study Assistant",
        category: "mobile",
        categoryLabel: "Mobile",
        description:
            "A mobile application that helps students organize subjects, assignments, and upcoming exams.",
        technology: "Flutter",
        year: 2026
    },
    {
        id: 4,
        title: "Inventory Management App",
        category: "mobile",
        categoryLabel: "Mobile",
        description:
            "A practical mobile solution for reviewing products, stock quantities, and inventory updates.",
        technology: "Mobile Application",
        year: 2026
    },
    {
        id: 5,
        title: "Healthcare Portal Design",
        category: "ui-ux",
        categoryLabel: "UI/UX",
        description:
            "An accessible interface concept that simplifies appointment and patient-service navigation.",
        technology: "Interface Design",
        year: 2026
    },
    {
        id: 6,
        title: "E-Commerce Experience",
        category: "ui-ux",
        categoryLabel: "UI/UX",
        description:
            "A modern shopping experience focused on clear product discovery and a simple checkout flow.",
        technology: "UX Research",
        year: 2026
    }
];

const getProjectsByCategory = (category) =>
    category === "all"
        ? [...featuredProjects]
        : featuredProjects.filter(
            ({ category: projectCategory }) => projectCategory === category
        );

const createProjectCardMarkup = ({
    id,
    title,
    categoryLabel,
    description,
    technology,
    year
}) => `
    <article class="project-card" data-project-id="${id}">
        <span class="project-card-category">${categoryLabel}</span>
        <h3>${title}</h3>
        <p>${description}</p>

        <div class="project-card-details">
            <span class="project-card-detail">${technology}</span>
            <span class="project-card-detail">${year}</span>
        </div>
    </article>
`;

const renderProjects = (category = "all") => {
    const projectsContainer = document.querySelector("#projects-container");
    const projectsStatus = document.querySelector("#projects-status");

    if (!projectsContainer || !projectsStatus) {
        return;
    }

    const visibleProjects = getProjectsByCategory(category);

    projectsContainer.innerHTML = visibleProjects
        .map(createProjectCardMarkup)
        .join("");

    const projectWord = visibleProjects.length === 1 ? "project" : "projects";
    projectsStatus.textContent =
        `Showing ${visibleProjects.length} ${projectWord}.`;
};

const updateProjectFilterButtons = (selectedCategory) => {
    const filterButtons = document.querySelectorAll(".project-filter");

    filterButtons.forEach((button) => {
        const isSelected = button.dataset.category === selectedCategory;

        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });
};

const initializeFeaturedProjects = () => {
    const filterButtons = [...document.querySelectorAll(".project-filter")];

    if (filterButtons.length === 0) {
        return;
    }

    const savedCategory =
        localStorage.getItem(PROJECT_FILTER_STORAGE_KEY) || "all";

    const validCategory = filterButtons.some(
        (button) => button.dataset.category === savedCategory
    )
        ? savedCategory
        : "all";

    renderProjects(validCategory);
    updateProjectFilterButtons(validCategory);

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const { category } = button.dataset;

            localStorage.setItem(PROJECT_FILTER_STORAGE_KEY, category);
            renderProjects(category);
            updateProjectFilterButtons(category);
        });
    });
};

/* =========================================
   Task 06 - REST API Posts
   ========================================= */

const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_DISPLAY_LIMIT = 9;

let loadedPosts = [];

const getPostsElements = () => ({
    container: document.querySelector("#posts-container"),
    loading: document.querySelector("#posts-loading"),
    error: document.querySelector("#posts-error"),
    empty: document.querySelector("#posts-empty"),
    noResults: document.querySelector("#posts-no-results"),
    search: document.querySelector("#posts-search"),
    reset: document.querySelector("#reset-posts-search"),
    retry: document.querySelector("#retry-posts"),
    resultCount: document.querySelector("#posts-result-count")
});

const setPostsState = (state) => {
    const {
        container,
        loading,
        error,
        empty,
        noResults
    } = getPostsElements();

    loading.hidden = state !== "loading";
    error.hidden = state !== "error";
    empty.hidden = state !== "empty";
    noResults.hidden = state !== "no-results";
    container.hidden = state !== "success";
};

const createPostCard = ({ id, title, body }) => {
    const article = document.createElement("article");
    const number = document.createElement("span");
    const heading = document.createElement("h3");
    const description = document.createElement("p");

    article.className = "post-card";
    number.className = "post-card-number";

    number.textContent = `Post ${id}`;
    heading.textContent = title;
    description.textContent = body;

    article.append(number, heading, description);

    return article;
};

const updatePostsResultCount = (count) => {
    const { resultCount } = getPostsElements();
    const resultWord = count === 1 ? "result" : "results";

    resultCount.textContent = `${count} ${resultWord} displayed.`;
};

const renderPosts = (posts) => {
    const { container } = getPostsElements();

    container.replaceChildren();

    if (loadedPosts.length === 0) {
        updatePostsResultCount(0);
        setPostsState("empty");
        return;
    }

    if (posts.length === 0) {
        updatePostsResultCount(0);
        setPostsState("no-results");
        return;
    }

    const postCards = posts.map(createPostCard);

    container.append(...postCards);
    updatePostsResultCount(posts.length);
    setPostsState("success");
};

const filterPosts = (searchValue) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
        return [...loadedPosts];
    }

    return loadedPosts.filter(({ title, body }) =>
        `${title} ${body}`.toLowerCase().includes(normalizedSearchValue)
    );
};

const fetchPosts = async () => {
    const {
        container,
        search,
        reset,
        resultCount
    } = getPostsElements();

    container.replaceChildren();
    resultCount.textContent = "";
    search.disabled = true;
    reset.disabled = true;
    setPostsState("loading");

    try {
        const response = await fetch(POSTS_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP request failed with status ${response.status}`);
        }

        const posts = await response.json();

        loadedPosts = Array.isArray(posts)
            ? posts.slice(0, POSTS_DISPLAY_LIMIT)
            : [];

        search.disabled = loadedPosts.length === 0;
        reset.disabled = loadedPosts.length === 0;

        renderPosts(loadedPosts);
    } catch (error) {
        loadedPosts = [];
        search.disabled = true;
        reset.disabled = true;
        resultCount.textContent = "";
        setPostsState("error");
    }
};

const initializeLatestPosts = () => {
    const {
        container,
        search,
        reset,
        retry
    } = getPostsElements();

    if (!container || !search || !reset || !retry) {
        return;
    }

    search.addEventListener("input", () => {
        const visiblePosts = filterPosts(search.value);
        renderPosts(visiblePosts);
    });

    reset.addEventListener("click", () => {
        search.value = "";
        renderPosts(loadedPosts);
        search.focus();
    });

    retry.addEventListener("click", fetchPosts);

    fetchPosts();
};


/* ========================================
   6. Initialization
======================================== */

function initializeWebsite() {
    initializeMobileNavigation();
    initializeContactForm();
    initializeBackToTop();
    initializeActiveNavigation();
    initializeStatisticsCounters();
    initializeFeaturedProjects();
    initializeLatestPosts();

}

initializeWebsite();