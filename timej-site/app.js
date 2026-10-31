(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal only once; no animation work continues after an element enters view.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // Mobile navigation.
  const menuButton = $(".menu-toggle");
  const nav = $(".nav-links");
  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-links a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  // Local live clock, updated once per second.
  const pad = n => String(n).padStart(2, "0");
  const updateHeroClock = () => {
    const now = new Date();
    if ($("#hours")) $("#hours").textContent = pad(now.getHours());
    if ($("#minutes")) $("#minutes").textContent = pad(now.getMinutes());
    if ($("#seconds")) $("#seconds").textContent = pad(now.getSeconds()) + " SEC";
    if ($("#date-label")) $("#date-label").textContent = new Intl.DateTimeFormat(undefined, { weekday:"short", day:"2-digit", month:"short" }).format(now).toUpperCase();
  };
  updateHeroClock();
  window.setInterval(updateHeroClock, 1000);
  $("#year").textContent = new Date().getFullYear();

  // Compact interactive demo state machine.
  const tabs = $$(".demo-tab");
  const title = $("#demo-title"), display = $("#demo-display"), controls = $("#demo-controls"), note = $("#demo-note");
  let mode = "clock", running = false, elapsed = 0, startedAt = 0, interval = null, timerTarget = 0, focusPhase = "FOCUS";
  const clockNow = () => new Date().toLocaleTimeString([], { hour12:false });
  const format = ms => {
    const total = Math.max(0, Math.floor(ms / 1000));
    return [Math.floor(total / 3600), Math.floor(total % 3600 / 60), total % 60].map(pad).join(":");
  };
  const currentElapsed = () => elapsed + (running ? performance.now() - startedAt : 0);
  const paint = () => {
    if (mode === "clock") {
      $("#demo-clock").textContent = clockNow();
      $("#demo-caption").textContent = new Date().toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" }).toUpperCase();
    } else if (mode === "stopwatch") {
      $("#demo-clock").textContent = format(currentElapsed());
      $("#demo-caption").textContent = running ? "STOPWATCH RUNNING" : "STOPWATCH PAUSED";
    } else if (mode === "timer" || mode === "focus") {
      const remaining = Math.max(0, timerTarget - Date.now());
      $("#demo-clock").textContent = format(remaining);
      $("#demo-caption").textContent = remaining === 0 && running ? "TIME COMPLETE" : (mode === "focus" ? focusPhase + " SESSION" : "COUNTDOWN REMAINING");
      if (remaining === 0 && running) { running = false; clearInterval(interval); interval = null; updateControls(); }
    }
  };
  const updateControls = () => {
    const start = $("#demo-start");
    if (mode === "clock") start.textContent = "PAUSE CLOCK";
    else start.textContent = running ? "PAUSE" : "START";
    $("#demo-reset").textContent = "RESET";
  };
  const setMode = next => {
    if (interval) clearInterval(interval);
    interval = null; running = false; elapsed = 0;
    mode = next;
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.mode === next));
    const configs = {
      clock: ["World of now.", "Your local clock updates live. This browser preview does not emulate Android system services."],
      stopwatch: ["Measure the moment.", "Stopwatch state is kept while this page remains open. Laps and native background persistence are not part of this preview."],
      timer: ["Set a finish line.", "Choose a short countdown below. The browser may throttle timers when this tab is inactive."],
      focus: ["Protect your focus.", "A short 25-minute Pomodoro preview. The Android app may provide additional native capabilities."]
    };
    title.textContent = configs[next][0]; note.textContent = configs[next][1];
    if (next === "clock") {
      display.innerHTML = '<div class="demo-clock" id="demo-clock">00:00:00</div><p id="demo-caption">YOUR LOCAL TIME · LIVE</p>';
      controls.innerHTML = '<button class="control-button" id="demo-start">CLOCK IS LIVE</button>';
      $("#demo-start").disabled = true;
    } else {
      display.innerHTML = '<div class="demo-clock" id="demo-clock">00:00:00</div><p id="demo-caption">READY</p>';
      if (next === "timer") controls.innerHTML = '<input class="timer-input" id="timer-minutes" type="number" min="1" max="180" value="5" aria-label="Timer minutes"><span style="align-self:center;color:#8293a4;font:10px var(--mono)">MIN</span><button class="control-button" id="demo-start">START</button><button class="control-button secondary" id="demo-reset">RESET</button>';
      else if (next === "focus") controls.innerHTML = '<button class="control-button" id="demo-start">START 25:00</button><button class="control-button secondary" id="demo-reset">RESET</button>';
      else controls.innerHTML = '<button class="control-button" id="demo-start">START</button><button class="control-button secondary" id="demo-reset">RESET</button>';
    }
    paint(); updateControls(); bindControls();
  };
  const bindControls = () => {
    $("#demo-start")?.addEventListener("click", () => {
      if (mode === "clock") return;
      if (running) {
        if (mode === "stopwatch") elapsed = currentElapsed();
        running = false; clearInterval(interval); interval = null;
      } else {
        if (mode === "timer" || mode === "focus") {
          const minutes = mode === "focus" ? 25 : Math.min(180, Math.max(1, Number($("#timer-minutes")?.value || 5)));
          timerTarget = Date.now() + minutes * 60000;
        } else startedAt = performance.now();
        running = true;
        interval = window.setInterval(paint, 200);
      }
      updateControls(); paint();
    });
    $("#demo-reset")?.addEventListener("click", () => {
      if (interval) clearInterval(interval);
      interval = null; running = false; elapsed = 0;
      if (mode === "timer") timerTarget = 0;
      if (mode === "focus") timerTarget = 0;
      paint(); updateControls();
    });
  };
  tabs.forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
  window.setInterval(() => { if (mode === "clock") paint(); }, 1000);
  setMode("clock");
})();