// Problem list controls: trap tiles, track and difficulty switches, search, sort,
// the progress strip and the random pick.
// Every card is already in the HTML; this only hides and reorders them. The current
// choices are kept in the URL so a filtered list can be shared.
// Loaded after progress.js, which sets data-status on each card.
(function () {
  var form = document.getElementById("filters");
  var list = document.getElementById("problem-list");
  var cards = Array.prototype.slice.call(list.querySelectorAll(".problem-card"));
  var count = document.getElementById("filter-count");
  var noResults = document.getElementById("no-results");

  // Each of these is a hidden field that a group of buttons switches.
  var switches = {
    trap: Array.prototype.slice.call(form.querySelectorAll(".trap-tile")),
    track: Array.prototype.slice.call(form.querySelectorAll(".track-switch button")),
    difficulty: Array.prototype.slice.call(form.querySelectorAll(".difficulty-switch button")),
  };
  var difficultyRank = { easy: 1, medium: 2, hard: 3 };

  cards.forEach(function (card) {
    card.searchText = card.textContent.toLowerCase();
  });

  function isSolved(card) {
    return card.dataset.status === "solved";
  }

  function hasValue(card, name, wanted) {
    // A card can carry several values for one filter (a problem can have two traps).
    return (card.dataset[name] || "").split(" ").indexOf(wanted) !== -1;
  }

  // Start from the URL.
  var params = new URLSearchParams(window.location.search);
  Object.keys(switches).forEach(function (name) {
    var wanted = params.get(name);
    if (switches[name].some(function (button) { return button.dataset[name] === wanted; })) {
      form.elements[name].value = wanted;
    }
  });
  form.elements.q.value = params.get("q") || "";
  form.elements.status.checked = params.get("status") === "unsolved";
  if (["difficulty", "title"].indexOf(params.get("sort")) !== -1) form.elements.sort.value = params.get("sort");

  function sortCards() {
    var by = form.elements.sort.value;
    var ordered = cards.slice().sort(function (a, b) {
      if (by === "difficulty") {
        var gap = difficultyRank[a.dataset.difficulty] - difficultyRank[b.dataset.difficulty];
        if (gap) return gap;
      } else if (by === "title") {
        return a.dataset.title.localeCompare(b.dataset.title);
      }
      return Number(a.dataset.number) - Number(b.dataset.number);
    });
    ordered.forEach(function (card) { list.appendChild(card); });
  }

  function apply() {
    var words = form.elements.q.value.toLowerCase().split(/\s+/).filter(Boolean);
    var hideSolved = form.elements.status.checked;
    var shown = 0;
    cards.forEach(function (card) {
      var match = Object.keys(switches).every(function (name) {
        var wanted = form.elements[name].value;
        return !wanted || hasValue(card, name, wanted);
      });
      match = match && !(hideSolved && isSolved(card));
      match = match && words.every(function (word) { return card.searchText.indexOf(word) !== -1; });
      card.hidden = !match;
      if (match) shown += 1;
    });

    Object.keys(switches).forEach(function (name) {
      switches[name].forEach(function (button) {
        var active = button.dataset[name] === form.elements[name].value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    });
    count.textContent = shown === cards.length ? "" : "Showing " + shown + " of " + cards.length + " problems";
    noResults.hidden = shown > 0;
    sortCards();

    var query = new URLSearchParams();
    ["trap", "track", "difficulty", "q", "sort"].forEach(function (name) {
      if (form.elements[name].value) query.set(name, form.elements[name].value);
    });
    if (hideSolved) query.set("status", "unsolved");
    var text = query.toString();
    history.replaceState(null, "", text ? "?" + text : window.location.pathname);
  }

  // Progress: the strip of blocks at the top and the solved count on each trap tile.
  var solvedSlugs = cards.filter(isSolved).map(function (card) { return card.dataset.slug; });
  document.getElementById("solved-count").textContent = solvedSlugs.length + " of " + cards.length + " solved";
  document.querySelectorAll("#pipeline .segment").forEach(function (segment) {
    segment.classList.toggle("is-solved", solvedSlugs.indexOf(segment.dataset.slug) !== -1);
  });
  switches.trap.forEach(function (tile) {
    var inTrap = cards.filter(function (card) { return hasValue(card, "trap", tile.dataset.trap); });
    tile.querySelector(".trap-progress").textContent = inTrap.filter(isSolved).length + "/" + inTrap.length + " solved";
  });

  // Clicking the active button of a group switches that filter off again.
  Object.keys(switches).forEach(function (name) {
    switches[name].forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.dataset[name];
        form.elements[name].value = form.elements[name].value === value ? "" : value;
        apply();
      });
    });
  });
  form.addEventListener("change", apply);
  form.elements.q.addEventListener("input", apply);
  form.addEventListener("submit", function (event) { event.preventDefault(); });

  document.getElementById("clear-filters").addEventListener("click", function () {
    ["trap", "track", "difficulty", "q"].forEach(function (name) { form.elements[name].value = ""; });
    form.elements.status.checked = false;
    apply();
  });

  // Random pick: among the problems currently shown, preferring ones not solved yet.
  document.getElementById("random-problem").addEventListener("click", function () {
    var visible = cards.filter(function (card) { return !card.hidden; });
    var open = visible.filter(function (card) { return !isSolved(card); });
    var pool = open.length ? open : visible;
    if (!pool.length) return;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = pick.querySelector("h3 a").href;
  });

  apply();
})();
