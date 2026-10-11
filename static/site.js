// Behaviour shared by every page: the light/dark switch, copy buttons on code blocks,
// and highlighting the current section in a problem page's "On this page" list.
(function () {
  var root = document.documentElement;

  // ----- Light and dark theme -----
  // Without a saved choice the page follows the system setting (see style.css).
  // base.html applies a saved choice before the page is drawn.
  var toggle = document.getElementById("theme-toggle");

  function currentTheme() {
    var chosen = root.getAttribute("data-theme");
    if (chosen) return chosen;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function describeToggle() {
    var label = "Switch to " + (currentTheme() === "dark" ? "light" : "dark") + " theme";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("nulltrap.theme", next);
      } catch (error) {
        // Storage blocked: the choice lasts until the page is closed.
      }
      describeToggle();
    });
    describeToggle();
  }

  // ----- Copy buttons on code blocks -----

  // The older way of copying, for browsers that refuse the clipboard API.
  function copyWithSelection(text) {
    var holder = document.createElement("textarea");
    holder.value = text;
    holder.setAttribute("readonly", "");
    holder.style.position = "fixed";
    holder.style.opacity = "0";
    document.body.appendChild(holder);
    holder.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(holder);
    return copied;
  }

  function copyText(text) {
    if (!navigator.clipboard) return Promise.resolve(copyWithSelection(text));
    return navigator.clipboard.writeText(text).then(
      function () { return true; },
      function () { return copyWithSelection(text); }
    );
  }

  document.querySelectorAll(".prose .codehilite").forEach(function (block) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      copyText(block.querySelector("pre").textContent).then(function (copied) {
        button.textContent = copied ? "Copied" : "Could not copy";
        button.classList.add("is-done");
        window.setTimeout(function () {
          button.textContent = "Copy";
          button.classList.remove("is-done");
        }, 1600);
      });
    });
    block.appendChild(button);
  });

  // ----- "On this page": mark the section being read -----
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (links.length && "IntersectionObserver" in window) {
    var sections = links
      .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
      .filter(Boolean);

    var mark = function (id) {
      links.forEach(function (link) {
        var current = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-current", current);
        if (current) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    };

    // A section counts as "being read" once its heading has passed the top third of the screen.
    var observer = new IntersectionObserver(function () {
      var passed = sections.filter(function (section) {
        return section.getBoundingClientRect().top < window.innerHeight * 0.35;
      });
      mark((passed.length ? passed[passed.length - 1] : sections[0]).id);
    }, { rootMargin: "0px 0px -65% 0px", threshold: [0, 1] });
    sections.forEach(function (section) { observer.observe(section); });
    mark(sections[0].id);
  }
})();
