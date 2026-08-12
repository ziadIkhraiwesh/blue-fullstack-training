const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
const navigationLinks = document.querySelectorAll(".navigation-list a");

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
        isOpen ? "Close navigation menu" : "Open navigation menu"
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

const desktopMediaQuery = window.matchMedia("(min-width: 769px)");

function handleScreenChange(event) {
    if (event.matches) {
        closeMenu();
    }
}

desktopMediaQuery.addEventListener("change", handleScreenChange);