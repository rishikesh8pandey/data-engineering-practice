// Remembers which problems the visitor has marked as solved. The list lives in this
// browser's localStorage only: there are no accounts, and nothing is sent anywhere.
(function () {
  var KEY = "nulltrap.solved";

  function read() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];  // storage blocked or empty: behave as if nothing is solved
    }
  }

  function write(slugs) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch (error) {
      // Storage blocked (for example in a private window). The page still works.
    }
  }

  var solved = read();

  // Problem cards, on the home page and the problem list.
  var cards = document.querySelectorAll(".problem-card");
  cards.forEach(function (card) {
    var done = solved.indexOf(card.dataset.slug) !== -1;
    card.dataset.status = done ? "solved" : "unsolved";
    if (done) {
      var badge = document.createElement("span");
      badge.className = "badge solved";
      badge.textContent = "✓ Solved";
      card.querySelector(".badges").prepend(badge);
    }
  });

  // The "Mark as solved" button on a problem page.
  var button = document.getElementById("mark-solved");
  if (button) {
    var slug = button.dataset.slug;
    var render = function () {
      var done = solved.indexOf(slug) !== -1;
      button.textContent = done ? "✓ Solved (click to undo)" : "Mark as solved";
      button.classList.toggle("is-solved", done);
      button.setAttribute("aria-pressed", done ? "true" : "false");
    };
    button.addEventListener("click", function () {
      var position = solved.indexOf(slug);
      if (position === -1) solved.push(slug); else solved.splice(position, 1);
      write(solved);
      render();
    });
    button.hidden = false;
    render();
  }
})();
