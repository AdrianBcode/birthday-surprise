"use strict";

gsap.registerPlugin(TextPlugin);

// ─── Config ───────────────────────────────────────────────────────────────────

const SPOTIFY_URL     = "https://open.spotify.com/track/5OT7dg7v8YMBHNRTKwt7Wh";
const TOTAL_CLICKS    = 8;
const REVEAL_AT_CLICK = TOTAL_CLICKS - 1; // click 7 → birthday reveal + last message

const MESSAGES = [
  "Hey handsome ❤️",
  "I thought your birthday deserved a little adventure",
  "Getting closer... 😘",
  "6 years, 8 months, and still counting ❤️",
  "Different cities, all this time, and you're still my favorite person",
  "And somehow, I still haven't run out of reasons to love you ❤️",
  "Happy Birthday ❤️ I love you! 🎵"
];

const CONFETTI_COLORS = ["#ff4d6d", "#ffd166", "#06d6a0", "#4cc9f0", "#ffffff", "#f72585"];

// ─── DOM ──────────────────────────────────────────────────────────────────────

const button  = document.getElementById("spotifyButton");
const counter = document.getElementById("progress");
const banner  = document.getElementById("birthdayBanner");
const intro   = document.getElementById("intro");

// ─── State ────────────────────────────────────────────────────────────────────

let clicks     = 0;
let pulseTween = null;

// ─── Button positioning ───────────────────────────────────────────────────────

function centerButton() {
  gsap.set(button, { left: "50%", top: "55%", xPercent: -50, yPercent: -50 });
}

function moveButton() {
  const pad     = 20;
  const header  = clicks >= REVEAL_AT_CLICK ? banner : intro;
  const safeTop = header.getBoundingClientRect().bottom + pad;

  const x = Math.random() * (window.innerWidth  - button.offsetWidth  - pad * 2) + pad;
  const y = Math.random() * (window.innerHeight - button.offsetHeight - safeTop) + safeTop;

  gsap.to(button, { left: x, top: y, xPercent: 0, yPercent: 0, duration: 0.45, ease: "back.out(1.7)" });
}

// ─── Animations ───────────────────────────────────────────────────────────────

function playIntro() {
  const heading = document.getElementById("heading");

  // Wrap each character in a span so GSAP can stagger-animate them one by one.
  // Using spread [...text] instead of .split("") handles multi-byte emoji correctly.
  heading.innerHTML = [...heading.textContent]
    .map(ch => `<span style="display:inline-block">${ch.trim() ? ch : "&nbsp;"}</span>`)
    .join("");

  gsap.from(heading.querySelectorAll("span"), {
    y: 20, autoAlpha: 0, stagger: 0.04, duration: 0.5, ease: "back.out(1.7)"
  });
  gsap.from(counter, { autoAlpha: 0, duration: 0.8, delay: 0.3 });
  gsap.from(button,  { scale: 0,     duration: 0.7, delay: 0.4, ease: "elastic.out(1, 0.5)" });
}

function playReveal() {
  document.body.style.background = "linear-gradient(135deg, #1d2671, #c33764, #ffaf7b)";

  banner.style.display = "block";
  gsap.fromTo(banner,
    { y: -80, autoAlpha: 0, scale: 0.7 },
    { y:   0, autoAlpha: 1, scale: 1,   duration: 0.8, ease: "back.out(1.7)" }
  );

  spawnConfetti();
}

function startPulse() {
  pulseTween = gsap.to(button, {
    scale: 1.12, duration: 0.7, repeat: -1, yoyo: true, ease: "power1.inOut"
  });
}

function spawnConfetti() {
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left       = `${Math.random() * 100}vw`;
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

    // Three possible shapes: square (0), circle (1), tall strip (2)
    const shape = Math.floor(Math.random() * 3);
    if (shape === 1) piece.style.borderRadius = "50%";
    if (shape === 2) { piece.style.width = "5px"; piece.style.height = "14px"; }

    document.body.appendChild(piece);
    gsap.to(piece, {
      y: window.innerHeight + 40, rotation: Math.random() * 720,
      duration: 2.5 + Math.random() * 1.5, delay: Math.random() * 0.8,
      ease: "power1.out", onComplete: () => piece.remove()
    });
  }
}

// ─── Click handler ────────────────────────────────────────────────────────────

function handleClick() {
  clicks++;
  counter.textContent = `${clicks} / ${TOTAL_CLICKS}`;

  // Final click — kill the pulse and open Spotify
  if (clicks === TOTAL_CLICKS) {
    pulseTween?.kill();
    window.open(SPOTIFY_URL, "_blank", "noopener,noreferrer");
    return;
  }

  // Every other click — bounce the button and update its label
  gsap.fromTo(button, { scale: 1 }, { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1 });
  gsap.to(button, { duration: 0.25, text: MESSAGES[clicks - 1], ease: "none" });

  if (clicks === REVEAL_AT_CLICK) {
    // Click 7 — birthday reveal, centre the button, then start pulsing
    playReveal();
    centerButton();
    gsap.delayedCall(0.35, startPulse); // small delay so bounce finishes first
  } else {
    // Clicks 1–6 — move the button to a random safe position
    moveButton();
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

button.addEventListener("click", handleClick);

window.addEventListener("load", () => {
  centerButton();
  playIntro();
});

window.addEventListener("resize", () => {
  if (clicks === 0 || clicks >= REVEAL_AT_CLICK) {
    centerButton();
  } else {
    moveButton();
  }
});