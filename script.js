const receptionTime = new Date("2026-11-07T17:30:00+05:30");

function updateCountdown() {
  const remaining = receptionTime.getTime() - Date.now();
  const note = document.getElementById("countdown-note");

  if (remaining <= 0) {
    document.getElementById("days").textContent = "♥";
    document.getElementById("hours").textContent = "♥";
    document.getElementById("minutes").textContent = "♥";
    note.textContent = remaining > -4 * 60 * 60 * 1000
      ? "The celebration is underway. We’re so glad you’re here."
      : "Thank you for celebrating with us.";
    return;
  }

  const totalMinutes = Math.floor(remaining / 60_000);
  document.getElementById("days").textContent = String(Math.floor(totalMinutes / 1440)).padStart(2, "0");
  document.getElementById("hours").textContent = String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, "0");
  document.getElementById("minutes").textContent = String(totalMinutes % 60).padStart(2, "0");
}

function downloadCalendarEvent() {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Arjun and Arya//Wedding Reception//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:arjun-and-arya-reception-20261107@invitation.local",
    "DTSTAMP:20261027T000000Z",
    "DTSTART:20261107T120000Z",
    "DTEND:20261107T160000Z",
    "SUMMARY:Wedding Reception — Arjun S Nair & M Arya Kurup",
    "LOCATION:NSS Karayogam, Madiyathara, Vaikom",
    "DESCRIPTION:Join us to celebrate the wedding reception of Arjun S Nair and M Arya Kurup.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "arjun-and-arya-wedding-reception.ics";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

updateCountdown();
window.setInterval(updateCountdown, 60_000);
document.getElementById("save-date").addEventListener("click", downloadCalendarEvent);

const galleryDialog = document.getElementById("gallery-dialog");
const galleryImage = document.getElementById("gallery-image");
const galleryCaption = document.getElementById("gallery-caption");
const galleryCounter = document.getElementById("gallery-counter");
const galleryThumbs = [...document.querySelectorAll(".gallery-thumb")];
const galleryItems = [
  {
    src: "img/invitation.jpeg",
    alt: "Original wedding reception invitation for Arjun S Nair and M Arya Kurup",
    caption: "The invitation",
  },
  {
    src: "img/Arjun.jpeg",
    alt: "Arjun and Arya smiling together in traditional wedding attire",
    caption: "Arjun & Arya",
  },
];
let galleryIndex = 0;

function showGalleryImage(index) {
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  galleryImage.src = item.src;
  galleryImage.alt = item.alt;
  galleryCaption.textContent = item.caption;
  galleryCounter.innerHTML = `${String(galleryIndex + 1).padStart(2, "0")} <i>/</i> ${String(galleryItems.length).padStart(2, "0")}`;
  galleryThumbs.forEach((thumb, thumbIndex) => {
    const active = thumbIndex === galleryIndex;
    thumb.classList.toggle("is-active", active);
    thumb.setAttribute("aria-pressed", String(active));
  });
}

document.getElementById("open-gallery").addEventListener("click", (event) => {
  event.preventDefault();
  showGalleryImage(0);
  galleryDialog.showModal();
  document.getElementById("gallery-close").focus();
});
document.getElementById("gallery-close").addEventListener("click", () => galleryDialog.close());
document.getElementById("gallery-previous").addEventListener("click", () => showGalleryImage(galleryIndex - 1));
document.getElementById("gallery-next").addEventListener("click", () => showGalleryImage(galleryIndex + 1));
galleryThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => showGalleryImage(Number(thumb.dataset.galleryIndex)));
});
galleryDialog.addEventListener("click", (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});
galleryDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section-heading, .detail-block, .calendar-button, .invitation-copy, .card-link, .site-footer > *",
  );
  document.querySelectorAll(".detail-block").forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${index * 100}ms`);
  });
  document.querySelectorAll(".site-footer > *").forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${index * 90}ms`);
  });
  revealTargets.forEach((element) => {
    if (!element.style.getPropertyValue("--reveal-delay")) {
      element.style.setProperty("--reveal-delay", "0ms");
    }
    element.classList.add("scroll-reveal");
  });
  document.body.classList.add("has-scroll-reveals");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -28px 0px" });

  revealTargets.forEach((element) => revealObserver.observe(element));
}
