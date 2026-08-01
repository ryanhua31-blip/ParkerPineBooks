const pages = [
  {
    tag: "Garage Plan",
    title: "Johnny Had a Big Idea",
    text: "Johnny loved space books, red crayons, and asking giant questions. One morning he pointed to Mars and said, \"That is too far away to just wait around.\" So he marched into the garage with a notebook and a grin.",
    task: "Tap the three tools Johnny needs.",
    type: "tools",
  },
  {
    tag: "Rocket Parts",
    title: "A Rocket From Useful Stuff",
    text: "Johnny found a shiny trash can, two skateboard wheels, a camping lantern, and Dad's biggest mixing bowl. Parker and Pine would have called it imagination. Johnny called it Rocket Number One.",
    task: "Tap each loose part to pop it onto the rocket.",
    type: "build",
  },
  {
    tag: "Fuel Time",
    title: "The Super Fizz Fuel",
    text: "For fuel, Johnny mixed lemonade bubbles, bicycle-pump air, and one brave spoonful of birthday sprinkles. The rocket hummed like a sleepy refrigerator with a secret.",
    task: "Press the pump until the fuel meter fills.",
    type: "fuel",
  },
  {
    tag: "Countdown",
    title: "Everybody Counted Backward",
    text: "Mom packed a sandwich. The dog wore goggles. Johnny buckled in and held the red launch button. The whole garage seemed to hold its breath.",
    task: "Press 5, 4, 3, 2, 1 to launch.",
    type: "countdown",
  },
  {
    tag: "Star Hop",
    title: "Up Past the Chimney",
    text: "Rocket Number One zoomed past the roof, the kite, and a very surprised cloud. Stars winked awake as Johnny steered by sandwich crumbs and courage.",
    task: "Catch five stars to help Johnny steer.",
    type: "stars",
  },
  {
    tag: "Space Map",
    title: "The Planet Puzzle",
    text: "Space was bigger than Johnny had guessed. He saw the Moon, a blue Earth marble, and Mars glowing like a tomato with mountains.",
    task: "Tap the red planet to pick Mars.",
    type: "planets",
  },
  {
    tag: "Mars Landing",
    title: "Bump, Bounce, Hooray",
    text: "The rocket bounced once, twice, and then sat proudly on rusty red dust. Johnny stepped outside and planted a little flag for every kid with a big idea.",
    task: "Raise the Parker & Pine flag.",
    type: "flag",
  },
  {
    tag: "Story Shelf",
    title: "Back Before Dinner",
    text: "Johnny flew home with a pocket full of Mars pebbles and a notebook full of better plans. He still wanted NASA to visit, but now he knew waiting was not the only way to dream.",
    task: "Tap the book to start again.",
    type: "finish",
  },
];

const pageNumber = document.querySelector("#pageNumber");
const pageTotal = document.querySelector("#pageTotal");
const pageTag = document.querySelector("#pageTag");
const pageTitle = document.querySelector("#pageTitle");
const pageText = document.querySelector("#pageText");
const taskLine = document.querySelector("#taskLine");
const popArea = document.querySelector("#popArea");
const book = document.querySelector(".book");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const dots = document.querySelector("#dots");

let currentPage = 0;
let progress = 0;
let isTurning = false;

pageTotal.textContent = pages.length;

pages.forEach((page, index) => {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to page ${index + 1}: ${page.title}`);
  dot.addEventListener("click", () => showPage(index));
  dots.appendChild(dot);
});

prevButton.addEventListener("click", () => showPage(currentPage - 1));
nextButton.addEventListener("click", () => showPage(currentPage + 1));

function showPage(index, animate = true) {
  const targetPage = Math.max(0, Math.min(index, pages.length - 1));
  if (targetPage === currentPage || isTurning) return;

  const direction = targetPage > currentPage ? "next" : "prev";
  if (!animate) {
    renderPage(targetPage);
    return;
  }

  isTurning = true;
  setNavigationLocked(true);
  book.classList.add(`turning-out-${direction}`);

  window.setTimeout(() => {
    renderPage(targetPage);
    book.classList.remove(`turning-out-${direction}`);
    book.classList.add(`turning-in-${direction}`);

    window.setTimeout(() => {
      book.classList.remove(`turning-in-${direction}`);
      isTurning = false;
      updateNavigation();
    }, 430);
  }, 230);
}

function renderPage(index) {
  currentPage = index;
  progress = 0;
  const page = pages[currentPage];

  pageNumber.textContent = currentPage + 1;
  pageTag.textContent = page.tag;
  pageTitle.textContent = page.title;
  pageText.textContent = page.text;
  taskLine.textContent = page.task;

  document.querySelectorAll(".dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentPage);
  });

  popArea.className = "pop-area";
  popArea.replaceChildren();
  renderInteraction(page.type);
  updateNavigation();
}

function updateNavigation() {
  prevButton.disabled = isTurning || currentPage === 0;
  nextButton.disabled = isTurning || currentPage === pages.length - 1;
  nextButton.textContent = currentPage === pages.length - 1 ? "The End" : "Next";

  document.querySelectorAll(".dot").forEach((dot) => {
    dot.disabled = isTurning;
  });
}

function setNavigationLocked(locked) {
  prevButton.disabled = locked;
  nextButton.disabled = locked;

  document.querySelectorAll(".dot").forEach((dot) => {
    dot.disabled = locked;
  });
}

function makeGroundScene() {
  const ground = document.createElement("div");
  ground.className = "ground";
  popArea.appendChild(ground);
}

function makeGarage() {
  makeGroundScene();
  const garage = document.createElement("div");
  garage.className = "garage";
  garage.innerHTML = '<div class="garage-door"></div>';
  popArea.appendChild(garage);
}

function makeToy(label, x, y, action) {
  const toy = document.createElement("button");
  toy.className = "toy";
  toy.type = "button";
  toy.textContent = label;
  toy.style.left = x;
  toy.style.top = y;
  toy.addEventListener("click", action);
  popArea.appendChild(toy);
  return toy;
}

function makeRocket() {
  const rocket = document.createElement("div");
  rocket.className = "rocket";
  rocket.innerHTML = `
    <div class="rocket-nose"></div>
    <div class="rocket-body"></div>
    <div class="fin left"></div>
    <div class="fin right"></div>
    <div class="flame"></div>
  `;
  popArea.appendChild(rocket);
  return rocket;
}

function celebrate(message) {
  const oldBubble = popArea.querySelector(".bubble");
  if (oldBubble) oldBubble.remove();

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = message;
  bubble.style.left = "24px";
  bubble.style.top = "24px";
  popArea.appendChild(bubble);
}

function renderInteraction(type) {
  if (type === "tools") renderTools();
  if (type === "build") renderBuild();
  if (type === "fuel") renderFuel();
  if (type === "countdown") renderCountdown();
  if (type === "stars") renderStars();
  if (type === "planets") renderPlanets();
  if (type === "flag") renderFlag();
  if (type === "finish") renderFinish();
}

function renderTools() {
  makeGarage();
  ["Wrench", "Tape", "Crayon"].forEach((label, index) => {
    const positions = [
      ["12%", "70%"],
      ["68%", "68%"],
      ["45%", "18%"],
    ];
    makeToy(label, positions[index][0], positions[index][1], (event) => {
      if (event.currentTarget.classList.contains("done")) return;
      event.currentTarget.classList.add("done");
      progress += 1;
      if (progress === 3) celebrate("Blueprint ready!");
    });
  });
}

function renderBuild() {
  makeGarage();
  makeRocket();
  const parts = [
    ["Nose", "10%", "22%"],
    ["Window", "75%", "24%"],
    ["Fins", "11%", "66%"],
    ["Flame", "72%", "66%"],
  ];
  parts.forEach(([label, x, y]) => {
    makeToy(label, x, y, (event) => {
      if (event.currentTarget.classList.contains("done")) return;
      event.currentTarget.classList.add("done");
      event.currentTarget.classList.add("placed");
      progress += 1;
      if (progress === parts.length) celebrate("Rocket Number One!");
    });
  });
}

function renderFuel() {
  makeGroundScene();
  const rocket = makeRocket();
  const meter = document.createElement("div");
  meter.className = "meter";
  meter.innerHTML = '<div class="meter-fill"></div>';
  popArea.appendChild(meter);

  const pump = document.createElement("button");
  pump.className = "button-big";
  pump.type = "button";
  pump.textContent = "Pump!";
  pump.addEventListener("click", () => {
    progress = Math.min(progress + 20, 100);
    meter.querySelector(".meter-fill").style.setProperty("--fill", `${progress}%`);
    rocket.style.setProperty("--flame", `${0.25 + progress / 130}`);
    rocket.classList.toggle("lift", progress === 100);
    if (progress === 100) celebrate("Fizz fuel full!");
  });
  popArea.appendChild(pump);
}

function renderCountdown() {
  makeGarage();
  const rocket = makeRocket();
  let nextNumber = 5;
  const button = document.createElement("button");
  button.className = "button-big";
  button.type = "button";
  button.textContent = "5";
  button.addEventListener("click", () => {
    if (nextNumber > 1) {
      nextNumber -= 1;
      button.textContent = String(nextNumber);
      celebrate(`${nextNumber}...`);
      return;
    }
    button.textContent = "Blastoff!";
    rocket.classList.add("lift");
    celebrate("Blastoff!");
  });
  popArea.appendChild(button);
}

function renderStars() {
  popArea.classList.add("space");
  const rocket = makeRocket();
  rocket.style.bottom = "6%";
  rocket.style.transform = "translateX(-50%) rotate(18deg)";

  for (let index = 0; index < 9; index += 1) {
    const star = document.createElement("button");
    star.className = "star";
    star.type = "button";
    star.setAttribute("aria-label", "Catch a star");
    star.style.left = `${10 + ((index * 23) % 75)}%`;
    star.style.top = `${9 + ((index * 17) % 58)}%`;
    star.addEventListener("click", () => {
      if (star.classList.contains("done")) return;
      star.classList.add("done");
      progress += 1;
      if (progress === 5) celebrate("Star map glowing!");
    });
    popArea.appendChild(star);
  }
}

function renderPlanets() {
  popArea.classList.add("space");
  const planets = [
    ["Moon", "#d8dde7", "16%", "28%", "82px", false],
    ["Earth", "#4aa3ff", "43%", "52%", "118px", false],
    ["Mars", "#e86f3f", "69%", "24%", "104px", true],
  ];

  planets.forEach(([label, color, left, top, size, isMars]) => {
    const planet = document.createElement("button");
    planet.className = "planet";
    planet.type = "button";
    planet.textContent = label;
    planet.style.left = left;
    planet.style.top = top;
    planet.style.width = size;
    planet.style.height = size;
    planet.style.background = color;
    planet.style.fontWeight = "900";
    planet.style.color = isMars ? "white" : "#273044";
    planet.addEventListener("click", () => {
      planet.classList.add("spin");
      celebrate(isMars ? "Mars found!" : "Nice planet, but keep looking.");
    });
    popArea.appendChild(planet);
  });
}

function renderFlag() {
  popArea.classList.add("mars");
  const mars = document.createElement("div");
  mars.className = "mars-ball";
  popArea.appendChild(mars);

  const flag = document.createElement("button");
  flag.className = "flag";
  flag.type = "button";
  flag.setAttribute("aria-label", "Raise the Parker and Pine flag");
  flag.addEventListener("click", () => {
    flag.classList.add("raised");
    celebrate("Flag on Mars!");
  });
  popArea.appendChild(flag);
}

function renderFinish() {
  makeGroundScene();
  const card = document.createElement("button");
  card.className = "home-card";
  card.type = "button";
  card.innerHTML = "<h3>Parker & Pine Books</h3><p>Johnny's first space story is finished.</p><strong>Read again</strong>";
  card.addEventListener("click", () => showPage(0));
  popArea.appendChild(card);
}

renderPage(0);
