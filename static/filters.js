// Problem list filters. Every card is already in the HTML; this only hides the ones
// that do not match. The chosen filters are kept in the URL so a filtered list can be shared.
// Loaded after progress.js, which sets data-status on each card.
(function () {
  var form = document.getElementById("filters");
  var cards = document.querySelectorAll("#problem-list .problem-card");
  var count = document.getElementById("filter-count");
  var noResults = document.getElementById("no-results");
  var names = ["track", "difficulty", "trap", "status"];

  var params = new URLSearchParams(window.location.search);
  names.forEach(function (name) {
    var wanted = params.get(name);
    var select = form.elements[name];
    var known = Array.prototype.some.call(select.options, function (option) {
      return option.value === wanted;
    });
    if (known) select.value = wanted;
  });

  function matches(card, name, wanted) {
    // A card can carry several values for one filter (a problem can have two traps).
    return (card.dataset[name] || "").split(" ").indexOf(wanted) !== -1;
  }

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var match = names.every(function (name) {
        var wanted = form.elements[name].value;
        return !wanted || matches(card, name, wanted);
      });
      card.hidden = !match;
      if (match) shown += 1;
    });
    count.textContent = shown + " of " + cards.length + " problems";
    noResults.hidden = shown > 0;
  }

  form.addEventListener("change", function () {
    var query = new URLSearchParams();
    names.forEach(function (name) {
      if (form.elements[name].value) query.set(name, form.elements[name].value);
    });
    var text = query.toString();
    history.replaceState(null, "", text ? "?" + text : window.location.pathname);
    apply();
  });
  form.addEventListener("submit", function (event) { event.preventDefault(); });

  apply();
})();
