
(function () {
  "use strict";

  var STAGES = [
    {
      id: "childhood",
      label: "Childhood",
      age: "Before puberty",
      does: "Levels stay low in both boys and girls.",
      effect: "Little role. Growth is steady and guided mostly by genetics, nutrition, sleep, and health.",
      plate: "open",
      speed: 40,
      note: "About 80% of the variation in adult height comes from inherited DNA."
    },
    {
      id: "early-puberty",
      label: "Early to mid puberty",
      age: "Growth spurt",
      does: "Rises sharply and speeds up growth, partly by boosting growth hormone through estrogen made from it.",
      effect: "Faster growth. Even moderate levels are linked to about a 50% jump in growth speed compared with childhood.",
      plate: "open",
      speed: 95,
      note: "This is the stage where boys can gain several inches in a single year."
    },
    {
      id: "late-puberty",
      label: "Late puberty",
      age: "End of the spurt",
      does: "Part of it is converted into estrogen, which signals the growth plates to fuse.",
      effect: "Growth ends. Plates usually close around 15 to 17 in boys and 13 to 15 in girls.",
      plate: "closing",
      speed: 25,
      note: "The same pathway that sped growth up now brings it to a stop."
    },
    {
      id: "steroids",
      label: "Teen steroid use",
      age: "Risk",
      does: "Synthetic testosterone pushes skeletal maturation ahead of schedule.",
      effect: "Can mean shorter. Growth plates may close early, ending growth before a teen reaches his potential.",
      plate: "closing",
      speed: 60,
      note: "Inches lost to early plate closure can't be regained."
    },
    {
      id: "delayed",
      label: "Delayed puberty treatment",
      age: "Medical care",
      does: "A short, supervised, low-dose course starts the growth spurt sooner.",
      effect: "Same final height. In one study of 23 boys, treatment raised first-year growth to about 3.3 in versus 2.4 in, with no difference in predicted adult height.",
      plate: "open",
      speed: 75,
      note: "Treatment changes the timing of growth, not the final number."
    },
    {
      id: "adulthood",
      label: "Adulthood",
      age: "After growth plates close",
      does: "Supports muscle, bone density, and sex drive.",
      effect: "No height gain. Fused growth plates can't make bones longer at any dose.",
      plate: "closed",
      speed: 0,
      note: "Testosterone therapy treats diagnosed low testosterone. It doesn't add height."
    }
  ];

  var PLATE_CAPTIONS = {
    open: "Growth plates open",
    closing: "Growth plates closing",
    closed: "Growth plates closed"
  };

  var QUIZ = [
    {
      statement: "More testosterone means a taller adult.",
      answer: "myth",
      explain: "Testosterone affects how fast you grow during puberty, not where growth ends. Genetics sets most of final height."
    },
    {
      statement: "Boys make estrogen.",
      answer: "fact",
      explain: "An enzyme called aromatase converts part of a boy's testosterone into estradiol, which later closes the growth plates."
    },
    {
      statement: "Anabolic steroids can leave a teen shorter.",
      answer: "fact",
      explain: "They can cause premature skeletal maturation, closing growth plates before a teen finishes growing."
    },
    {
      statement: "Testosterone therapy can add height in adults.",
      answer: "myth",
      explain: "Once growth plates fuse into solid bone, bones can't get longer, so testosterone has no effect on adult height."
    },
    {
      statement: "Boys who start puberty late usually catch up in height.",
      answer: "fact",
      explain: "Late bloomers are often shorter for a few years, then largely catch up once their growth spurt arrives."
    }
  ];

  var tabsEl = document.getElementById("stage-tabs");
  var panel = document.getElementById("stage-panel");
  if (!tabsEl || !panel) return;

  var els = {
    age: document.getElementById("stage-age"),
    name: document.getElementById("stage-name"),
    does: document.getElementById("stage-does"),
    effect: document.getElementById("stage-effect"),
    note: document.getElementById("stage-note"),
    speed: document.getElementById("speed-fill"),
    caption: document.getElementById("plate-caption"),
    plates: [document.getElementById("plate-top"), document.getElementById("plate-bottom")]
  };

  var tabs = [];

  function selectStage(index, moveFocus) {
    var stage = STAGES[index];
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "tab-" + stage.id);
    els.age.textContent = stage.age;
    els.name.textContent = stage.label;
    els.does.textContent = stage.does;
    els.effect.textContent = stage.effect;
    els.note.textContent = stage.note;
    els.speed.style.width = stage.speed + "%";
    els.caption.textContent = PLATE_CAPTIONS[stage.plate];
    els.plates.forEach(function (p) { if (p) p.setAttribute("data-state", stage.plate); });
    if (moveFocus) tabs[index].focus();
  }

  STAGES.forEach(function (stage, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stage-tab";
    btn.id = "tab-" + stage.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-controls", "stage-panel");
    btn.textContent = stage.label;
    btn.addEventListener("click", function () { selectStage(i, false); });
    btn.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = (i + 1) % STAGES.length;
      if (e.key === "ArrowLeft") next = (i - 1 + STAGES.length) % STAGES.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = STAGES.length - 1;
      if (next !== null) {
        e.preventDefault();
        selectStage(next, true);
      }
    });
    tabsEl.appendChild(btn);
    tabs.push(btn);
  });

  selectStage(0, false);

  // Quiz
  var quizList = document.getElementById("quiz-list");
  var scoreEl = document.getElementById("quiz-score");
  var answered = 0;
  var correct = 0;

  function updateScore() {
    if (answered === QUIZ.length) {
      scoreEl.textContent = "You got " + correct + " of " + QUIZ.length + " right.";
    }
  }

  QUIZ.forEach(function (q, i) {
    var item = document.createElement("div");
    item.className = "quiz-item";

    var statement = document.createElement("p");
    statement.className = "quiz-statement";
    statement.id = "quiz-q-" + i;
    statement.textContent = (i + 1) + ". " + q.statement;

    var buttons = document.createElement("div");
    buttons.className = "quiz-buttons";
    buttons.setAttribute("role", "group");
    buttons.setAttribute("aria-labelledby", statement.id);

    var feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("aria-live", "polite");

    ["myth", "fact"].forEach(function (choice) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = choice === "myth" ? "Myth" : "Fact";
      b.addEventListener("click", function () {
        var isRight = choice === q.answer;
        answered += 1;
        if (isRight) correct += 1;
        Array.prototype.forEach.call(buttons.children, function (btn) { btn.disabled = true; });
        b.setAttribute("data-picked", "true");
        feedback.textContent = "";
        var verdict = document.createElement("strong");
        verdict.setAttribute("data-correct", isRight ? "true" : "false");
        verdict.textContent = (isRight ? "Correct. " : "Not quite. ") + "It's a " + q.answer + ". ";
        feedback.appendChild(verdict);
        feedback.appendChild(document.createTextNode(q.explain));
        updateScore();
      });
      buttons.appendChild(b);
    });

    item.appendChild(statement);
    item.appendChild(buttons);
    item.appendChild(feedback);
    quizList.appendChild(item);
  });
})();
