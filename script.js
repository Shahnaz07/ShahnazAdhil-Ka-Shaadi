// ======================================================
// SHAHNAZ & ADHIL — WEDDING WEBSITE SCRIPT
// ======================================================


// ======================================================
// GOOGLE SHEETS / WISHES API
// ======================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbxhJmgW6lOhxKRPUwgCpX59zp_m4ea0RzspGikqCFowDZ37IUJzJSTn7OIEwS5VdE4Y/exec";


// ======================================================
// IMAGE SLIDER
// ======================================================

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

  if (heroImage) {
    heroImage.style.opacity = "0";

    setTimeout(() => {
      heroImage.style.backgroundImage =
        `url("${slides[current]}")`;

      heroImage.style.opacity = "1";
    }, 180);
  }

  if (slideNumber) {
    slideNumber.textContent =
      `${String(current + 1).padStart(2, "0")} / 03`;
  }

  lineEls.forEach((el, i) => {
    el.classList.toggle("active", i === current);
  });
}

showSlide(0);


const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

if (nextButton) {
  nextButton.addEventListener("click", () => {
    showSlide(current + 1);
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    showSlide(current - 1);
  });
}


// Automatically change image every 6.5 seconds

setInterval(() => {
  showSlide(current + 1);
}, 6500);


// ======================================================
// MUSIC & OPEN INVITATION
// ======================================================

const audio = document.getElementById("audio");
const musicBtn = document.getElementById("music");
const enterButton = document.getElementById("enter");
const opening = document.getElementById("opening");


if (enterButton) {

  enterButton.addEventListener("click", () => {

    if (opening) {
      opening.classList.add("hide");
    }

    document.body.classList.remove("locked");

    if (audio) {

      audio.play()
        .then(() => {

          if (musicBtn) {
            musicBtn.classList.add("playing");
          }

        })
        .catch(() => {

          console.log(
            "Music could not autoplay."
          );

        });

    }

  });

}


// Music button

if (musicBtn && audio) {

  musicBtn.addEventListener("click", async () => {

    if (audio.paused) {

      try {

        await audio.play();

        musicBtn.classList.add("playing");

      } catch (e) {

        alert(
          "Audio file 'nikkah.mp3' could not be played."
        );

      }

    } else {

      audio.pause();

      musicBtn.classList.remove("playing");

    }

  });

}


// ======================================================
// COUNTDOWN TIMER
// ======================================================

const weddingTime =
  new Date("2026-11-15T11:30:00+05:30").getTime();


function updateCountdown() {

  const diff =
    Math.max(0, weddingTime - Date.now());


  const days =
    Math.floor(diff / 86400000);

  const hours =
    Math.floor(
      (diff % 86400000) / 3600000
    );

  const minutes =
    Math.floor(
      (diff % 3600000) / 60000
    );

  const seconds =
    Math.floor(
      (diff % 60000) / 1000
    );


  const daysElement =
    document.getElementById("cd-days");

  const hoursElement =
    document.getElementById("cd-hours");

  const minutesElement =
    document.getElementById("cd-minutes");

  const secondsElement =
    document.getElementById("cd-seconds");


  if (daysElement) {
    daysElement.textContent =
      String(days).padStart(2, "0");
  }

  if (hoursElement) {
    hoursElement.textContent =
      String(hours).padStart(2, "0");
  }

  if (minutesElement) {
    minutesElement.textContent =
      String(minutes).padStart(2, "0");
  }

  if (secondsElement) {
    secondsElement.textContent =
      String(seconds).padStart(2, "0");
  }

}


updateCountdown();

setInterval(updateCountdown, 1000);


// ======================================================
// GOOGLE CALENDAR
// ======================================================

const calendarButton =
  document.getElementById("calendar");


if (calendarButton) {

  calendarButton.addEventListener("click", () => {

    const start =
      "20261115T060000Z";

    const end =
      "20261115T063000Z";


    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" +
      encodeURIComponent(
        "Wedding — Shahnaz & Adhil"
      ) +
      "&dates=" +
      start +
      "/" +
      end +
      "&location=" +
      encodeURIComponent(
        "Fr. Lopez Auditorium, Colachel"
      ) +
      "&details=" +
      encodeURIComponent(
        "Wedding ceremony of Shahnaz & Adhil."
      );


    window.open(url, "_blank");

  });

}


// ======================================================
// GUESTBOOK / WISHES
// ======================================================

const form =
  document.getElementById("wishForm");

const list =
  document.getElementById("wishList");

const count =
  document.getElementById("wishCount");


// Escape HTML so guest messages cannot insert HTML

function escapeHtml(str) {

  return String(str).replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );

}


// ======================================================
// DISPLAY WISHES
// ======================================================

function renderWishes(wishes) {

  if (!list || !count) {
    return;
  }


  count.textContent =
    `${wishes.length} BLESSINGS RECEIVED`;


  if (wishes.length === 0) {

    list.innerHTML = `
      <p class="empty-wishes">
        Be the first to leave a blessing.
      </p>
    `;

    return;
  }


  list.innerHTML =
    wishes.map(w => `

      <article class="wish-card">

        <h4>
          ${escapeHtml(w.name || "Anonymous")}
        </h4>

        <p>
          “${escapeHtml(w.message || "")}”
        </p>

      </article>

    `).join("");

}


// ======================================================
// LOAD WISHES FROM GOOGLE SHEET
// ======================================================

async function loadWishes() {

  if (!list || !count) {
    return;
  }


  try {

    const response =
      await fetch(API_URL);


    if (!response.ok) {
      throw new Error(
        "Could not load wishes."
      );
    }


    const wishes =
      await response.json();


    if (Array.isArray(wishes)) {

      renderWishes(wishes);

    } else {

      console.error(
        "Unexpected wishes response:",
        wishes
      );

      renderWishes([]);

    }


  } catch (error) {

    console.error(
      "Error loading wishes:",
      error
    );


    count.textContent =
      "BLESSINGS";


    list.innerHTML = `
      <p class="empty-wishes">
        Wishes will appear here soon.
      </p>
    `;

  }

}


// ======================================================
// SUBMIT NEW WISH TO GOOGLE SHEET
// ======================================================

if (form) {

  form.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const nameInput =
        document.getElementById("wishName");

      const messageInput =
        document.getElementById("wishText");


      const name =
        nameInput
          ? nameInput.value.trim()
          : "";


      const message =
        messageInput
          ? messageInput.value.trim()
          : "";


      if (!name || !message) {

        alert(
          "Please enter your name and blessing."
        );

        return;

      }


      // Prevent multiple submissions

      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
          "SENDING...";
      }


      try {

        /*
          IMPORTANT:
          We send the data as URL-encoded form data.

          This matches your Apps Script:

          e.parameter.name
          e.parameter.message

          It also avoids unnecessary CORS
          preflight problems.
        */

        const body =
          new URLSearchParams();

        body.append(
          "name",
          name
        );

        body.append(
          "message",
          message
        );


        const response =
          await fetch(API_URL, {

            method: "POST",

            body: body

          });


        if (!response.ok) {

          throw new Error(
            "Unable to save blessing."
          );

        }


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.error ||
            result.message ||
            "Unable to save blessing."
          );

        }


        // Clear the form

        form.reset();


        // Show latest wishes again

        await loadWishes();


        alert(
          "Your blessing has been added ❤️"
        );


      } catch (error) {

        console.error(
          "Error submitting wish:",
          error
        );


        alert(
          "Something went wrong while sending your blessing. Please try again."
        );


      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            "SEND WISH";

        }

      }

    }
  );

}


// ======================================================
// INITIAL LOAD
// ======================================================

// Load all wishes from Google Sheet
// whenever someone opens the website.

loadWishes();
