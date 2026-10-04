// Problem list controls: track tabs, search, sort, filters, solved meter, random pick.
// Every card is already in the HTML; this only hides and reorders them. The current
// choices are kept in the URL so a filtered list can be shared.
// Loaded after progress.js, which sets data-status on each card.
(function () {
  var form = document.getElementById("filters");
  var list = document.getElementById("problem-list");
  var cards = Array.prototype.slice.call(list.querySelectorAll(".problem-card"));
  var tabs = Array.prototype.slice.call(form.querySelectorAll(".topic-tab"));
  var count = document.getElementById("filter-count");
  var noResults = document.getElementById("no-results");
  var filterDot = document.getElementById("filter-dot");

  var filterNames = ["track", "difficulty", "trap", "status"];  // each matches a data- attribute
  var allNames = filterNames.concat(["q", "sort"]);
  var difficultyRank = { easy: 1, medium: 2, hard: 3 };

  cards.forEach(function (card) {
    card.searchText = card.textContent.toLowerCase();
  });

  // Start from the URL.
  var params = new URLSearchParams(window.location.search);
  allNames.forEach(function (name) {
    var wanted = params.get(name);
    var field = form.elements[name];
    if (wanted === null) return;
    if (field.options) {
      var known = Array.prototype.some.call(field.options, function (option) { return option.value === wanted; });
      if (known) field.value = wanted;
    } else if (name === "track") {
      if (tabs.some(function (tab) { return tab.dataset.track === wanted; })) field.value = wanted;
    } else {
      field.value = wanted;
    }
  });

  function matches(card, name, wanted) {
    // A card can carry several values for one filter (a problem can have two traps).
    return (card.dataset[name] || "").split(" ").indexOf(wanted) !== -1;
  }

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
    var shown = 0;
    cards.forEach(function (card) {
      var match = filterNames.every(function (name) {
        var wanted = form.elements[name].value;
        return !wanted || matches(card, name, wanted);
      }) && words.every(function (word) { return card.searchText.indexOf(word) !== -1; });
      card.hidden = !match;
      if (match) shown += 1;
    });

    tabs.forEach(function (tab) {
      var active = tab.dataset.track === form.elements.track.value;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", active ? "true" : "false");
    });
    filterDot.hidden = !["difficulty", "trap", "status"].some(function (name) { return form.elements[name].value; });
    count.textContent = shown === cards.length ? "" : "Showing " + shown + " of " + cards.length + " problems";
    noResults.hidden = shown > 0;
    sortCards();

    var query = new URLSearchParams();
    allNames.forEach(function (name) {
      if (form.elements[name].value) query.set(name, form.elements[name].value);
    });
    var text = query.toString();
    history.replaceState(null, "", text ? "?" + text : window.location.pathname);
  }

  // Solved meter: counts the cards that progress.js marked as solved.
  var solved = cards.filter(function (card) { return card.dataset.status === "solved"; }).length;
  document.getElementById("solved-count").textContent = solved + "/" + cards.length + " Solved";
  var percent = cards.length ? Math.round((solved / cards.length) * 100) : 0;
  document.getElementById("solved-ring").setAttribute("stroke-dasharray", percent + " 100");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      form.elements.track.value = tab.dataset.track;
      apply();
    });
  });
  form.addEventListener("change", apply);
  form.elements.q.addEventListener("input", apply);
  form.addEventListener("submit", function (event) { event.preventDefault(); });

  document.getElementById("clear-filters").addEventListener("click", function () {
    ["difficulty", "trap", "status"].forEach(function (name) { form.elements[name].value = ""; });
    apply();
  });

  // Random pick: among the problems currently shown, preferring ones not solved yet.
  document.getElementById("random-problem").addEventListener("click", function () {
    var visible = cards.filter(function (card) { return !card.hidden; });
    var open = visible.filter(function (card) { return card.dataset.status !== "solved"; });
    var pool = open.length ? open : visible;
    if (!pool.length) return;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = pick.querySelector("h3 a").href;
  });

  apply();
})();
