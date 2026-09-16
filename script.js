// Image Slider Configuration
const slides = [
  "bg1.jpg",
  "bg2.jpg",
  "bg3.jpg"
];

let current = 0;
const heroImage = document.getElementById("heroImage");
const slideNumber = document.getElementById("slideNumber");
const lineEls = document.querySelectorAll(".slider-lines i");

function showSlide(n) {
  current = (n + slides.length) % slides.length;

  heroImage.style.opacity = "0";

  setTimeout(() => {
    heroImage.style.backgroundImage = url("${slides[current]}");
    heroImage.style.opacity = "1";
  }, 180);

  slideNumber.textContent = ${String(current + 1).padStart(2, "0")} / 03;

  lineEls.forEach((el, i) => {
    el.classList.toggle("active", i === current);
  });
}

showSlide(0);

document.getElementById("next").addEventListener("click", () => showSlide(current + 1));
document.getElementById("prev").addEventListener("click", () => showSlide(current - 1));
setInterval(() => showSlide(current + 1), 6500);

// Music & Entrance Handler
const audio = document.getElementById("audio");
const musicBtn = document.getElementById("music");

document.getElementById("enter").addEventListener("click", () => {
  document.getElementById("opening").classList.add("hide");
  document.body.classList.remove("locked");

  // Autoplay music on user interaction
  audio.play().then(() => {
    musicBtn.classList.add("playing");
  }).catch(() => {
    console.log("Autoplay failed or blocked by user browser settings.");
  });
});

musicBtn.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicBtn.classList.add("playing");
    } catch (e) {
      alert("Audio file 'nikkah.mp3' not found in root folder.");
    }
  } else {
    audio.pause();
    musicBtn.classList.remove("playing");
  }
});

// Countdown Timer
const weddingTime = new Date("2026-11-15T11:30:00+05:30").getTime();

function updateCountdown() {
  const diff = Math.max(0, weddingTime - Date.now());

  document.getElementById("cd-days").textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
  document.getElementById("cd-hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
  document.getElementById("cd-minutes").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  document.getElementById("cd-seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Calendar Event Creation
document.getElementById("calendar").addEventListener("click", () => {
  const start = "20261115T060000Z";
  const end = "20261115T063000Z";

  const url =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent("Wedding — Shahnaz & Adhil") +
    "&dates=" + start + "/" + end +
    "&location=" + encodeURIComponent("Fr. Lopez Auditorium, Colachel") +
    "&details=" + encodeURIComponent("Wedding ceremony of Shahnaz & Adhil.");

  window.open(url, "_blank");
});

// Guestbook / Wishes Form Logic
const form = document.getElementById("wishForm");
const list = document.getElementById("wishList");
const count = document.getElementById("wishCount");

let wishes = JSON.parse(localStorage.getItem("shahnaz-adhil-wishes") || "[]");

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function renderWishes() {
  count.textContent = ${wishes.length} BLESSINGS RECEIVED;
  list.innerHTML = wishes
    .map(w => `
      <article class="wish-card">
        <h4>${escapeHtml(w.name)}</h4>
        <p>“${escapeHtml(w.message)}”</p>
      </article>
    `)
    .join("");
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("wishName").value.trim();
  const message = document.getElementById("wishText").value.trim();

  if (!name || !message) return;

  wishes.unshift({ name, message });
  localStorage.setItem("shahnaz-adhil-wishes", JSON.stringify(wishes));
  form.reset();
  renderWishes();
});

renderWishes();