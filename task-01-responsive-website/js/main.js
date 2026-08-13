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
   6. Initialization
======================================== */

function initializeWebsite() {
    initializeMobileNavigation();
    initializeContactForm();
}

initializeWebsite();