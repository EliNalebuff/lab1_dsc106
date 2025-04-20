console.log("IT’S ALIVE!");

document.addEventListener("DOMContentLoaded", () => {
  const BASE_PATH =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "/"
      : "/lab1_dsc106/";

  const pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "resume/", title: "Resume" },
    { url: "contact/", title: "Contact" },
    { url: "https://github.com/elinalebuff", title: "GitHub" }
  ];

  // Inject nav
  const nav = document.createElement("nav");
  document.body.prepend(nav);

  for (let p of pages) {
    let url = p.url;
    if (!url.startsWith("http")) {
      url = BASE_PATH + url;
    }

    const a = document.createElement("a");
    a.href = url;
    a.textContent = p.title;

    // Highlight current page
    a.classList.toggle(
      "current",
      a.host === location.host && a.pathname === location.pathname
    );

    // External links open in new tab
    if (a.host !== location.host) {
      a.target = "_blank";
      a.rel = "noopener";
    }

    nav.append(a);
  }

  // Inject dark mode toggle
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

  const select = document.querySelector(".color-scheme select");

  // Restore saved preference
  if ("colorScheme" in localStorage) {
    const saved = localStorage.colorScheme;
    document.documentElement.style.setProperty("color-scheme", saved);
    select.value = saved;
  }

  // Save on change
  select.addEventListener("input", (event) => {
    const value = event.target.value;
    document.documentElement.style.setProperty("color-scheme", value);
    localStorage.colorScheme = value;
  });
});