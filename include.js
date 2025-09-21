document.addEventListener("DOMContentLoaded", function () {
  loadHeaderAndFooterAndSwiperContent();
  loadDetailsBox();
  loadEmailAddress();
  loadSwiper();
});
cleanPath();

function cleanPath() {
  const allowedPaths = [
    "/",
    "/Einzelpersonen",
    "/Einzelpersonen.html",
    "/Organisationen",
    "/Organisationen.html",
  ];

  const currentPath = window.location.pathname;

  if (!allowedPaths.includes(currentPath)) {
    window.history.replaceState({}, "", "/");
  }
}

function loadSwiper() {
  const swiper = new Swiper(".mySwiper", {
    loop: false,
    on: {
      slideChange: updateTabs,
    },
  });

  const tabs = document.querySelectorAll(".slider-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = parseInt(tab.dataset.slide);
      swiper.slideTo(index);
    });
  });

  function updateTabs() {
    tabs.forEach((tab, idx) => {
      if (idx === swiper.activeIndex) {
        // tab.classList.add("");
        tab.classList.add("border-secondary");
        tab.classList.add("border-2");
      } else {
        // tab.classList.remove("");
        tab.classList.remove("border-secondary");
        tab.classList.remove("border-2");
      }
    });
  }

  updateTabs(); // initial aktiv setzen
}

function loadDetailsBox() {
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
}

function loadEmailAddress() {
  const user = "kontakt";
  const domain = "annikamari.de";
  const mail = `${user}@${domain}`;
  const linktext = `${mail}`;

  document.querySelectorAll(".mailadresse").forEach((el) => {
    el.innerHTML = `<a href="mailto:${mail}">${linktext}</a>`;
  });
}

function loadHeaderAndFooterAndSwiperContent() {
  fetch("/pages/header.html")
    .then((res) => res.text())
    .then((data) => (document.getElementById("header").innerHTML = data));

  fetch("/pages/footer.html")
    .then((res) => res.text())
    .then((data) => (document.getElementById("footer").innerHTML = data));

  fetch("/pages/coaching_range.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("coaching_range").innerHTML = data;
      loadEmailAddress();
    });

  fetch("/pages/coaching_about.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("coaching_about").innerHTML = data;
      loadEmailAddress();
    });
}
