import gsap from "gsap";
import SplitText from "gsap/SplitText";
import TextPlugin from "gsap/TextPlugin";

gsap.registerPlugin(SplitText, TextPlugin);

const spotifyLink = "https://open.spotify.com/track/5OT7dg7v8YMBHNRTKwt7Wh";

const button = document.getElementById("spotifyButton");
const progress = document.getElementById("progress");
const birthdayBanner = document.getElementById("birthdayBanner");

let clicks = 0;
let birthdayShown = false;

const messages = [
  "Hey handsome ❤️",
  "I thought your birthday deserved a little adventure",
  "Getting closer... 😘",
  "6 years, 8 months, and still counting ❤️",
  "Different cities, all this time, and you're still my favorite person",
  "And somehow, I still haven't run out of reasons to love you ❤️",
  "Happy Birthday ❤️ I love you! 🎵"
];

function centerButton() {
  gsap.set(button, {
    left: "50%",
    top: "55%",
    xPercent: -50,
    yPercent: -50
  });
}

function moveButton() {
  const padding = 30;
  const topSafeArea = birthdayShown ? 320 : 140;

  const minX = padding;
  const maxX = Math.max(minX, window.innerWidth - button.offsetWidth - padding);

  const minY = topSafeArea;
  const maxY = Math.max(minY, window.innerHeight - button.offsetHeight - padding);

  const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  gsap.to(button, {
    left: x,
    top: y,
    xPercent: 0,
    yPercent: 0,
    duration: 0.45,
    ease: "back.out(1.7)"
  });
}

function createConfetti() {
  const colors = ["#ff4d6d", "#ffd166", "#06d6a0", "#4cc9f0", "#ffffff", "#f72585"];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(piece);

    gsap.to(piece, {
      y: window.innerHeight + 40,
      rotation: Math.random() * 720,
      duration: 2.5 + Math.random() * 1.5,
      delay: Math.random() * 0.8,
      ease: "power1.out",
      onComplete: () => piece.remove()
    });
  }
}

function showBirthdayReveal() {
  birthdayShown = true;

  document.body.style.background =
    "linear-gradient(135deg,#1d2671,#c33764,#ffaf7b)";

  birthdayBanner.style.display = "block";

  gsap.fromTo(
    birthdayBanner,
    { y: -80, opacity: 0, scale: 0.7 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
  );

  createConfetti();
}

function animateIntro() {
  const split = SplitText.create("#heading", { type: "chars" });

  gsap.from(split.chars, {
    y: 20,
    autoAlpha: 0,
    stagger: 0.04,
    duration: 0.5,
    ease: "back.out(1.7)"
  });

  gsap.from(progress, {
    opacity: 0,
    duration: 0.8,
    delay: 0.3
  });

  gsap.from(button, {
    scale: 0,
    duration: 0.7,
    delay: 0.4,
    ease: "elastic.out(1, 0.5)"
  });
}

button.addEventListener("click", () => {
  clicks++;
  progress.textContent = `${clicks} / 8`;

  gsap.fromTo(
    button,
    { scale: 1 },
    { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1 }
  );

  if (clicks < 8) {
    gsap.to(button, {
      duration: 0.25,
      text: messages[clicks - 1],
      ease: "none"
    });

    if (clicks === 7) {
      showBirthdayReveal();
      centerButton();

      gsap.to(button, {
        scale: 1.12,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    } else {
      moveButton();
    }
  } else {
    window.open(spotifyLink, "_blank");
  }
});

window.addEventListener("load", () => {
  centerButton();
  animateIntro();
});

window.addEventListener("resize", () => {
  if (clicks === 0 || clicks >= 7) {
    centerButton();
  } else {
    moveButton();
  }
});