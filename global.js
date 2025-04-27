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

    a.classList.toggle(
      "current",
      a.host === location.host && a.pathname === location.pathname
    );

    if (a.host !== location.host) {
      a.target = "_blank";
      a.rel = "noopener";
    }

    nav.append(a);
  }

  // ✅ Insert theme toggle *after* DOM is ready
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

  // Restore preference
  if ("colorScheme" in localStorage) {
    const saved = localStorage.colorScheme;
    document.documentElement.style.setProperty("color-scheme", saved);
    select.value = saved;
  }

  // Listen for changes
  select.addEventListener("input", (event) => {
    const value = event.target.value;
    document.documentElement.style.setProperty("color-scheme", value);
    localStorage.colorScheme = value;
  });
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error('Container element not found.');
    return;
  }

  containerElement.innerHTML = '';

  projects.forEach(project => {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}