const cursor = document.querySelector("#cursor");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt]");
const parallaxItems = document.querySelectorAll("[data-depth]");
const posterCards = document.querySelectorAll(".poster-card");
const posters = document.querySelectorAll(".poster-card img");
const portraitWrap = document.querySelector(".portrait-wrap");
const portrait = document.querySelector(".portrait");
const emailLink = document.querySelector(".email-link");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (portrait) {
    portrait.addEventListener("error", () => {
        portrait.dataset.broken = "true";
    });

    if (portrait.complete && portrait.naturalWidth === 0) {
        portrait.dataset.broken = "true";
    }
}

posters.forEach((image) => {
    image.addEventListener("error", () => {
        image.closest(".poster-card")?.classList.add("is-missing");
    });
});

posterCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
        card.style.setProperty("--img-x", `${(0.5 - x) * 18}px`);
        card.style.setProperty("--img-y", `${(0.5 - y) * 18}px`);
        card.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
        card.style.setProperty("--rx", `${(0.5 - y) * 18}deg`);
    });

    card.addEventListener("pointerenter", () => {
        card.classList.add("is-active");
    });

    card.addEventListener("pointerleave", () => {
        card.classList.remove("is-active");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
        card.style.setProperty("--img-x", "0px");
        card.style.setProperty("--img-y", "0px");
    });

    card.addEventListener("click", () => {
        card.classList.remove("is-pulsing");
        void card.offsetWidth;
        card.classList.add("is-pulsing");
    });

    card.addEventListener("animationend", (event) => {
        if (event.animationName === "posterPulse") {
            card.classList.remove("is-pulsing");
        }
    });
});

function animatePosterOrbit(time = 0) {
    const cards = [...posterCards];
    const count = cards.length;

    if (!count) {
        return;
    }

    const stage = cards[0].closest(".poster-grid");
    const stageWidth = stage?.clientWidth || window.innerWidth;
    const viewportNarrow = window.innerWidth <= 900;
    const radiusX = Math.min(stageWidth * (viewportNarrow ? 0.3 : 0.33), viewportNarrow ? 180 : 390);
    const radiusY = radiusX * (viewportNarrow ? 0.54 : 0.46);
    const speed = reducedMotion.matches ? 0 : time / 24000;

    cards.forEach((card, index) => {
        const angle = speed * Math.PI * 2 + (index / count) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.72 + depth * 0.36;
        const rotate = Math.cos(angle) * -7;

        card.style.setProperty("--orbit-x", `${x}px`);
        card.style.setProperty("--orbit-y", `${y}px`);
        card.style.setProperty("--orbit-scale", scale.toFixed(3));
        card.style.setProperty("--orbit-rotate", `${rotate.toFixed(2)}deg`);
        card.style.zIndex = String(Math.round(10 + depth * 90));
    });

    requestAnimationFrame(animatePosterOrbit);
}

if (posterCards.length) {
    animatePosterOrbit();
}

if (portraitWrap) {
    portraitWrap.addEventListener("pointermove", (event) => {
        const rect = portraitWrap.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        portraitWrap.style.setProperty("--portrait-mx", `${x * 100}%`);
        portraitWrap.style.setProperty("--portrait-my", `${y * 100}%`);
        portraitWrap.style.setProperty("--portrait-img-x", `${(0.5 - x) * 22}px`);
        portraitWrap.style.setProperty("--portrait-img-y", `${(0.5 - y) * 22}px`);
        portraitWrap.style.setProperty("--portrait-ry", `${(x - 0.5) * 14}deg`);
        portraitWrap.style.setProperty("--portrait-rx", `${(0.5 - y) * 14}deg`);
    });

    portraitWrap.addEventListener("pointerenter", () => {
        portraitWrap.classList.add("is-active");
    });

    portraitWrap.addEventListener("pointerleave", () => {
        portraitWrap.classList.remove("is-active");
        portraitWrap.style.setProperty("--portrait-rx", "0deg");
        portraitWrap.style.setProperty("--portrait-ry", "0deg");
        portraitWrap.style.setProperty("--portrait-mx", "50%");
        portraitWrap.style.setProperty("--portrait-my", "50%");
        portraitWrap.style.setProperty("--portrait-img-x", "0px");
        portraitWrap.style.setProperty("--portrait-img-y", "0px");
    });

    portraitWrap.addEventListener("click", () => {
        portraitWrap.classList.remove("is-pulsing");
        void portraitWrap.offsetWidth;
        portraitWrap.classList.add("is-pulsing");
    });

    portraitWrap.addEventListener("animationend", (event) => {
        if (event.animationName === "portraitPulse") {
            portraitWrap.classList.remove("is-pulsing");
        }
    });
}

if (cursor) {
    window.addEventListener("pointermove", (event) => {
        cursor.style.transform = `translate(${event.clientX - 14}px, ${event.clientY - 14}px)`;
    });

    document.querySelectorAll("a, button, .portrait-wrap, .poster-card, .system-card").forEach((item) => {
        item.addEventListener("pointerenter", () => cursor.classList.add("is-hot"));
        item.addEventListener("pointerleave", () => cursor.classList.remove("is-hot"));
    });
}

if (emailLink) {
    const email = emailLink.dataset.email;
    const emailHint = emailLink.querySelector("small");
    const originalHint = emailHint?.textContent || "Click to copy email";

    emailLink.addEventListener("click", async (event) => {
        if (!email) {
            return;
        }

        event.preventDefault();

        try {
            await navigator.clipboard.writeText(email);
            emailLink.classList.add("is-copied");
            if (emailHint) {
                emailHint.textContent = "Email copied";
            }
        } catch {
            window.location.href = emailLink.href;
        }

        window.setTimeout(() => {
            emailLink.classList.remove("is-copied");
            if (emailHint) {
                emailHint.textContent = originalHint;
            }
        }, 1800);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
    });

    card.addEventListener("pointerleave", () => {
        card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    });
});

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;
});

function animateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 0);
        item.style.translate = `${currentX * depth}px ${currentY * depth}px`;
    });

    requestAnimationFrame(animateParallax);
}

if (parallaxItems.length) {
    animateParallax();
}
