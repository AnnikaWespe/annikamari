document.addEventListener("DOMContentLoaded", function () {
  fetch("/pages/header.html")
    .then(res => res.text())
    .then(data => document.getElementById("header").innerHTML = data);

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