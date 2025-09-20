
document.addEventListener("DOMContentLoaded", function () {
  fetch("/pages/header.html")
    .then(res => res.text())
    .then(data => document.getElementById("header").innerHTML = data);

  fetch("/pages/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);

      fetch("/pages/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);
});

document.querySelectorAll(".details").forEach((details) => {
  const summary = details.querySelector("summary");
  const content = details.querySelector(".details-content");

  // Anfangszustand
  if (details.open) content.classList.add("open");

  summary.addEventListener("click", (e) => {
    e.preventDefault(); // Verhindert das sofortige Öffnen/Schließen

    if (details.open) {
      // Schließen: zuerst Animation auslösen
      content.classList.remove("open");

      // Dann Verzögerung fürs Zuklappen
      setTimeout(() => {
        details.removeAttribute("open");
      }, 300); // Dauer der CSS transition
    } else {
      // Öffnen
      details.setAttribute("open", "true");
      requestAnimationFrame(() => {
        content.classList.add("open");
      });
    }
  });
});

  const user = "kontakt";
  const domain = "annikamari.de";
  const mail = `${user}@${domain}`;
  const linktext = `${mail}`;

  document.querySelectorAll(".mailadresse").forEach(el => {
    el.innerHTML = `<a href="mailto:${mail}">${linktext}</a>`;
  });

  // Liste der erlaubten Pfade – passe bei Bedarf an
  const allowedPaths = ['/', '/about', '/kontakt']; // usw.

  const currentPath = window.location.pathname;

  if (!allowedPaths.includes(currentPath)) {
    window.history.replaceState({}, '', '/');
  }


document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".mySwiper", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

});


