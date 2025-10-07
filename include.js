const websiteUrl = "https://annikamari.de/#einzelpersonen";
const encodedWebsiteUrl = encodeURIComponent(websiteUrl);

document.addEventListener("DOMContentLoaded", function () {
  loadContent();
  loadImageBoxes();
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

/* -----------------------------------
   📱 Nur Swipe (kein Tap mehr)
----------------------------------- */
function addSwipeSupport(box, onFlip) {
  let startX = 0;
  let startY = 0;
  let isSwipe = false;

  box.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isSwipe = false;
  });

  box.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - startX);
    const dy = Math.abs(touch.clientY - startY);
    if (dx > 10 && dx > dy) {
      isSwipe = true;
    }
  });

  box.addEventListener("touchend", () => {
    if (isSwipe) {
      onFlip();
    }
  });
}

/* -----------------------------------
   🧠 Flip-Box Logik
----------------------------------- */
function loadImageBoxes() {
  documenfunction loadImageBoxes() {
  document.querySelectorAll(".flip-box").forEach((box) => {
    const images = JSON.parse(box.dataset.images || "[]");
    const inner = box.querySelector(".flip-inner");
    const back  = box.querySelector(".flip-back");

    let currentIndex = -1;
    let rotation = 0;
    let showingBack = false;
    let hoverInterval = null;

    inner.style.transform = "rotateY(0deg)";

    function flipToBackWithRandomImage() {
      if (!images.length) return;
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * images.length);
      } while (images.length > 1 && newIndex === currentIndex);
      currentIndex = newIndex;
      back.style.backgroundImage = `url("${images[currentIndex]}")`;
      rotation += 180;
      inner.style.transform = `rotateY(${rotation}deg)`;
      showingBack = true;
    }

    function flipToFront() {
      rotation += 180;
      inner.style.transform = `rotateY(${rotation}deg)`;
      showingBack = false;
    }

    function rotateAndChangeImage() {
      if (showingBack) {
        flipToFront();
      } else {
        flipToBackWithRandomImage();
      }
    }

    // Preload + Startflip
    Promise.all(images.map(src => new Promise(res => {
      const img = new Image();
      img.onload = img.onerror = res;
      img.src = src;
    }))).then(() => {
      setTimeout(rotateAndChangeImage, 1000);
    });

    // Hover Desktop
    box.addEventListener("mouseenter", () => {
      rotateAndChangeImage();
      hoverInterval = setInterval(rotateAndChangeImage, 900);
    });
    box.addEventListener("mouseleave", () => {
      clearInterval(hoverInterval);
      hoverInterval = null;
    });

    // Swipe Mobil
    let startX = 0, startY = 0, isSwipe = false;
    box.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      isSwipe = false;
    });
    box.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);
      if (dx > 10 && dx > dy) {
        isSwipe = true;
      }
    });
    box.addEventListener("touchend", () => {
      if (isSwipe) {
        rotateAndChangeImage();
      }
    });

    // 👇 Klicks auf Mobil komplett unterdrücken
    box.addEventListener("click", (e) => {
      if ("ontouchstart" in window) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
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
      tag: "12",
      monat: "10",
      jahr: "2025",
      start: "10:00",
      end: "12:30",
      ort: "Schmellerstraße 9, 80336 München",
    },
    {
      tag: "19",
      monat: "10",
      jahr: "2025",
      start: "16:00",
      end: "18:30",
      ort: "Schmellerstraße 9, 80336 München",
    },
    {
      tag: "26",
      monat: "10",
      jahr: "2025",
      start: "10:00",
      end: "12:30",
      ort: "Schmellerstraße 9, 80336 München",
    },
  ];

  function buildTable() {
    const table = document.createElement("div");

    termine.forEach((t) => {
      const grid = document.createElement("div");
      grid.className = "datumsTabelleGrid";

      // Spalte 1: Datum & Uhrzeit
      const td0 = document.createElement("div");
      td0.className = "item-a";
      td0.innerHTML = `${t.tag}.${t.monat}.${t.jahr} <br class="sm:hidden"> ${t.start}-${t.end}`;

      // Spalte 2: Kalender-Icons
      const td1 = document.createElement("div");
      td1.className = "item-b";
      td1.appendChild(getIconsWrapper(t));

      // Spalte 3: Mailto-Link
      const td2 = document.createElement("div");
      td2.className = "item-c";

      const mail = document.createElement("a");
      mail.href = `mailto:kontakt@annikamari.de?subject=Anmeldung%20Systemische%20Simulation%20${t.tag}.${t.monat}.${t.jahr}%20${t.start}-${t.end}`;
      mail.textContent = "Anmelden";
      const classList = ["mailto-btn", "mailto-btn-hover", "mailto-btn-active"];
      mail.classList.add(...classList);
      td2.appendChild(mail);

      grid.appendChild(td0);
      grid.appendChild(td1);
      grid.appendChild(td2);
      table.appendChild(grid);
    });

    return table;
  }

  const container = document.getElementById("datumsTabelle");
  container.appendChild(buildTable());
}

function getIconsWrapper(t) {
  const iconsWrapper = document.createElement("div");
  const dateStr = `${t.jahr}-${t.monat}-${t.tag}`;
  const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Systemische+Simulation&dates=${
    t.jahr
  }${t.monat}${t.tag}T${t.start.replace(":", "")}00/${t.jahr}${t.monat}${
    t.tag
  }T${t.end.replace(":", "")}00&location=${encodeURIComponent(
    t.ort
  )}&details=${encodedWebsiteUrl}`;
  const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=Systemische+Simulation&body=${encodedWebsiteUrl}&location=${encodeURIComponent(
    t.ort
  )}&startdt=${t.jahr}-${t.monat}-${t.tag}T${t.start}:00&enddt=${t.jahr}-${
    t.monat
  }-${t.tag}T${t.end}:00`;
  const appleLink = "https://www.icloud.com/calendar/";
  const icalData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Systemische Simulation
DTSTART:${t.jahr}${t.monat}${t.tag}T${t.start.replace(":", "")}00
DTEND:${t.jahr}${t.monat}${t.tag}T${t.end.replace(":", "")}00
LOCATION:${t.ort}
DESCRIPTION:${websiteUrl}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icalData], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const icalLink = document.createElement("a");
  icalLink.href = url;
  icalLink.download = `simulation_${t.jahr}-${t.monat}-${t.tag}.ics`;
  icalLink.className = "icon-btn";
  icalLink.setAttribute("data-tip", "iCal");
  icalLink.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
    <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z"></path>
  </svg>
`;

  function makeIcon(href, svg, label, downloadName) {
    const a = document.createElement("a");
    a.href = href;
    if (downloadName) {
      a.setAttribute("download", downloadName);
      a.removeAttribute("target");
    } else {
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.className = "icon-btn";
    a.setAttribute("data-tip", label);
    a.innerHTML = svg;
    return a;
  }

  const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" class="w-6 h-6"><path fill="currentColor" d="M16.365 1.43c0 1.14-.41 2.14-1.23 2.96-.82.82-1.75 1.27-2.79 1.23-.05-1.09.38-2.06 1.17-2.89.8-.82 1.76-1.31 2.85-1.3zM20.515 17.65c-.3.68-.67 1.33-1.11 1.93-.6.87-1.09 1.47-1.48 1.8-.59.55-1.23.84-1.91.86-.49 0-1.09-.14-1.8-.44-.71-.3-1.37-.44-1.98-.44-.65 0-1.34.15-2.08.44-.74.3-1.32.45-1.75.47-.65.03-1.32-.27-2.01-.9-.43-.38-.95-1.01-1.55-1.91-.67-1.01-1.22-2.18-1.64-3.51-.45-1.49-.68-2.93-.68-4.34 0-1.6.34-2.98 1.02-4.13.54-.91 1.26-1.62 2.16-2.14.9-.52 1.87-.8 2.9-.83.57 0 1.32.16 2.24.47.91.31 1.5.47 1.77.47.2 0 .83-.2 1.89-.59.99-.36 1.82-.51 2.51-.44 1.86.15 3.26.88 4.2 2.18-1.66 1.01-2.49 2.43-2.5 4.27 0 1.42.52 2.61 1.55 3.56.46.43.96.75 1.5.98-.12.34-.25.66-.4.97z"/></svg>`;
  const googleSvg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" class="w-6 h-6"><path fill="currentColor" d="M21.35 11.1H12v2.8h5.35c-.25 1.6-1.92 4.7-5.35 4.7-3.22 0-5.85-2.67-5.85-5.9s2.63-5.9 5.85-5.9c1.83 0 3.05.78 3.75 1.46l2.58-2.5C16.92 3.8 14.7 2.9 12 2.9 6.9 2.9 2.9 6.9 2.9 12s4 9.1 9.1 9.1c5.25 0 8.7-3.7 8.7-8.9 0-.6-.05-1.1-.15-1.6z"/></svg>`;
  const outlookSvg = `<svg class="w-6 h-6" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16.376 16.376" xml:space="preserve" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.032752"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style="fill:currentColor;" d="M16.376,6.059c0-0.3-0.215-0.544-0.478-0.544h-4.697v1.087h3.717L12.48,8.611l-1.279-1.048v1.379 l1.003,0.813c0.163,0.132,0.392,0.132,0.555-0.001l2.661-2.157v2.873h-4.219v1.087h4.697c0.263,0,0.478-0.243,0.478-0.544V6.541 c0-0.013-0.001-0.025-0.002-0.038c0.001-0.013,0.002-0.026,0.002-0.038C16.376,6.465,16.376,6.059,16.376,6.059z"></path> <path style="fill:currentColor;" d="M5.115,10.433c0.686,0,1.126-0.904,1.126-2.253c0-1.119-0.325-2.253-1.126-2.253 c-0.847,0-1.16,1.149-1.16,2.253C3.955,9.467,4.361,10.433,5.115,10.433z"></path> <path style="fill:currentColor;" d="M0,14.992l10.195,0.748V0.637L0,1.534V14.992z M5.162,4.272c1.741,0,2.902,1.578,2.902,3.831 c0,2.743-1.475,4-2.995,4c-1.66,0-2.937-1.44-2.937-3.861C2.133,5.819,3.34,4.272,5.162,4.272z"></path> </g> </g> </g></svg>`;
  const icalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
  <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z"/>`;

  iconsWrapper.appendChild(makeIcon(appleLink, appleSvg, "Apple"));
  iconsWrapper.appendChild(makeIcon(googleLink, googleSvg, "Google"));
  iconsWrapper.appendChild(makeIcon(outlookLink, outlookSvg, "Outlook"));

  iconsWrapper.appendChild(icalLink);
  return iconsWrapper;
}
