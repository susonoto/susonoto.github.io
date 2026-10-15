(() => {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const grid = $("#project-grid");
  const notice = $("#notice");
  const empty = $("#empty-state");
  const search = $("#search-input");
  const sort = $("#sort-select");
  const filterHost = $("#language-filters");
  let repos = [];
  let activeLanguage = "all";

  document.querySelectorAll("[data-owner-name]").forEach(el => el.textContent = cfg.ownerName || "Open Source Lab");
  document.querySelectorAll("[data-github-profile]").forEach(el => el.href = `https://github.com/${encodeURIComponent(cfg.githubUsername || "")}`.replace(/\/$/, "") || "https://github.com/");
  document.querySelectorAll("[data-github-issues]").forEach(el => el.href = `https://github.com/${encodeURIComponent(cfg.githubUsername || "")}?tab=repositories`);

  const configured = cfg.githubUsername && cfg.githubUsername !== "YOUR_GITHUB_USERNAME";
  if (!configured) {
    notice.innerHTML = `Almost ready — open <code>config.js</code> and replace <code>YOUR_GITHUB_USERNAME</code> with your GitHub username. Then refresh this page.`;
    $("#repo-count").textContent = "—";
    $("#star-count").textContent = "—";
    $("#language-count").textContent = "—";
    return;
  }

  function safe(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  }
  function dateLabel(value) {
    if (!value) return "Not updated yet";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : `Updated ${d.toLocaleDateString(undefined, {month:"short", day:"numeric", year:"numeric"})}`;
  }
  function languageColor(language) {
    const palette = {
      JavaScript:"#f1e05a", TypeScript:"#3178c6", Python:"#3572A5", HTML:"#e34c26",
      CSS:"#563d7c", Go:"#00ADD8", Rust:"#dea584", Java:"#b07219", Shell:"#89e051",
      "C++":"#f34b7d", C:"#555555", Kotlin:"#A97BFF", PHP:"#4F5D95", Ruby:"#701516"
    };
    return palette[language] || "#8b9ab5";
  }
  function titleCase(value) {
    return String(value || "")
      .replace(/[-_]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\\s+/g, " ")
      .trim()
      .replace(/\\b\\w/g, char => char.toUpperCase());
  }

  function fallbackDescription(repo) {
    // Optional hand-written descriptions in config.js take priority.
    const overrides = cfg.repoDescriptions || {};
    if (overrides[repo.name]) return overrides[repo.name];

    const topics = Array.isArray(repo.topics) ? repo.topics.filter(Boolean) : [];
    const language = repo.language;
    const readableName = titleCase(repo.name);
    if (topics.length && language) {
      return `${readableName} is a ${language} project focused on ${topics.slice(0, 3).join(", ")}. Explore the source, setup instructions, and examples in the repository.`;
    }
    if (topics.length) {
      return `${readableName} explores ${topics.slice(0, 3).join(", ")}. Explore the repository for its implementation, usage notes, and examples.`;
    }
    if (language) {
      return `${readableName} is a ${language} project by ${cfg.ownerName || cfg.githubUsername}. Browse the source code and README for implementation details, setup steps, and examples.`;
    }
    return `${readableName} is an open-source project by ${cfg.ownerName || cfg.githubUsername}. Explore the files and README to learn what it does and how to use it.`;
  }

  function repoCard(repo, index) {
    const topics = (repo.topics || []).slice(0, 3);
    const language = repo.language || "Mixed stack";
    const description = repo.description && repo.description.trim()
      ? repo.description.trim()
      : fallbackDescription(repo);
    const featured = (cfg.featuredRepos || []).includes(repo.name);
    return `
      <article class="project-card ${featured ? "featured-card" : ""}" style="--card-index:${index}">
        <div class="card-topline"><span class="repo-kind">${repo.fork ? "⑂ FORK" : "↗ REPOSITORY"}</span>${featured ? '<span class="featured-label">FEATURED</span>' : ""}</div>
        <h3><a href="${safe(repo.html_url)}" target="_blank" rel="noreferrer">${safe(repo.name)} <span class="external-arrow">↗</span></a></h3>
        <p class="card-description">${safe(description)}</p>
        <div class="topic-list">${topics.map(t => `<span>${safe(t)}</span>`).join("")}</div>
        <div class="card-meta">
          <span class="language"><i style="--lang-color:${languageColor(repo.language)}"></i>${safe(language)}</span>
          <span title="Stars">☆ ${repo.stargazers_count || 0}</span>
          <span title="Forks">⑂ ${repo.forks_count || 0}</span>
        </div>
        <div class="card-bottom"><span>${dateLabel(repo.updated_at)}</span><a href="${safe(repo.html_url)}" target="_blank" rel="noreferrer">Explore code <b>↗</b></a></div>
      </article>`;
  }
  function makeFilters() {
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
    filterHost.innerHTML = `<button class="filter ${activeLanguage === "all" ? "active" : ""}" data-language="all">All projects <span>${repos.length}</span></button>` +
      languages.map(lang => `<button class="filter ${activeLanguage === lang ? "active" : ""}" data-language="${safe(lang)}">${safe(lang)}</button>`).join("");
    filterHost.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
      activeLanguage = btn.dataset.language;
      makeFilters();
      render();
    }));
  }
  function render() {
    const q = search.value.trim().toLowerCase();
    let visible = repos.filter(r => {
      const text = [r.name, r.description, r.language, ...(r.topics || [])].join(" ").toLowerCase();
      return (activeLanguage === "all" || r.language === activeLanguage) && text.includes(q);
    });
    if (sort.value === "stars") visible.sort((a,b) => b.stargazers_count - a.stargazers_count);
    else if (sort.value === "name") visible.sort((a,b) => a.name.localeCompare(b.name));
    else visible.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
    const featured = cfg.featuredRepos || [];
    visible.sort((a,b) => Number(featured.includes(b.name)) - Number(featured.includes(a.name)));
    grid.innerHTML = visible.map(repoCard).join("");
    empty.hidden = visible.length !== 0;
    grid.hidden = visible.length === 0;
    notice.textContent = `Showing ${visible.length} of ${repos.length} public repositories`;
  }
  async function loadRepos() {
    try {
      const url = `https://api.github.com/users/${encodeURIComponent(cfg.githubUsername)}/repos?per_page=${Math.min(Math.max(Number(cfg.perPage) || 100, 1),100)}&sort=updated&type=owner`;
      const response = await fetch(url, {headers: {"Accept":"application/vnd.github+json"}});
      if (!response.ok) {
        if (response.status === 404) throw new Error("GitHub user not found. Check githubUsername in config.js.");
        if (response.status === 403) throw new Error("GitHub API rate limit reached. Wait a little and refresh, or add a server-side token in a secure deployment.");
        throw new Error(`GitHub API returned HTTP ${response.status}.`);
      }
      const data = await response.json();
      repos = data.filter(r => (cfg.includeForks || !r.fork) && (cfg.includeArchived || !r.archived) && !r.private);
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      const languages = new Set(repos.map(r => r.language).filter(Boolean));
      $("#repo-count").textContent = repos.length;
      $("#star-count").textContent = stars;
      $("#language-count").textContent = languages.size;
      $("#updated-date").textContent = "LIVE";
      makeFilters();
      render();
    } catch (err) {
      notice.innerHTML = `${safe(err.message)} <span class="notice-hint">The site still works once the username/API is corrected.</span>`;
      grid.innerHTML = "";
    }
  }
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  $("#clear-filters").addEventListener("click", () => {
    search.value = ""; activeLanguage = "all"; sort.value = "updated"; makeFilters(); render();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault(); search.focus();
    }
    if (e.key === "Escape" && document.activeElement === search) search.blur();
  });
  loadRepos();
})();
