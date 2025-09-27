document.addEventListener("DOMContentLoaded", function () {
  loadContent();
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
    touchStartPreventDefault: false,
    allowTouchMove: true,
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
      console.log("herer");
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

function loadContent() {
  fetch("/impressum.html")
    .then((res) => res.text())
    .then((data) => {
      const element = document.getElementById("impressum");
      if (element) {
        element.innerHTML = data;
      }
      loadEmailAddress();
    });

  fetch("/pages/coaching_range.html")
    .then((res) => res.text())
    .then((data) => {
      const element = document.getElementById("coaching_range");
      if (element) {
        element.innerHTML = data;
      }
      loadEmailAddress();
      loadTable();
    });

  fetch("/pages/coaching_about.html")
    .then((res) => res.text())
    .then((data) => {
      const element = document.getElementById("coaching_about");
      if (element) {
        element.innerHTML = data;
      }
      loadEmailAddress();
    });

  fetch("/Organisationen.html")
    .then((res) => res.text())
    .then((data) => {
      const element = document.getElementById("organisationen");
      if (element) {
        element.innerHTML = data;
      }
      loadEmailAddress();
    });
}

function loadTable() {
  // feste Datenpunkte
  const termine = [
    {
      tag: "05",
      monat: "10",
      jahr: "2025",
      start: "10:00",
      end: "12:30",
      ort: "Schmellerstraße 9, 80336 München",
    },
    {
      tag: "12",
      monat: "10",
      jahr: "2025",
      start: "16:00",
      end: "18:30",
      ort: "Schmellerstraße 9, 80336 München",
    },
  ];

  function buildTable() {
    const table = document.createElement("table");

    termine.forEach((t) => {
      const tr = document.createElement("tr");

      // Spalte 1: Mailto-Link
      const td1 = document.createElement("td");
      const mail = document.createElement("a");
      mail.href = `mailto:kontakt@annikamari.de?subject=Anmeldung%20Systemische%20Simulation%20${t.tag}.${t.monat}.${t.jahr}`;
      mail.textContent = "Anmelden";
      td1.appendChild(mail);

      // Spalte 2: Add-to-calendar-button
      const td2 = document.createElement("td");
      td2.innerHTML = `
      <add-to-calendar-button
        name="Systemische Simulation"
        options="'Apple','Google'"
        location="${t.ort}"
        startDate="${t.jahr}-${t.monat}-${t.tag}"
        endDate="${t.jahr}-${t.monat}-${t.tag}"
        startTime="${t.start}"
        endTime="${t.end}"
        timeZone="Europe/Berlin"
      ></add-to-calendar-button>
    `;

      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);
    });

    return table;
  }
  const container = document.getElementById("datumsTabelle");
  container.appendChild(buildTable());
}
