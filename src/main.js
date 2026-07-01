// SSC CGL FANTASY STUDY tracker ENGINE
// Pure HTML, CSS & Vanilla JavaScript with Zero Framework overhead
import { 
  registerCloudUser, 
  loginCloudUser, 
  loginWithGoogle,
  logoutCloudUser, 
  onCloudAuthStateChanged, 
  saveUserStateToCloud, 
  loadUserStateFromCloud 
} from "./firebase.js";
import { syllabusData } from "./syllabusData.js";

// --- PREMIUM MEME & MOTIVATIONAL SSC STUDY QUOTE PRESETS ---
const MOTIVATIONAL_QUOTES = [
  { text: "Your deep midnight study scrolls are secretly forged into the bronze stars of your administrative rank tomorrow.", author: "Secretariat Sage" },
  { text: "Focus is the sovereign gravity that locks focus on difficult concepts. Quant worksheets are conquered only by continuous focus.", author: "Scroll of CBIC" },
  { text: "Do not gaze at the clock; mimic its absolute orbit. Keep progressing, even if the progress is a single algebra spell.", author: "Grand Auditor" },
  { text: "A desk lit by a cozy yellow lamp in the quiet hours of midnight is the most powerful launchpad in the nation.", author: "LBSNAA Scribe" },
  { text: "The Income Tax insignia isn't purchased; it is meticulously woven from hours of quiet, solitary preparation.", author: "The Tax Codex" },
  { text: "When reading General Awareness files, remember: every single fact logged is another step into the Ministry files.", author: "Secretariat Memoir" },
  { text: "Revision is the protective charm that secures fleeting concepts in the permanent vaults of memory.", author: "Aura of Revision" }
];

const ROTATING_MOTIVATIONAL_MESSAGES = [
  "Future Officer in Training.",
  "The journey of a thousand pages begins with one chapter.",
  "Every completed quest strengthens your future rank.",
  "Consistency beats intensity.",
  "One Pomodoro at a time."
];

// Recovery message pool
const RECOVERY_MOTIVATIONAL_QUOTES = [
  "Even heroes require rest. A pause is not the end of the journey.",
  "Consistency is built over months, not days. Be proud of taking rest.",
  "Rest to recover magic and return twice as sharp tonight."
];

// --- TEMPLATES FOR NOTES SHORTCUT INSERTIONS ---
const NOTE_TEMPLATES = {
  quant: `📐 LATE-NIGHT QUANT LORE FORMULAE:
------------------------------------------
1. Algebra / Identities:
   • (a + b)³ = a³ + b³ + 3ab(a + b)
   • If a + b + c = 0, then a³ + b³ + c³ = 3abc
2. Geometry / Trigonometry:
   • Area of Equilateral Triangle = (√3 / 4) * a²
   • sin²θ + cos²θ = 1, sec²θ - tan²θ = 1
3. Arithmetic Shortcuts:
   • Product of two numbers = HCF × LCM
   • Profit % = (Profit / Cost Price) * 100`,

  vocab: `📖 VOCABULARY & IDIOMS LOG:
------------------------------------------
1. Word: Erudite (adj.) - Having or showing great knowledge or learning.
   Synonyms: Scholarly, academic, bookish.
2. Word: Capricious (adj.) - Given to sudden changes of mood or behavior.
3. Idiom: "Burn the midnight oil" - To read or study far into the night.
4. Idiom: "Pull up your socks" - To make an effort to improve your work.`,

  ga: `🏛️ GENERAL AWARENESS FACT SHEET:
------------------------------------------
1. Indian Polity:
   • Fundamental Rights are inspired by the US Constitution (Articles 12-35).
   • Article 324 governs the Election Commission.
2. Medieval History:
   • Battle of Tarain (1191 & 1192) - Prithviraj Chauhan vs. Ghori.
3. General Science:
   • Battery cells convert Chemical energy to Electrical energy.
   • Light travels fastest in a Vacuum (3 × 10⁸ m/s).`
};

// --- OFFICER TIMELINE RANKS MATRIX (JOURNEY ELAPSED) ---
const OFFICER_RANKS_TIMELINE = [
  { months: 0, xp: 0, title: "Recruit", badge: "🛡️", desc: "A fresh Recruit starting the long study training layout under candlelight." },
  { months: 3, xp: 1000, title: "Cadet", badge: "⚔️", desc: "Mastering fundamental syllabus paths and baseline exercises." },
  { months: 6, xp: 2500, title: "Scholar", badge: "📚", desc: "Acquiring advanced formula structures and speed metrics." },
  { months: 9, xp: 5000, title: "Strategist", badge: "🧭", desc: "Formulating mock test methodologies and target timing." },
  { months: 12, xp: 8000, title: "Officer Aspirant", badge: "🎖️", desc: "Highly trained Aspirant. Solving the toughest sections with razor focus." },
  { months: 16, xp: 12000, title: "SSC Veteran", badge: "🌟", desc: "Forged in study battles. Consistently hitting top score profiles." },
  { months: 20, xp: 16000, title: "Future Officer", badge: "👑", desc: "A step away from secretariat files. High authority status." },
  { months: 24, xp: 20000, title: "Future Elite Officer", badge: "🏛️", desc: "Legendary CGL champion. Commands supreme administrative magic." }
];

// Older XP-based Level titles (Fallback/Legacy Visual tags)
function getLegacyOfficerLevelTitle(lvl) {
  if (lvl <= 2) {
    return { title: "CGL Cadet", grade: "TRAINEE", desc: "Studying standard syllabus pathways." };
  } else if (lvl <= 5) {
    return { title: "Tax Assistant (CBIC)", grade: "LEVEL 4", desc: "Sorting critical state books." };
  } else if (lvl <= 8) {
    return { title: "Divisional Accountant", grade: "LEVEL 5-6", desc: "Analyzing reserves and state allocations." };
  } else if (lvl <= 12) {
    return { title: "Excise & GST Inspector", grade: "LEVEL 7", desc: "Executing regional compliance circulars." };
  } else if (lvl <= 16) {
    return { title: "Income Tax Inspector", grade: "LEVEL 7+", desc: "Leading fiscal intelligence files." };
  } else {
    return { title: "Assistant Section Officer", grade: "MINISTRY STAFF (AS0)", desc: "Directing state files at headquarters." };
  }
}

// --- INITIAL STATE ---
let state = {
  username: "Aspirant Officer",
  xp: 0,
  level: 1,
  streak: 0,
  totalHours: 0.0,
  pomodoroSessions: 0,
  lastActiveDate: "",
  note: "",
  startDate: "",
  todaysFocus: "",
  sessions: [],
  savedNotes: [],
  currentTab: "dashboard",
  tokensConsumed: 0, // Missed day recovery tokens consumed counter
  audioCelebration: "enabled",
  mockTests: [
    { id: "mock-sample-1", score: 142.50, date: "2026-06-08", notes: "Excellent performance in General English. Quant calculations can be speed-upgraded with algebra & geometry formulas review." }
  ],
  tasks: [
    { id: "task-1", title: "📜 Quantitative Trials", category: "Quant", completed: false, xpGained: 25 },
    { id: "task-2", title: "⚔️ Reasoning Challenges", category: "Reasoning", completed: false, xpGained: 20 },
    { id: "task-3", title: "📚 English Mastery", category: "English", completed: false, xpGained: 20 },
    { id: "task-4", title: "🧭 Knowledge Expedition", category: "GA", completed: false, xpGained: 20 },
    { id: "task-5", title: "📖 Current Affairs Chronicle", category: "Current Affairs", completed: false, xpGained: 15 },
    { id: "task-6", title: "🎯 Mock Test Challenge", category: "Mock Test", completed: false, xpGained: 35 },
    { id: "task-7", title: "🔥 Daily Revision Quest", category: "Revision", completed: false, xpGained: 15 }
  ],
  weeklyHistory: [
    { day: "Sun", hours: 0.0 },
    { day: "Mon", hours: 0.0 },
    { day: "Tue", hours: 0.0 },
    { day: "Wed", hours: 0.0 },
    { day: "Thu", hours: 0.0 },
    { day: "Fri", hours: 0.0 },
    { day: "Sat", hours: 0.0 }
  ]
};

// --- TIMELINE ELAPSED CALCULATOR ---
function calculateMonthsCompleted() {
  const start = new Date(state.startDate || new Date());
  const now = new Date();
  const msDiff = Math.abs(now.getTime() - start.getTime());
  
  // Quantize elapsed difference to 30-minute intervals (only registers changes every 30 mins)
  const thirtyMinsMs = 30 * 60 * 1000;
  const msDiffQuantized = Math.floor(msDiff / thirtyMinsMs) * thirtyMinsMs;
  
  const m = msDiffQuantized / (30 * 24 * 60 * 60 * 1000);
  return parseFloat(m.toFixed(1));
}

function getCurrentRankIndex(monthsCompleted) {
  let matchedIndex = 0;
  for (let i = 0; i < OFFICER_RANKS_TIMELINE.length; i++) {
    if (monthsCompleted >= OFFICER_RANKS_TIMELINE[i].months) {
      matchedIndex = i;
    }
  }
  return matchedIndex;
}

// --- MISSING STREAK PROTECTION RECOVERY ALGORITHM ---
function getCalculatedRecoveryTokens() {
  const start = new Date(state.startDate || new Date());
  const now = new Date();
  const elapsedDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Grant 1 Initial Token immediately + 1 additional token every 14 days elapsed since start
  const earned = 1 + Math.floor(elapsedDays / 14);
  const remaining = Math.max(0, earned - (state.tokensConsumed || 0));
  
  // Calculate next drop days countdown
  const elapsedFortnights = Math.floor(elapsedDays / 14);
  const nextTargetDays = (elapsedFortnights + 1) * 14;
  const daysRemainingForNext = Math.max(1, nextTargetDays - elapsedDays);
  
  return {
    remaining,
    nextDropDays: daysRemainingForNext
  };
}

function testAndApplyRestDayTaken() {
  const todayStr = new Date().toLocaleDateString();
  const lastActiveStr = state.lastActiveDate;
  
  if (lastActiveStr && lastActiveStr !== todayStr) {
    const lastActive = new Date(lastActiveStr);
    const today = new Date(todayStr);
    
    // Clear today's checklist checkbox statuses for the fresh sunrise
    state.tasks.forEach(t => t.completed = false);
    
    // Days difference calculation
    const msDiff = today.getTime() - lastActive.getTime();
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 1) {
      // User missed one or more days entirely
      let tokensNeeded = daysDiff;
      const rec = getCalculatedRecoveryTokens();
      
      if (rec.remaining >= tokensNeeded) {
        // We have enough tokens to fully auto-protect the streak!
        state.tokensConsumed = (state.tokensConsumed || 0) + tokensNeeded;
        state.lastRestDayDate = todayStr;
        alert(`🌙 Rest Day Automatically Taken! ${tokensNeeded} Streak Recovery Token(s) consumed. Your consecutive study streak is saved safely! ("Even heroes require rest.")`);
      } else if (rec.remaining > 0) {
        // Partial protection available
        const partiallySolved = rec.remaining;
        state.tokensConsumed = (state.tokensConsumed || 0) + partiallySolved;
        state.streak = 0; // Lost streak since gap was wider than tokens
        alert(`🌙 Some Rest Days Taken, but remaining shields ran dry. Streak refreshed. Consistency is built over months!`);
      } else {
        // No shields left
        state.streak = 0;
        alert(`🌙 Rest Day Taken! Scribe note: Consistency is built over months, not days. Let's restart the streak together tonight!`);
      }
    }
    
    state.lastActiveDate = todayStr;
    saveStateToStorage();
  } else if (!lastActiveStr) {
    state.lastActiveDate = todayStr;
    saveStateToStorage();
  }
}

// --- STATE MANAGEMENT PIPELINE ---
function loadStateFromStorage() {
  const cached = localStorage.getItem("ssc_tracker_state_v3");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed) {
        state = { ...state, ...parsed };
      }
    } catch (e) {
      console.warn("Could not parse cached data, restoring default matrix", e);
    }
  }

  if (!state.startDate) {
    state.startDate = new Date().toISOString();
  }

  // Setup default rank arrays and parameters
  if (state.claimedRankIndex === undefined) {
    state.claimedRankIndex = 0;
  }
  if (!state.unlockedRankBadges) {
    state.unlockedRankBadges = [];
  }
  if (state.cumulativeXp === undefined) {
    let total = 0;
    for (let i = 1; i < state.level; i++) {
      total += i * 250;
    }
    state.cumulativeXp = total + state.xp;
  }

  // Set default empty arrays
  if (!state.mockTests) state.mockTests = [];
  if (!state.savedNotes) state.savedNotes = [];
  if (state.tokensConsumed === undefined) state.tokensConsumed = 0;

  // Initialize default Study Tracker progress if it doesn't exist
  if (!state.studyTracker) {
    state.studyTracker = {};
  }
  syllabusData.forEach(sub => {
    if (!state.studyTracker[sub.subject]) {
      state.studyTracker[sub.subject] = {};
    }
    sub.topics.forEach(topic => {
      if (state.studyTracker[sub.subject][topic] === undefined) {
        state.studyTracker[sub.subject][topic] = false;
      }
    });
  });

  // Process streak calculation safely on load
  testAndApplyRestDayTaken();
}

// Current authenticated user registry reference
let currentCloudUserId = null;

function saveStateToStorage() {
  localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));
  triggerInterfaceUpdates();
  
  // Automate saving to Firebase Firestore securely in the background
  if (currentCloudUserId) {
    saveUserStateToCloud(currentCloudUserId, state);
  }
}

// --- TAB TRANSITION ENGINE ---
window.switchTab = function(tabId) {
  state.currentTab = tabId;
  localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));
  
  // Process visual hiding and showing of tab sections
  const sections = document.querySelectorAll(".tab-content");
  sections.forEach(sec => {
    if (sec.id === `tab-section-${tabId}`) {
      sec.classList.remove("hidden");
      sec.classList.add("magical-entrance");
    } else {
      sec.classList.add("hidden");
      sec.classList.remove("magical-entrance");
    }
  });

  // Re-style sidebar highlight status buttons
  const navButtons = document.querySelectorAll("nav button");
  navButtons.forEach(btn => {
    if (btn.id === `nav-${tabId}`) {
      btn.className = "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-black tracking-wide border-l-4 border-amber-400 bg-indigo-950/40 text-amber-300 transition-all cursor-pointer";
    } else {
      btn.className = "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide border-l-4 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all cursor-pointer";
    }
  });

  // Automatically shut sidebar menu on mobile after switching
  toggleSidebar(false);
  
  // Re-create vector icons dynamically
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Trigger sub charts draw
  if (tabId === "mocktests") {
    drawMockTestChart();
    renderMockTestsList();
  }
};

window.toggleSidebar = function(show) {
  const sidebar = document.getElementById("sidebar-container");
  const overlay = document.getElementById("sidebar-overlay");
  
  if (sidebar && overlay) {
    if (show) {
      sidebar.classList.remove("-translate-x-full");
      overlay.classList.remove("hidden");
    } else {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    }
  }
};

// --- AUDIO FREQUENCY SYNTHESIZER ---
function playGoldenSuccessChord() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) return;

    // Harmonic sound notes (E4, A4, B4, E5) frequencies mapping a gorgeous magical space tone
    const notes = [329.63, 440.00, 493.88, 659.25];
    const duration = 1.8;

    notes.forEach((freq, idx) => {
      // Stagger instrument triggers
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Exponential decay envelope
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      }, idx * 150);
    });
  } catch (error) {
    console.log("Audio synthesis bypassed due to environment click rules", error);
  }
}

// --- CONFETTI LAUNCHER VISUAL ON COMPLETION ---
const confettiCanvas = document.getElementById("confetti-canvas");
const ctxConfetti = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiParticles = [];
let confettiAnimationId = null;

function spawnConfettiRain() {
  if (!confettiCanvas || !ctxConfetti) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.classList.remove("hidden");

  confettiParticles = [];
  const colors = ["#fbbf24", "#38bdf8", "#34d399", "#f43f5e", "#818cf8"];

  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2
    });
  }

  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  animateConfetti();

  // Reset layer automatic
  setTimeout(() => {
    cancelAnimationFrame(confettiAnimationId);
    confettiCanvas.classList.add("hidden");
  }, 5000);
}

function animateConfetti() {
  if (!ctxConfetti || !confettiCanvas) return;
  ctxConfetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;

    ctxConfetti.save();
    ctxConfetti.translate(p.x, p.y);
    ctxConfetti.rotate((p.rotation * Math.PI) / 180);
    ctxConfetti.fillStyle = p.color;
    ctxConfetti.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctxConfetti.restore();
  });

  confettiAnimationId = requestAnimationFrame(animateConfetti);
}

// --- POPUP REWARD FLOATER COMPONENT ---
function spawnXpFloatPopup(amount) {
  const container = document.getElementById("xp-fly-container");
  if (!container) return;

  const floatingLabel = document.createElement("div");
  floatingLabel.className = "px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black font-mono tracking-wider shadow-lg flex items-center gap-1.5 transform translate-y-10 opacity-0 transition-all duration-700 pointer-events-none border border-amber-300/30";
  floatingLabel.innerHTML = `
    <span class="animate-bounce">✨</span>
    <span>+${amount} XP REWARD</span>
  `;

  container.appendChild(floatingLabel);

  // Trigger entering physics animation
  setTimeout(() => {
    floatingLabel.className = floatingLabel.className.replace("translate-y-10 opacity-0", "translate-y-0 opacity-100");
  }, 50);

  // Shrink out and remove
  setTimeout(() => {
    floatingLabel.className = floatingLabel.className.replace("opacity-100", "opacity-0 -translate-y-12");
  }, 2200);

  setTimeout(() => {
    floatingLabel.remove();
  }, 3000);
}

// --- POMODORO COUNTDOWN ENGINE PROPERTIES ---
let timerState = {
  originalMinutes: 25,
  secondsRemaining: 25 * 60,
  isRunning: false,
  mode: "study", // study, shortRest, longRest
  timerId: null
};

function updateTimerVisuals() {
  const timeDisplay = document.getElementById("timer-time-display");
  const progressRing = document.getElementById("timer-progress-ring");
  const playBtnText = document.getElementById("timer-trigger-btn");
  const bgGlow = document.getElementById("timer-bg-glow");

  if (!timeDisplay) return;

  const mins = Math.floor(timerState.secondsRemaining / 60);
  const secs = timerState.secondsRemaining % 60;
  timeDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Ring circular logic
  const totalSeconds = timerState.originalMinutes * 60;
  const ratio = timerState.secondsRemaining / totalSeconds;
  const dashOffset = 502.65 * (1 - ratio);
  
  if (progressRing) {
    progressRing.setAttribute("stroke-dashoffset", dashOffset.toFixed(2));
    
    // Change tone color based on nature
    if (timerState.mode === "study") {
      progressRing.setAttribute("class", "fill-none stroke-amber-500 transition-all duration-300");
      if (bgGlow) bgGlow.className = bgGlow.className.replace(/bg-\w+-\d+/g, "bg-amber-500");
    } else {
      progressRing.setAttribute("class", "fill-none stroke-indigo-400 transition-all duration-300");
      if (bgGlow) bgGlow.className = bgGlow.className.replace(/bg-\w+-\d+/g, "bg-indigo-500");
    }
  }

  // Set physical text states
  if (playBtnText) {
    if (timerState.isRunning) {
      playBtnText.innerHTML = `<i data-lucide="pause" class="h-4.5 w-4.5"></i> Freeze Frame`;
    } else {
      playBtnText.innerHTML = `<i data-lucide="play" class="h-4.5 w-4.5"></i> Begin Grind`;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

window.toggleTimer = function() {
  if (timerState.isRunning) {
    clearInterval(timerState.timerId);
    timerState.timerId = null;
    timerState.isRunning = false;
  } else {
    timerState.isRunning = true;
    timerState.timerId = setInterval(() => {
      timerState.secondsRemaining--;
      if (timerState.secondsRemaining <= 0) {
        handleTimerPeriodCompleted();
      }
      updateTimerVisuals();
    }, 1000);
  }
  updateTimerVisuals();
};

window.resetTimer = function() {
  clearInterval(timerState.timerId);
  timerState.timerId = null;
  timerState.isRunning = false;
  timerState.secondsRemaining = timerState.originalMinutes * 60;
  updateTimerVisuals();
};

window.setTimerMode = function(mode) {
  document.getElementById("mode-btn-study").className = "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all cursor-pointer text-slate-505 hover:text-slate-300";
  document.getElementById("mode-btn-short").className = "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all cursor-pointer text-slate-550 hover:text-slate-300";
  document.getElementById("mode-btn-long").className = "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all cursor-pointer text-slate-550 hover:text-slate-300";

  timerState.mode = mode;

  const subtitleNode = document.getElementById("timer-subtitle");
  const statusNode = document.getElementById("timer-status-tag");

  if (mode === "study") {
    document.getElementById("mode-btn-study").className = "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all cursor-pointer bg-slate-900 text-amber-300 border border-slate-800";
    timerState.originalMinutes = 25;
    if (subtitleNode) subtitleNode.innerText = '"Deep focus, zero distractions."';
    if (statusNode) statusNode.innerHTML = `<i data-lucide="moon" class="h-2.5 w-2.5"></i> focusing`;
  } else if (mode === "shortRest") {
    document.getElementById("mode-btn-short").className = "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all cursor-pointer bg-slate-900 text-indigo-300 border border-slate-800";
    timerState.originalMinutes = 5;
    if (subtitleNode) subtitleNode.innerText = '"Breathe, relax, take a sip of mystical tea."';
    if (statusNode) statusNode.innerHTML = `<i data-lucide="coffee" class="h-2.5 w-2.5 text-indigo-400"></i> resting`;
  } else if (mode === "longRest") {
    document.getElementById("mode-btn-long").className = "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all cursor-pointer bg-slate-900 text-indigo-300 border border-slate-800";
    timerState.originalMinutes = 15;
    if (subtitleNode) subtitleNode.innerText = '"Stretch your limbs and gather focus mana."';
    if (statusNode) statusNode.innerHTML = `<i data-lucide="coffee" class="h-2.5 w-2.5 text-indigo-400"></i> sleeping`;
  }

  timerState.secondsRemaining = timerState.originalMinutes * 60;
  timerState.isRunning = false;
  if (timerState.timerId) {
    clearInterval(timerState.timerId);
    timerState.timerId = null;
  }
  updateTimerVisuals();
  if (window.lucide) window.lucide.createIcons();
};

function handleTimerPeriodCompleted() {
  clearInterval(timerState.timerId);
  timerState.timerId = null;
  timerState.isRunning = false;

  playGoldenSuccessChord();

  if (timerState.mode === "study") {
    state.totalHours = parseFloat((state.totalHours + 0.4).toFixed(1));
    state.pomodoroSessions += 1;
    
    // Accumulate on weekly grid
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayName = dayNames[new Date().getDay()];
    const logItem = state.weeklyHistory.find(h => h.day === currentDayName);
    if (logItem) {
      logItem.hours = parseFloat((logItem.hours + 0.4).toFixed(1));
    }

    // Push focus event session log
    const now = new Date();
    state.sessions.push({
      id: `session-${Date.now()}`,
      timestamp: now.toISOString(),
      timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: now.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      duration: timerState.originalMinutes,
      xpGained: 50
    });

    addExperience(50);
    spawnXpFloatPopup(50);

    alert("🎉 Focus Session Completed Successfully! You generated focus study hours (+50 XP). Time for rest!");
    setTimerMode("shortRest");
  } else {
    alert("☕ Rest completed! Mental channels are refreshed. Ready for another study block?");
    setTimerMode("study");
  }

  saveStateToStorage();
}

// --- GAMIFIED EXPERIENCE REWARD MATRIX ---
function addExperience(amount) {
  state.xp += amount;

  // Sync cumulative RPG experience
  if (state.cumulativeXp === undefined) {
    let total = 0;
    for (let i = 1; i < state.level; i++) {
      total += i * 250;
    }
    state.cumulativeXp = total + state.xp;
  } else {
    state.cumulativeXp += amount;
  }

  let targetXp = state.level * 250;

  let leveledUp = false;
  while (state.xp >= targetXp) {
    state.xp -= targetXp;
    state.level += 1;
    targetXp = state.level * 250;
    leveledUp = true;
  }

  if (leveledUp) {
    launchLevelUpModal(state.level);
    playGoldenSuccessChord();
    spawnConfettiRain();
  }
}

function launchLevelUpModal(newLevel) {
  const modal = document.getElementById("level-up-modal");
  const oldLevelSpan = document.getElementById("modal-old-level");
  const newLevelSpan = document.getElementById("modal-new-level");
  const rankTitle = document.getElementById("modal-rank-title");
  const rankDesc = document.getElementById("modal-rank-desc");

  if (!modal) return;

  if (oldLevelSpan) oldLevelSpan.innerText = `Lv. ${newLevel - 1}`;
  if (newLevelSpan) newLevelSpan.innerText = `Lv. ${newLevel}`;

  const legacyNameInfo = getLegacyOfficerLevelTitle(newLevel);
  if (rankTitle) rankTitle.innerText = legacyNameInfo.title;
  if (rankDesc) rankDesc.innerText = `"${legacyNameInfo.desc}"`;

  modal.classList.remove("hidden");
}

window.closeLevelUpModal = function() {
  const modal = document.getElementById("level-up-modal");
  if (modal) modal.classList.add("hidden");
};

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderSavedNotes() {
  const container = document.getElementById("saved-notes-list");
  if (!container) return;

  if (!state.savedNotes || state.savedNotes.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-8 text-center text-slate-500 italic text-[11px] h-full min-h-[250px] leading-relaxed">
        "All quiet in the archive library. Pensively enter notes on the left and tap 'Enter Note' to store your spells."
      </div>
    `;
    return;
  }

  container.innerHTML = state.savedNotes.map((note, idx) => `
    <div class="rounded-xl border border-slate-805 bg-slate-950/40 hover:border-slate-700/80 transition-all duration-250 flex flex-col gap-2 p-3.5 text-left mb-1.5 last:mb-0">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h5 class="text-xs font-black text-amber-200 truncate pr-2 flex items-center gap-1.5">
            <i data-lucide="file-text" class="h-3.5 w-3.5 text-amber-500 shrink-0"></i>
            ${escapeHtml(note.title || "Untitled Spell")}
          </h5>
          <span class="text-[9px] font-mono text-slate-500 block mt-1 tracking-wider uppercase font-bold">
            📜 Saved ${note.dateStr || "Recently"}
          </span>
        </div>
        <button 
          onclick="deleteSavedNote(${idx})"
          class="text-slate-600 hover:text-red-400 p-1 rounded-md hover:bg-slate-900 transition-colors cursor-pointer"
          title="Delete Saved Note"
        >
          <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
        </button>
      </div>
      <div class="text-[11px] text-slate-350 leading-relaxed font-sans whitespace-pre-wrap mt-1 max-h-[140px] overflow-y-auto bg-slate-950/30 p-2.5 rounded-lg border border-slate-900/60 font-medium">
        ${escapeHtml(note.content || "")}
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

window.saveCurrentNoteToList = function() {
  const titleInput = document.getElementById("notes-title-input");
  const textarea = document.getElementById("notes-textarea");
  if (!textarea) return;

  const title = titleInput ? titleInput.value.trim() : "";
  const content = textarea.value.trim();

  if (!content) {
    alert("⚠️ Please enter some content for your grimoire spell note before launching it to the archives.");
    return;
  }

  const finalTitle = title || "Untitled Grimoire Note";
  const now = new Date();
  const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!state.savedNotes) {
    state.savedNotes = [];
  }

  // Prepend note to listing (newest first)
  state.savedNotes.unshift({
    title: finalTitle,
    content: content,
    dateStr: dateStr,
    timestamp: now.getTime()
  });

  // Reset inputs
  if (titleInput) titleInput.value = "";
  textarea.value = "";
  state.note = "";

  saveStateToStorage();
  triggerInterfaceUpdates(false);
  
  // Play achievement success sound chord if possible
  if (typeof playGoldenSuccessChord === "function") {
    try {
      playGoldenSuccessChord();
    } catch(err) {}
  }
};

window.deleteSavedNote = function(index) {
  if (confirm("Are you sure you want to delete this archived spell note?")) {
    if (state.savedNotes && state.savedNotes[index]) {
      state.savedNotes.splice(index, 1);
      saveStateToStorage();
      triggerInterfaceUpdates(false);
    }
  }
};

// --- RUNIC NOTES LOG WORKSPACE ---
window.handleNoteTyping = function(event) {
  const textarea = event.target;
  state.note = textarea.value;

  const wordCountSpan = document.getElementById("notes-word-count");
  if (wordCountSpan) {
    wordCountSpan.innerText = `${textarea.value.length} chars`;
    wordCountSpan.classList.remove("hidden");
  }

  const syncStatus = document.getElementById("notes-sync-status");
  if (syncStatus) {
    syncStatus.innerText = "Drafting...";
    syncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide border uppercase bg-amber-500/10 text-amber-500 border-amber-500/10";
  }

  if (window.autosaveDebounce) clearTimeout(window.autosaveDebounce);
  window.autosaveDebounce = setTimeout(() => {
    localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));
    if (syncStatus) {
      syncStatus.innerText = "Synced";
      syncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide border uppercase bg-emerald-500/10 text-emerald-400 border-emerald-500/10";
    }
  }, 1000);
};

window.insertNoteTemplate = function(templateType) {
  const textarea = document.getElementById("notes-textarea");
  if (!textarea) return;

  const insertText = NOTE_TEMPLATES[templateType] || "";
  const existingText = textarea.value;

  textarea.value = existingText ? `${existingText}\n\n${insertText}` : insertText;
  state.note = textarea.value;
  saveStateToStorage();

  const syncStatus = document.getElementById("notes-sync-status");
  if (syncStatus) {
    syncStatus.innerText = "Synced";
    syncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide border uppercase bg-emerald-500/10 text-emerald-400 border-emerald-500/10";
  }
};

// --- TODAY'S CORE FOCUS LOGIC ---
window.handleFocusTyping = function(event) {
  const input = event.target;
  state.todaysFocus = input.value;
  
  const focusSyncStatus = document.getElementById("focus-sync-status");
  if (focusSyncStatus) {
    focusSyncStatus.innerText = "Drafting...";
    focusSyncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono uppercase bg-amber-500/10 text-orange-400 border border-amber-500/10 animate-pulse";
  }

  if (window.focusAutosaveDebounce) clearTimeout(window.focusAutosaveDebounce);
  window.focusAutosaveDebounce = setTimeout(() => {
    localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));
    if (focusSyncStatus) {
      focusSyncStatus.innerText = "Synced";
      focusSyncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 animate-none";
    }
  }, 1000);
};

window.selectFocusSuggestion = function(suggestionText) {
  const input = document.getElementById("focus-input-field");
  if (input) {
    input.value = suggestionText;
    state.todaysFocus = suggestionText;
    saveStateToStorage();
    
    const focusSyncStatus = document.getElementById("focus-sync-status");
    if (focusSyncStatus) {
      focusSyncStatus.innerText = "Synced";
      focusSyncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 animate-none";
    }
  }
};

// --- MOCK TEST SCORE HANDLER ---
window.handleMockSubmit = function(event) {
  event.preventDefault();
  const scoreInput = document.getElementById("mock-score-input");
  const dateInput = document.getElementById("mock-date-input");
  const notesInput = document.getElementById("mock-notes-input");

  if (!scoreInput || !dateInput) return;

  const score = parseFloat(parseFloat(scoreInput.value).toFixed(2));
  const date = dateInput.value;
  const notes = notesInput.value.trim();

  if (isNaN(score) || score < 0 || score > 200) {
    alert("Please type a valid score between 0 and 200.");
    return;
  }

  const newMock = {
    id: `mock-${Date.now()}`,
    score,
    date,
    notes
  };

  state.mockTests.unshift(newMock);
  
  // Clean inputs
  scoreInput.value = "";
  notesInput.value = "";
  dateInput.value = new Date().toISOString().split("T")[0];

  saveStateToStorage();
  playSingleMagicalTick();
  alert("🔮 Mock Record Spell Registered Successfully!");
};

window.deleteMockTest = function(id) {
  if (confirm("Permanently dissolve this Mock Test Record?")) {
    state.mockTests = state.mockTests.filter(t => t.id !== id);
    saveStateToStorage();
  }
};

function drawMockTestChart() {
  const container = document.getElementById("mock-chart-container");
  if (!container) return;

  const mockTests = state.mockTests || [];
  if (mockTests.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-4 text-center">
        <i data-lucide="line-chart" class="h-8 w-8 text-indigo-400 opacity-40 mb-2"></i>
        <p class="text-xs font-semibold text-slate-500">No score history plotted yet</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Sort chronologically oldest first to plot progress over time
  const data = [...mockTests].sort((a,b) => new Date(a.date) - new Date(b.date));

  const width = 450;
  const height = 130;
  const paddingX = 35;
  const paddingY = 20;

  const scores = data.map(d => d.score);
  const maxScore = Math.max(...scores, 150);
  const minScore = Math.min(...scores, 50);
  const scoreRange = maxScore - minScore || 50;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx / Math.max(1, data.length - 1)) * (width - 2 * paddingX);
    const ratio = (item.score - minScore) / scoreRange;
    const y = height - paddingY - ratio * (height - 2 * paddingY);
    return { x, y, score: item.score, date: item.date };
  });

  let pathD = "";
  if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  } else if (points.length === 1) {
    pathD = `M ${paddingX} ${points[0].y} L ${width - paddingX} ${points[0].y}`;
  }

  let gridLines = "";
  const benchmarks = [minScore, minScore + scoreRange/2, maxScore];
  benchmarks.forEach(bm => {
    const ratio = (bm - minScore) / scoreRange;
    const y = height - paddingY - ratio * (height - 2 * paddingY);
    gridLines += `<line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />`;
    gridLines += `<text x="${paddingX - 8}" y="${y + 3}" fill="rgba(148,163,184,0.4)" font-size="8" font-family="monospace" text-anchor="end">${Math.round(bm)}</text>`;
  });

  let pointCircles = "";
  points.forEach((p, idx) => {
    pointCircles += `
      <g>
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#34d399" stroke="#ffffff" stroke-width="1.5" />
        <title>Trial #${idx+1}: Score ${p.score} (${p.date})</title>
      </g>
    `;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible">
       <defs>
         <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stop-color="#34d399" stop-opacity="0.15" />
           <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
         </linearGradient>
       </defs>
       ${gridLines}
       ${points.length > 1 ? `
         <path d="${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z" fill="url(#chartGrad)" />
       ` : ""}
       <path d="${pathD}" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
       ${pointCircles}
    </svg>
  `;
}

function renderMockTestsList() {
  const container = document.getElementById("mock-tests-list-entries");
  if (!container) return;

  const mockTests = state.mockTests || [];
  
  // Update stats cards in real-time
  const statTotal = document.getElementById("mock-stat-total");
  const statPeak = document.getElementById("mock-stat-peak");
  const statAvg = document.getElementById("mock-stat-avg");
  const statLatest = document.getElementById("mock-stat-latest");

  if (mockTests.length === 0) {
    if (statTotal) statTotal.innerText = "0";
    if (statPeak) statPeak.innerText = "0.0";
    if (statAvg) statAvg.innerText = "0.0";
    if (statLatest) statLatest.innerText = "0.0";

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-8 text-center text-slate-500 italic text-xs">
        "No mock tests recorded yet. Complete a challenge to begin your record."
      </div>
    `;
    return;
  }

  const scores = mockTests.map(t => t.score);
  const total = mockTests.length;
  const peak = Math.max(...scores).toFixed(1);
  const avg = (scores.reduce((sum, s) => sum + s, 0) / total).toFixed(1);
  const latest = mockTests[0].score.toFixed(1);

  if (statTotal) statTotal.innerText = total;
  if (statPeak) statPeak.innerText = peak;
  if (statAvg) statAvg.innerText = avg;
  if (statLatest) statLatest.innerText = latest;

  container.innerHTML = mockTests.map(item => `
    <div class="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3 min-w-0">
        <div class="h-9 w-9 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
          <i data-lucide="book-open" class="h-4.5 w-4.5"></i>
        </div>
        <div class="min-w-0 flex-1 text-left">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-bold text-slate-100 font-mono">Score: <strong class="text-emerald-400">${item.score}</strong> / 200</span>
            <span class="text-[9px] tracking-wider font-mono bg-slate-900 text-slate-450 px-2 py-0.5 rounded border border-slate-800">${new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          ${item.notes ? `<p class="text-xs text-slate-400 mt-1 italic font-sans leading-relaxed">"${item.notes}"</p>` : ""}
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button onclick="deleteMockTest('${item.id}')" class="text-slate-600 hover:text-red-405 p-1.5 rounded hover:bg-slate-905 transition-colors cursor-pointer" title="Dissolve Trial Record">
          <i data-lucide="trash-2" class="h-4 w-4"></i>
        </button>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

// --- QUEST CHECKLIST INTERFACE ---
window.toggleTaskForm = function() {
  const form = document.getElementById("new-quest-form");
  if (form) form.classList.toggle("hidden");
};

window.handleAddTaskSubmit = function(event) {
  event.preventDefault();
  const titleInput = document.getElementById("new-quest-title");
  const categorySelect = document.getElementById("new-quest-category");

  if (!titleInput || !categorySelect) return;

  const currentTitle = titleInput.value.trim();
  if (!currentTitle) return;

  const newQuestItem = {
    id: `quest-custom-${Date.now()}`,
    title: currentTitle,
    category: categorySelect.value,
    completed: false,
    xpGained: 20
  };

  state.tasks.push(newQuestItem);
  titleInput.value = "";
  toggleTaskForm();
  saveStateToStorage();
};

window.deleteTaskItem = function(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveStateToStorage();
};

window.toggleTaskCompleted = function(id) {
  const quest = state.tasks.find(t => t.id === id);
  if (!quest) return;

  quest.completed = !quest.completed;

  if (quest.completed) {
    addExperience(quest.xpGained);
    spawnXpFloatPopup(quest.xpGained);
    playSingleMagicalTick();
  } else {
    state.xp -= quest.xpGained;
    if (state.cumulativeXp !== undefined) {
      state.cumulativeXp = Math.max(0, state.cumulativeXp - quest.xpGained);
    }
    if (state.xp < 0) {
      if (state.level > 1) {
        state.level -= 1;
        state.xp = (state.level * 250) + state.xp;
      } else {
        state.xp = 0;
      }
    }
  }

  // Check if all quests completed today -> Confetti blast!
  const isEverySingleTaskComplete = state.tasks.length > 0 && state.tasks.every(t => t.completed);
  if (isEverySingleTaskComplete && quest.completed) {
    spawnConfettiRain();
    playGoldenSuccessChord();
    state.streak += 1;
    alert("👑 ALL DAILY QUESTS CONQUERED! Your streak has updated! You earned the Ultimate Sovereign bonus.");
  }

  saveStateToStorage();
};

function playSingleMagicalTick() {
  if (state.audioCelebration === "disabled") return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 high sweet tone
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {}
}

window.resetAllTasksState = function() {
  if (confirm("Reset current study checklists? Completed status levels won't be lost.")) {
    state.tasks.forEach(t => t.completed = false);
    saveStateToStorage();
  }
};

// --- USER PERSONA MANAGEMENT ---
window.toggleEditName = function(showForm) {
  const container = document.getElementById("username-display-container");
  const form = document.getElementById("username-edit-form");
  const input = document.getElementById("username-input");

  if (showForm) {
    if (container) container.classList.add("hidden");
    if (form) form.classList.remove("hidden");
    if (input) {
      input.value = state.username;
      input.focus();
    }
  } else {
    if (container) container.classList.remove("hidden");
    if (form) form.classList.add("hidden");
  }
};

window.saveUserName = function(event) {
  event.preventDefault();
  const input = document.getElementById("username-input");
  if (input) {
    const trimmed = input.value.trim();
    if (trimmed) {
      state.username = trimmed;
      saveStateToStorage();
    }
  }
  toggleEditName(false);
};

// --- COMMISSIONS START DATE HANDLER ---
window.updateJourneyStartDate = function(event) {
  const newDateVal = event.target.value;
  if (newDateVal) {
    state.startDate = new Date(newDateVal).toISOString();
    saveStateToStorage();
  }
};

// --- ACHIEVEMENT BADGES RECONDITIONS MATRIX ---
const BADGE_PRESETS = [
  { id: "ach-1", title: "Scribe's Initiation", desc: "Log a custom study trial quest", icon: "pencil-line" },
  { id: "ach-2", title: "Midnight scholar", desc: "Accumulate more than 2.0 total focus study hours", icon: "book-open" },
  { id: "ach-3", title: "Focus Charger", desc: "Complete 1 focus Pomodoro session block", icon: "zap" },
  { id: "ach-4", title: "Secretariat Archiver", desc: "Write at least 150 characters in Grimoire Notes", icon: "folder" },
  { id: "ach-5", title: "Ascended Officer", desc: "Trigger level index rank promotion to lvl 3", icon: "shield" },
  { id: "ach-6", title: "Militant Mock Trial", desc: "Log at least 1 CGL Mock Test Record", icon: "award" },
  // OFFICERS' ODYSSEY RANK PROMOTION WARRANTS
  { id: "ach-rank-1", title: "Warrant: Cadet", desc: "Successfully claim Cadet rank promotion (🛡️)", icon: "shield" },
  { id: "ach-rank-2", title: "Warrant: Scholar", desc: "Successfully claim Scholar rank promotion (📚)", icon: "book-open" },
  { id: "ach-rank-3", title: "Warrant: Strategist", desc: "Successfully claim Strategist rank promotion (🧭)", icon: "compass" },
  { id: "ach-rank-4", title: "Warrant: Aspirant", desc: "Successfully claim Officer Aspirant rank promotion (🎖️)", icon: "award" },
  { id: "ach-rank-5", title: "Warrant: Veteran", desc: "Successfully claim SSC Veteran rank promotion (🌟)", icon: "star" },
  { id: "ach-rank-6", title: "Warrant: Future Officer", desc: "Successfully claim Future Officer rank promotion (👑)", icon: "crown" },
  { id: "ach-rank-7", title: "Warrant: Elite Officer", desc: "Successfully claim Future Elite Officer rank promotion (🏛️)", icon: "gem" }
];

function checkBadgeUnlocked(badgeId) {
  if (badgeId.startsWith("ach-rank-")) {
    const rx = parseInt(badgeId.split("-rank-")[1]);
    const currentClaimed = state.claimedRankIndex !== undefined ? state.claimedRankIndex : 0;
    return currentClaimed >= rx;
  }
  switch (badgeId) {
    case "ach-1":
      return state.tasks.length > 7;
    case "ach-2":
      return state.totalHours >= 2.0;
    case "ach-3":
      return state.pomodoroSessions >= 1;
    case "ach-4":
      return state.note && state.note.trim().length >= 150;
    case "ach-5":
      return state.level >= 3;
    case "ach-6":
      return state.mockTests && state.mockTests.length >= 1;
    default:
      return false;
  }
}

// Custom Promotion Warrant Manual Claim Handler
window.claimPromotionWarrant = function() {
  const currentRankIdx = state.claimedRankIndex !== undefined ? state.claimedRankIndex : 0;
  const nextRankIdx = currentRankIdx + 1;
  if (nextRankIdx >= OFFICER_RANKS_TIMELINE.length) return;

  const nextTimelineRank = OFFICER_RANKS_TIMELINE[nextRankIdx];
  const elapsedMonths = calculateMonthsCompleted();
  
  const timeMet = elapsedMonths >= nextTimelineRank.months;
  const xpMet = (state.cumulativeXp || 0) >= nextTimelineRank.xp;

  if (timeMet && xpMet) {
    state.claimedRankIndex = nextRankIdx;
    
    // Unlock new badge
    const badgeKey = "ach-rank-" + nextRankIdx;
    if (!state.unlockedRankBadges) {
      state.unlockedRankBadges = [];
    }
    if (!state.unlockedRankBadges.includes(badgeKey)) {
      state.unlockedRankBadges.push(badgeKey);
    }

    // Award bonus XP
    const bonusXp = 500;
    addExperience(bonusXp);

    // Confetti celebration & audio chord
    if (typeof spawnConfettiRain === "function") spawnConfettiRain();
    if (typeof playGoldenSuccessChord === "function") playGoldenSuccessChord();

    // Alert details
    alert(`🎉 COMMAND COMMISSION AUTHORIZED! \n\nCongratulations, Officer! You have claimed your promotion to "${nextTimelineRank.title}"! \n\n🎖️ Campaign Badge Unlocked!\n📚 +${bonusXp} Study XP Enlistment Bonus Claimed!\n\nYour name is inscribed higher on the Office Honor Roll.`);

    saveStateToStorage();
    renderRankTimelineRoad(elapsedMonths);
  }
};

// --- RENDERING DYNAMIC CAREER TIMELINE ROAD ---
function renderRankTimelineRoad(elapsedMonths) {
  const wrapper = document.getElementById("rpg-timeline-wrapper");
  if (!wrapper) return;

  const currentRankIdx = state.claimedRankIndex !== undefined ? state.claimedRankIndex : 0;

  wrapper.innerHTML = OFFICER_RANKS_TIMELINE.map((rank, index) => {
    const isUnlocked = index <= currentRankIdx;
    const isCurrent = index === currentRankIdx;

    const activeNodeClass = isUnlocked
      ? 'border-amber-400 bg-amber-400/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
      : 'border-slate-800 bg-slate-950/40 text-slate-650 opacity-40';

    const connectLineClass = isUnlocked ? 'bg-gradient-to-b from-amber-500 to-amber-600' : 'bg-slate-850';

    return `
      <div class="relative flex flex-col md:flex-row md:items-center gap-4 group transition-all">
        <!-- Vertical connector line -->
        ${index < OFFICER_RANKS_TIMELINE.length - 1 ? `
          <div class="absolute top-10 left-[18px] sm:left-[22px] bottom-[-32px] w-[2px] ${connectLineClass} pointer-events-none z-0"></div>
        ` : ""}

        <!-- Timeline rank label marker circle -->
        <div class="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border z-10 transition-all ${activeNodeClass}">
          <span class="text-lg sm:text-2xl select-none">${rank.badge}</span>
        </div>

        <!-- Timeline description parameters text card layout -->
        <div class="flex-1 min-w-0 bg-slate-900/40 border ${isUnlocked ? 'border-amber-500/15' : 'border-slate-850'} p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden transition-all duration-300 ${isCurrent ? 'ring-1 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.08)] bg-slate-900/60' : ''}">
          <div class="min-w-0 flex-1 text-left">
            <div class="flex items-center gap-2 flex-wrap font-sans">
              <h5 class="text-xs sm:text-sm font-bold tracking-wide ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}">${rank.title}</h5>
              <span class="text-[9px] font-mono rounded px-1.5 py-0.5 border leading-none shrink-0 ${
                isUnlocked
                  ? 'bg-amber-400/5 text-amber-400 border-amber-400/20'
                  : 'bg-slate-950 text-slate-600 border-slate-850'
              }">${rank.months === 0 ? 'Enlistment' : rank.months + ' Months / ' + rank.xp.toLocaleString() + ' XP'}</span>

              ${isCurrent ? `
                <span class="text-[8px] uppercase tracking-widest font-mono font-bold bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 rounded px-1.5 py-0.5 leading-none animate-pulse">CURRENT RANK</span>
              ` : ""}
            </div>
            <p class="text-xs ${isUnlocked ? 'text-slate-300 font-medium' : 'text-slate-500'} mt-1 font-sans italic">"${rank.desc}"</p>
          </div>

          <div class="flex items-center gap-1.5 shrink-0 font-sans">
            ${isUnlocked ? `
              <span class="text-[10px] font-mono text-emerald-400 font-extrabold flex items-center gap-1"><i data-lucide="check-circle" class="h-3.5 w-3.5"></i> CLAIMED</span>
            ` : `
              <span class="text-[10px] font-mono text-slate-500 flex items-center gap-1"><i data-lucide="lock" class="h-3.5 w-3.5"></i> LOCKED</span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

// --- INTERFACE CANVAS DYNAMIC RENDERING ---
function triggerInterfaceUpdates(shouldRepopulateTaskValues = true) {
  // Sync core header elements
  const hName = document.getElementById("user-display-name");
  if (hName) hName.innerText = state.username;

  const hLevel = document.getElementById("header-level-badge");
  if (hLevel) hLevel.innerText = state.level;

  const rLevel = document.getElementById("rpg-level-indicator");
  if (rLevel) rLevel.innerText = `Lv. ${state.level}`;

  // Mini levels title
  const currentClaimedIdx = state.claimedRankIndex !== undefined ? state.claimedRankIndex : 0;
  const currentTimelineRank = OFFICER_RANKS_TIMELINE[currentClaimedIdx];
  const hRankGrade = document.getElementById("header-officer-grade");
  if (hRankGrade) hRankGrade.innerText = currentTimelineRank.title;

  const hStreak = document.getElementById("header-streak-count");
  if (hStreak) hStreak.innerText = state.streak;

  // Compute Days Since Began
  const start = new Date(state.startDate || new Date());
  const now = new Date();
  start.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const DaysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const hDays = document.getElementById("header-days-since");
  if (hDays) hDays.innerText = DaysSince;

  // Update Mini Sidebar stats indicators
  const sCircle = document.getElementById("sidebar-level-circle");
  if (sCircle) sCircle.innerText = state.level;

  const sUser = document.getElementById("sidebar-username");
  if (sUser) sUser.innerText = state.username;

  // Render Officer Rank Path stats parameters
  const elapsedMonths = calculateMonthsCompleted();
  const nextRankIdx = currentClaimedIdx + 1;
  const nextTimelineRank = nextRankIdx < OFFICER_RANKS_TIMELINE.length ? OFFICER_RANKS_TIMELINE[nextRankIdx] : null;

  const sRankText = document.getElementById("sidebar-rank-title");
  if (sRankText) sRankText.innerText = currentTimelineRank.title;

  const rMonths = document.getElementById("rpg-months-completed");
  if (rMonths) rMonths.innerText = `${elapsedMonths.toFixed(1)} Month${elapsedMonths !== 1 ? 's' : ''}`;

  const rCumulXp = document.getElementById("rpg-cumulative-xp");
  if (rCumulXp) rCumulXp.innerText = `${(state.cumulativeXp || 0).toLocaleString()} XP`;

  const oHugeBadge = document.getElementById("officer-huge-badge");
  if (oHugeBadge) oHugeBadge.innerText = currentTimelineRank.badge;

  const oGrade = document.getElementById("officer-pay-grade");
  if (oGrade) oGrade.innerText = `RANK STATUS CODE: ${currentClaimedIdx + 1}`;

  const oTitle = document.getElementById("officer-full-title");
  if (oTitle) oTitle.innerText = currentTimelineRank.badge + " " + currentTimelineRank.title;

  const oDesc = document.getElementById("officer-full-desc");
  if (oDesc) oDesc.innerText = `"${currentTimelineRank.desc}"`;

  // Journey commission start date display text
  const startDisplaySpan = document.getElementById("rank-path-start-date-text");
  if (startDisplaySpan) {
    const dStr = new Date(state.startDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    startDisplaySpan.innerText = dStr;
  }

  const startDateInput = document.getElementById("journey-start-date-input");
  if (startDateInput) {
    startDateInput.value = new Date(state.startDate).toISOString().split("T")[0];
  }

  // --- DUAL REQUIREMENTS CHECK CARD DRAW ---
  const indTimeBadge = document.getElementById("indicator-time-badge");
  const indTimeCheck = document.getElementById("indicator-time-check");
  const indTimeNumbers = document.getElementById("indicator-time-numbers");

  const indXpBadge = document.getElementById("indicator-xp-badge");
  const indXpCheck = document.getElementById("indicator-xp-check");
  const indXpNumbers = document.getElementById("indicator-xp-numbers");

  let timeMet = true;
  let xpMet = true;

  if (nextTimelineRank) {
    timeMet = elapsedMonths >= nextTimelineRank.months;
    xpMet = (state.cumulativeXp || 0) >= nextTimelineRank.xp;

    if (indTimeBadge) {
      indTimeBadge.innerText = timeMet ? "✓ COMPLETED" : "IN PROGRESS";
      indTimeBadge.className = timeMet 
        ? "rounded px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20"
        : "rounded px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide text-slate-500 font-bold bg-slate-900 border border-slate-850";
    }
    if (indTimeCheck) {
      indTimeCheck.innerText = timeMet ? "✓" : "✗";
      indTimeCheck.className = timeMet ? "text-emerald-400 animate-pulse font-bold" : "text-rose-500 font-bold";
    }
    if (indTimeNumbers) {
      indTimeNumbers.innerText = `${elapsedMonths.toFixed(1)} / ${nextTimelineRank.months.toFixed(1)} Months`;
    }

    if (indXpBadge) {
      indXpBadge.innerText = xpMet ? "✓ COMPLETED" : "IN PROGRESS";
      indXpBadge.className = xpMet 
        ? "rounded px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20"
        : "rounded px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide text-slate-500 font-bold bg-slate-900 border border-slate-850";
    }
    if (indXpCheck) {
      indXpCheck.innerText = xpMet ? "✓" : "✗";
      indXpCheck.className = xpMet ? "text-indigo-400 animate-pulse font-bold" : "text-rose-500 font-bold";
    }
    if (indXpNumbers) {
      indXpNumbers.innerText = `${(state.cumulativeXp || 0).toLocaleString()} / ${nextTimelineRank.xp.toLocaleString()} XP`;
    }
  } else {
    // Max level achieved fallback text values
    if (indTimeBadge) {
      indTimeBadge.innerText = "SUPREME";
      indTimeBadge.className = "rounded px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20";
    }
    if (indTimeCheck) {
      indTimeCheck.innerText = "✓";
      indTimeCheck.className = "text-amber-400 font-bold";
    }
    if (indTimeNumbers) {
      indTimeNumbers.innerText = "Milestones Accomplished";
    }

    if (indXpBadge) {
      indXpBadge.innerText = "LIMITLESS";
      indXpBadge.className = "rounded px-2.5 py-0.5 text-[9px] font-mono leading-none tracking-wide text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20";
    }
    if (indXpCheck) {
      indXpCheck.innerText = "✓";
      indXpCheck.className = "text-amber-400 font-bold";
    }
    if (indXpNumbers) {
      indXpNumbers.innerText = "Legendary Study Tier";
    }
  }

  // Next Promotion Roadmap progress percentage calculs
  let promBarPercent = 100;
  if (nextTimelineRank) {
    const timeRange = nextTimelineRank.months - currentTimelineRank.months;
    const elapsedInCurrentRange = elapsedMonths - currentTimelineRank.months;
    const timeProgressPercent = timeRange > 0 ? Math.min(100, Math.max(0, (elapsedInCurrentRange / timeRange) * 100)) : 100;

    const xpRange = nextTimelineRank.xp - currentTimelineRank.xp;
    const xpInCurrentRange = (state.cumulativeXp || 0) - currentTimelineRank.xp;
    const xpProgressPercent = xpRange > 0 ? Math.min(100, Math.max(0, (xpInCurrentRange / xpRange) * 100)) : 100;

    promBarPercent = Math.floor((timeProgressPercent + xpProgressPercent) / 2);
  }

  const promBar = document.getElementById("rank-promotion-bar");
  if (promBar) promBar.style.width = `${promBarPercent}%`;

  const promPercentTag = document.getElementById("rank-promotion-percent-tag");
  if (promPercentTag) {
    if (nextTimelineRank) {
      promPercentTag.innerText = `${promBarPercent}% towards Promotion`;
    } else {
      promPercentTag.innerText = "Supreme Rank Attained";
    }
  }

  const promFrom = document.getElementById("rank-prom-from");
  if (promFrom) promFrom.innerText = `Current: ${currentTimelineRank.title} (${currentTimelineRank.months}m / ${currentTimelineRank.xp.toLocaleString()} XP)`;

  const promTo = document.getElementById("rank-prom-to");
  if (promTo) promTo.innerText = nextTimelineRank ? `Next: ${nextTimelineRank.title} (${nextTimelineRank.months}m / ${nextTimelineRank.xp.toLocaleString()} XP)` : "Sovereign Elite Unlocked 🏛️";

  // Render Promotion Claim action box
  const actionHolder = document.getElementById("promotion-action-card-holder");
  if (actionHolder) {
    if (!nextTimelineRank) {
      actionHolder.className = "relative z-10 rounded-xl border border-amber-500/25 bg-slate-950/70 p-4 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.02)] text-center";
      actionHolder.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-2">
          <div class="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-300 border border-amber-500/20 mb-2">
            <i data-lucide="award" class="h-5 w-5 animate-bounce"></i>
          </div>
          <h4 class="text-sm font-black text-amber-300 uppercase tracking-widest">Supreme Enlistment Complete</h4>
          <p class="text-[11px] text-slate-400 mt-1 max-w-sm font-sans leading-relaxed">You have climbed to the absolute pinnacle of the Officer Rank Pathway! Your administrative prepared authority is unmatched.</p>
        </div>
      `;
    } else {
      const bothMet = timeMet && xpMet;
      if (bothMet) {
        actionHolder.className = "relative z-10 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-indigo-950/25 p-4 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.06)] animate-pulse";
        actionHolder.innerHTML = `
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-left">
            <div class="text-left flex-1">
              <span class="rounded bg-amber-500 text-slate-950 font-mono font-black text-[9px] px-2 py-0.5 uppercase tracking-wider">Promotion Available</span>
              <h4 class="text-sm font-black text-white mt-1.5 flex items-center gap-1.5">
                <i data-lucide="shield-check" class="h-4.5 w-4.5 text-amber-400"></i>
                Command Warrant Authorized!
              </h4>
              <p class="text-[11px] text-slate-300 mt-1 leading-relaxed">You satisfy both the Time (${nextTimelineRank.months}m) and XP (${nextTimelineRank.xp.toLocaleString()}) criteria for <strong>${nextTimelineRank.title}</strong>.</p>
            </div>
            <button onclick="claimPromotionWarrant()" class="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:from-amber-300 hover:to-orange-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-350 active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md">
              <i data-lucide="crown" class="h-4 w-4"></i> Claim Promotion
            </button>
          </div>
        `;
      } else {
        const timeNeededLeft = Math.max(0, parseFloat((nextTimelineRank.months - elapsedMonths).toFixed(1)));
        const xpNeededLeft = Math.max(0, nextTimelineRank.xp - (state.cumulativeXp || 0));
        
        let progressMsg = "";
        if (timeNeededLeft > 0 && xpNeededLeft > 0) {
          progressMsg = `Needs ${timeNeededLeft} more Month${timeNeededLeft !== 1 ? 's' : ''} enlistment & ${xpNeededLeft.toLocaleString()} more study XP.`;
        } else if (timeNeededLeft > 0) {
          progressMsg = `Needs ${timeNeededLeft} more Month${timeNeededLeft !== 1 ? 's' : ''} enlistment. XP milestone satisfied!`;
        } else {
          progressMsg = `Needs ${xpNeededLeft.toLocaleString()} more study XP. Enlistment duration satisfied!`;
        }

        actionHolder.className = "relative z-10 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300 text-left";
        actionHolder.innerHTML = `
          <div class="flex flex-row items-center gap-3 font-sans text-left text-xs bg-transparent">
            <div class="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
              <i data-lucide="lock" class="h-4 w-4"></i>
            </div>
            <div class="text-left flex-1">
              <h4 class="text-xs font-bold text-slate-400">Promotion Requirements In Progress</h4>
              <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${progressMsg} Keep completing study quests to qualify for <strong>${nextTimelineRank.title}</strong>.</p>
            </div>
          </div>
        `;
      }
    }
  }

  // XP level indicator metrics
  const nextLevelBound = state.level * 250;
  const xpIndicator = document.getElementById("rpg-xp-indicator");
  if (xpIndicator) xpIndicator.innerText = `${state.xp} / ${nextLevelBound} XP`;

  const xpPercent = Math.min(100, Math.floor((state.xp / nextLevelBound) * 100));
  const rpPercentNode = document.getElementById("rpg-xp-percent");
  if (rpPercentNode) rpPercentNode.innerText = `${xpPercent}%`;

  const xpBar = document.getElementById("rpg-xp-bar");
  if (xpBar) xpBar.style.width = `${xpPercent}%`;

  // Focus Input Text values
  const focusInput = document.getElementById("focus-input-field");
  if (focusInput && focusInput.value !== (state.todaysFocus || "")) {
    focusInput.value = state.todaysFocus || "";
  }
  const focusSyncStatus = document.getElementById("focus-sync-status");
  if (focusSyncStatus) {
    if (state.todaysFocus) {
      focusSyncStatus.innerText = "Synced";
      focusSyncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 animate-none";
    } else {
      focusSyncStatus.innerText = "Awaiting";
      focusSyncStatus.className = "rounded-xl px-2.5 py-0.5 text-[9px] font-mono uppercase bg-slate-950 text-slate-500 border border-slate-850 animate-none";
    }
  }

  // Active Chamber Counter
  const chamberCounter = document.getElementById("timer-done-indicator");
  if (chamberCounter) chamberCounter.innerText = `Chamber: ${state.pomodoroSessions} Done`;

  // --- TASK PROGRESS SLATE DATA ---
  const checkedQuests = state.tasks.filter(t => t.completed);
  const questFraction = document.getElementById("quest-fraction-stats");
  if (questFraction) questFraction.innerText = `Progress: ${checkedQuests.length} / ${state.tasks.length} Completed`;

  const questPercent = state.tasks.length > 0 ? Math.floor((checkedQuests.length / state.tasks.length) * 100) : 0;
  const questPercentNode = document.getElementById("quest-percent-stats");
  if (questPercentNode) questPercentNode.innerText = `${questPercent}%`;

  const questBar = document.getElementById("quest-overall-bar");
  if (questBar) questBar.style.width = `${questPercent}%`;

  // Notes area update
  const noteArea = document.getElementById("notes-textarea");
  if (noteArea && noteArea.value !== state.note) {
    noteArea.value = state.note || "";
  }

  // Render Saved Grimoire Notes list
  if (typeof renderSavedNotes === "function") {
    renderSavedNotes();
  }

  // --- RENDERING INTEGRATED DASHBOARD SUMMARY CARDS ---
  const dashStreakCardVal = document.getElementById("dash-streak-card-val");
  if (dashStreakCardVal) dashStreakCardVal.innerText = `${state.streak} Sunset Day${state.streak !== 1 ? 's' : ''} 🔥`;

  const dashHoursCardVal = document.getElementById("dash-hours-card-val");
  if (dashHoursCardVal) dashHoursCardVal.innerText = `${state.totalHours.toFixed(1)} Hours 📚`;

  const dashRankCardVal = document.getElementById("dash-rank-card-val");
  if (dashRankCardVal) dashRankCardVal.innerText = `${currentTimelineRank.title} ⚔️`;

  const dashQuestsCardVal = document.getElementById("dash-quests-card-val");
  if (dashQuestsCardVal) dashQuestsCardVal.innerText = `${checkedQuests.length} / ${state.tasks.length} Done 🎯`;

  const dashQuestsMiniBar = document.getElementById("dash-quests-mini-bar");
  if (dashQuestsMiniBar) dashQuestsMiniBar.style.width = `${questPercent}%`;

  const dashPomosCardVal = document.getElementById("dash-pomos-card-val");
  if (dashPomosCardVal) dashPomosCardVal.innerText = `${state.pomodoroSessions} Cycle${state.pomodoroSessions !== 1 ? 's' : ''} ⏳`;

  const maxWeeklyHour = Math.max(...state.weeklyHistory.map(h => h.hours), 0.1);
  const peakWeeklyHours = Math.max(...state.weeklyHistory.map(h => h.hours));
  const dashWeeklyCardVal = document.getElementById("dash-weekly-card-val");
  if (dashWeeklyCardVal) dashWeeklyCardVal.innerText = `${peakWeeklyHours.toFixed(1)} Peak Hrs 📈`;

  // --- RENDERING CHECKLIST CHASSIS ELEMENTS ---
  if (shouldRepopulateTaskValues) {
    const taskContainer = document.getElementById("tasks-checklist-grid");
    if (taskContainer) {
      taskContainer.innerHTML = "";
      state.tasks.forEach(t => {
        const div = document.createElement("div");
        div.className = `p-3 px-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-left ${
          t.completed
            ? "border-emerald-500/30 bg-emerald-950/15"
            : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/10"
        }`;

        let categoryColor = "bg-purple-500/10 text-purple-300 border-purple-500/20";
        if (t.category === "Quant") categoryColor = "bg-amber-500/10 text-amber-300 border-amber-500/20";
        if (t.category === "Reasoning") categoryColor = "bg-rose-500/10 text-rose-300 border-rose-500/20";
        if (t.category === "English") categoryColor = "bg-teal-500/10 text-teal-300 border-teal-500/20";
        if (t.category === "GA") categoryColor = "bg-sky-500/10 text-sky-300 border-sky-500/20";
        if (t.category === "Current Affairs") categoryColor = "bg-violet-500/10 text-violet-300 border-violet-500/20";
        if (t.category === "Mock Test") categoryColor = "bg-red-500/10 text-red-300 border-red-500/20";

        div.innerHTML = `
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              ${t.completed ? "checked" : ""}
              onclick="toggleTaskCompleted('${t.id}')"
              class="h-4.5 w-4.5 rounded border-slate-705 bg-slate-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer accent-amber-500"
            />
            <div class="min-w-0 flex-1">
              <span class="text-[10px] uppercase font-mono border rounded px-1.5 py-0.5 leading-none ${categoryColor}">
                ${t.category}
              </span>
              <p class="text-[13px] font-medium leading-relaxed mt-1 text-slate-200 select-none ${t.completed ? 'line-through text-slate-500 font-normal' : ''}">
                ${t.title}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[10px] uppercase font-mono font-bold text-amber-400 bg-amber-400/5 px-1.5 py-0.5 rounded border border-amber-400/15">
              +${t.xpGained} XP
            </span>
            ${
              t.id.startsWith("quest-custom-") 
                ? `<button onclick="deleteTaskItem('${t.id}')" class="text-slate-600 hover:text-red-400 p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer" title="Archive Quest"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i></button>`
                : ""
            }
          </div>
        `;
        taskContainer.appendChild(div);
      });
    }
  }

  // --- RENDER RECOVERY MATRIX REMAINING DATA ---
  const recoveryInfo = getCalculatedRecoveryTokens();
  const dRecTokenNumeric = document.getElementById("recovery-token-display-numeric");
  if (dRecTokenNumeric) dRecTokenNumeric.innerText = recoveryInfo.remaining;

  const dRecTimer = document.getElementById("recovery-shields-timer");
  if (dRecTimer) {
    dRecTimer.innerText = `${recoveryInfo.remaining} Available / Next Drop In ${recoveryInfo.nextDropDays} Sunset Days`;
  }

  // --- RENDER ACHIEVEMENTS BADGES MEDALS INSIGNIAS ---
  const badgeGrid = document.getElementById("badges-grid-container");
  if (badgeGrid) {
    badgeGrid.innerHTML = "";
    let unlockedTotal = 0;

    BADGE_PRESETS.forEach(b => {
      const isUnlocked = checkBadgeUnlocked(b.id);
      if (isUnlocked) unlockedTotal++;

      const card = document.createElement("div");
      card.className = `p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-300 text-left ${
        isUnlocked
          ? "border-amber-400/25 bg-amber-400/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
          : "border-slate-850 bg-slate-950/20 opacity-45"
      }`;

      card.innerHTML = `
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
          isUnlocked
            ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
            : "bg-slate-900 text-slate-600 border-slate-800"
        }">
          <i data-lucide="${b.icon}"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="${isUnlocked ? 'text-amber-300 font-bold' : 'text-slate-400'} text-xs truncate tracking-wide">${b.title}</p>
          <p class="text-[10px] text-slate-500 truncate mt-0.5">${b.desc}</p>
        </div>
      `;

      badgeGrid.appendChild(card);
    });

    const badgeFraction = document.getElementById("badges-unlocked-fraction");
    if (badgeFraction) badgeFraction.innerText = `${unlockedTotal} / ${BADGE_PRESETS.length} Unlocked`;
  }

  // --- RENDER STATISTICS CIRCULAR GRAPH & STUDY HOUR TRACE AXES ---
  const cBar = document.getElementById("analytics-circular-bar");
  const cPercentText = document.getElementById("analytics-circular-percent");
  
  if (cBar && cPercentText) {
    const totalFinished = state.tasks.filter(t => t.completed).length;
    const finalCompleteFactor = state.tasks.length > 0 ? (totalFinished / state.tasks.length) : 0;
    const circularPercentage = Math.round(finalCompleteFactor * 100);

    cPercentText.innerText = `${circularPercentage}%`;

    const offset = 314.16 * (1 - finalCompleteFactor);
    cBar.setAttribute("stroke-dashoffset", offset.toFixed(2));

    const fCompletedSpan = document.getElementById("analytics-total-completed");
    if (fCompletedSpan) fCompletedSpan.innerText = totalFinished;

    const fActiveSpan = document.getElementById("analytics-total-active");
    if (fActiveSpan) fActiveSpan.innerText = state.tasks.length - totalFinished;
  }

  // Draw weekly bar traces
  const chartContainer = document.getElementById("analytics-bar-chart");
  const listContainer = document.getElementById("sessions-recorded-list");

  if (chartContainer) {
    if (!state.sessions || state.sessions.length === 0) {
      chartContainer.innerHTML = `
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/20 border border-slate-850 rounded-xl text-center backdrop-blur-xs">
          <i data-lucide="scroll" class="h-8 w-8 text-indigo-400/55 mb-2 animate-pulse"></i>
          <p class="text-xs font-semibold text-slate-300">No sessions recorded yet.</p>
          <p class="text-[10px] text-slate-500 mt-0.5">Charge the focus crystal above to log records!</p>
        </div>
      `;
      if (listContainer) {
        listContainer.innerHTML = `
          <div class="text-xs text-slate-500 italic p-3 text-center">Focus session logs are empty. Complete a grind session to begin!</div>
        `;
      }
    } else {
      chartContainer.innerHTML = `
        <div class="absolute inset-x-0 top-0 bottom-6 border-b border-dashed border-slate-800/40 flex flex-col justify-between pointer-events-none">
          <div class="h-0 border-t border-dashed border-slate-800/40 w-full"></div>
          <div class="h-0 border-t border-dashed border-slate-800/40 w-full"></div>
          <div class="h-0 border-t border-dashed border-slate-800/40 w-full"></div>
        </div>
      `;

      state.weeklyHistory.forEach(h => {
        const barHFactor = Math.min(100, Math.floor((h.hours / maxWeeklyHour) * 100));

        const barWrap = document.createElement("div");
        barWrap.className = "flex flex-col items-center flex-1 h-full justify-end relative z-10 group px-1";

        barWrap.innerHTML = `
          <span class="absolute bottom-full mb-1 bg-slate-950 border border-slate-805 text-[9px] font-mono font-medium text-slate-200 p-1 px-1.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
            ${h.hours.toFixed(1)} Hrs Spent
          </span>
          <div class="w-full max-w-[18px] bg-gradient-to-t from-indigo-600 via-indigo-500 to-amber-500 hover:to-amber-300 rounded-t-sm transition-all duration-1000 relative shadow-[0_0_10px_rgba(99,102,241,0.15)]" style="height: ${Math.max(4, barHFactor)}%;">
            <div class="absolute inset-x-0 top-0 h-1 bg-white/30 rounded-t-[1px]"></div>
          </div>
          <span class="text-[9px] font-mono text-slate-500 mt-2 hover:text-slate-350 transition-colors uppercase font-bold tracking-wider select-none">
            ${h.day}
          </span>
        `;
        chartContainer.appendChild(barWrap);
      });

      if (listContainer) {
        listContainer.innerHTML = state.sessions.slice(-3).reverse().map(s => `
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/45 border border-slate-800/40 p-1.5 px-2.5 rounded-lg text-left">
            <span class="flex items-center gap-1.5 truncate">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span class="truncate">Completed focus trial on ${s.dateStr} (${s.timeStr})</span>
            </span>
            <span class="text-amber-400 font-extrabold shrink-0">+${s.duration} mins focus (+50 XP)</span>
          </div>
        `).join("");
      }
    }
  }

  // Draw subject academy progress matrix
  const subjectBarsContainer = document.getElementById("analytics-subject-bars");
  if (subjectBarsContainer) {
    subjectBarsContainer.innerHTML = "";
    const categories = ["Quant", "Reasoning", "English", "GA", "Current Affairs", "Mock Test", "Revision"];
    categories.forEach(cat => {
      const catTasks = state.tasks.filter(t => t.category === cat);
      const catDone = catTasks.filter(t => t.completed);
      const pct = catTasks.length > 0 ? Math.round((catDone.length / catTasks.length) * 100) : 0;

      const item = document.createElement("div");
      item.className = "text-xs text-left";
      item.innerHTML = `
        <div class="flex justify-between font-mono text-[10px] text-slate-400 mb-1">
          <span class="font-bold flex items-center gap-1.5 text-slate-300">
            <span class="h-1.5 w-1.5 rounded-full ${pct === 100 ? 'bg-emerald-400' : 'bg-indigo-400'}"></span>
            ${cat} Academy
          </span>
          <span class="${pct === 100 ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}">${pct}% (${catDone.length}/${catTasks.length})</span>
        </div>
        <div class="h-1.5 w-full bg-slate-950 p-[1px] rounded-full border border-slate-900">
          <div class="h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
            pct === 100
              ? 'from-emerald-500 to-teal-400'
              : 'from-indigo-650 to-indigo-400'
          }" style="width: ${pct}%;"></div>
        </div>
      `;
      subjectBarsContainer.appendChild(item);
    });
  }

  // Draw timeline road
  renderRankTimelineRoad(elapsedMonths);

  // Sync mock test visual traces and scoring registries
  drawMockTestChart();
  renderMockTestsList();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Sync settings input value if it exists
  const settingsInput = document.getElementById("input-settings-username");
  if (settingsInput && document.activeElement !== settingsInput) {
    settingsInput.value = state.username || "";
  }

  // Sync settings audio value if it exists
  const audioSelect = document.getElementById("select-settings-audio");
  if (audioSelect) {
    audioSelect.value = state.audioCelebration || "enabled";
  }

  // Sync Study Tracker values in real-time
  updateStudyTrackerProgressUI();
}

// --- COSMIC AMBIENT FLOATING EMBERS (CANVAS LOOP) ---
const canvasGlow = document.getElementById("cosmic-particle-canvas");
const ctxGlow = canvasGlow ? canvasGlow.getContext("2d") : null;
let glowParticles = [];

function initGlowParticles() {
  if (!canvasGlow || !ctxGlow) return;
  canvasGlow.width = window.innerWidth;
  canvasGlow.height = window.innerHeight;

  glowParticles = [];
  const densityFactor = Math.floor(window.innerWidth / 40);
  for (let i = 0; i < densityFactor; i++) {
    glowParticles.push({
      x: Math.random() * canvasGlow.width,
      y: Math.random() * canvasGlow.height,
      radius: Math.random() * 2 + 0.6,
      alpha: Math.random() * 0.4 + 0.1,
      swayingSpeed: Math.random() * 0.4 + 0.1,
      angle: Math.random() * Math.PI * 2,
      risingSpeed: Math.random() * 0.35 + 0.15
    });
  }
}

function animateGlowLoop() {
  if (!ctxGlow || !canvasGlow) return;
  ctxGlow.clearRect(0, 0, canvasGlow.width, canvasGlow.height);

  glowParticles.forEach(p => {
    p.y -= p.risingSpeed;
    if (p.y < -10) {
      p.y = canvasGlow.height + 10;
      p.x = Math.random() * canvasGlow.width;
    }

    p.angle += 0.005;
    p.x += Math.sin(p.angle) * p.swayingSpeed;

    ctxGlow.beginPath();
    ctxGlow.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctxGlow.fillStyle = `rgba(243, 185, 11, ${p.alpha})`;
    ctxGlow.fill();
  });

  requestAnimationFrame(animateGlowLoop);
}

// Window resize handlers
window.addEventListener("resize", () => {
  if (canvasGlow) {
    canvasGlow.width = window.innerWidth;
    canvasGlow.height = window.innerHeight;
  }
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
});

// --- CLOCK AND MOTIVATION ROTATION CYCLE ---
function updateRealTimeClock() {
  const now = new Date();

  const motivationMsgSpan = document.getElementById("header-motivation-message");
  if (motivationMsgSpan) {
    // Quantize elapsed epoch to 30-minute intervals so it changes exactly every 30 minutes
    const thirtyMinIntervals = Math.floor(now.getTime() / (30 * 60 * 1000));
    const motivationIndex = thirtyMinIntervals % ROTATING_MOTIVATIONAL_MESSAGES.length;
    motivationMsgSpan.innerText = ROTATING_MOTIVATIONAL_MESSAGES[motivationIndex];
  }

  const clockSpan = document.getElementById("current-utc-time-indicator");
  if (clockSpan) {
    clockSpan.innerText = `UTC: ${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')} Z`;
  }
}

// --- STUDY TRACKER RENDER AND LOGIC INTERFACE ---
function initStudyTrackerUI() {
  const container = document.getElementById("study-subjects-list");
  if (!container) return;
  
  let html = "";
  syllabusData.forEach(sub => {
    let topicsHtml = "";
    sub.topics.forEach(topic => {
      const safeId = `${sub.id}-${topic.replace(/[^a-zA-Z0-9]/g, "-")}`;
      topicsHtml += `
        <!-- Topic checklist item -->
        <label for="chk-${safeId}" class="flex items-center justify-between p-3.5 rounded-xl border border-slate-900 bg-slate-950/60 hover:bg-slate-950 hover:border-${sub.color}-500/20 hover:shadow-[0_0_12px_rgba(255,255,255,0.01)] transition-all duration-200 cursor-pointer select-none group active:scale-[0.98]">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative flex items-center justify-center shrink-0">
              <input 
                type="checkbox" 
                id="chk-${safeId}" 
                onclick="event.stopPropagation(); toggleSyllabusTopic('${sub.subject.replace(/'/g, "\\'")}', '${topic.replace(/'/g, "\\'")}', 'chk-${safeId}')"
                class="peer h-4.5 w-4.5 rounded border border-slate-800 bg-slate-950 text-${sub.color}-500 focus:ring-0 focus:ring-offset-0 transition-all checked:border-${sub.color}-500 checked:bg-${sub.color}-500/10 cursor-pointer shrink-0" 
              />
              <i data-lucide="check" class="absolute h-3.5 w-3.5 text-${sub.color}-400 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity scale-90 peer-checked:scale-100 duration-200"></i>
            </div>
            <span id="lbl-${safeId}" class="text-xs font-semibold text-slate-300 transition-all truncate">${topic}</span>
          </div>
          <span id="badge-${safeId}" class="text-[8px] font-mono px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-500 leading-none shrink-0 transition-all">NOT STARTED</span>
        </label>
      `;
    });
    
    html += `
      <div class="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-850 hover:shadow-[0_0_20px_rgba(255,255,255,0.01)] font-sans" id="subject-card-${sub.id}">
        <!-- Subject Header -->
        <div onclick="toggleSubjectCard('${sub.id}')" class="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-slate-900/40" id="subject-header-${sub.id}">
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="h-11 w-11 rounded-xl bg-${sub.color}-500/10 border border-${sub.color}-500/20 flex items-center justify-center text-${sub.color}-400 shrink-0 shadow-inner">
              <i data-lucide="${sub.icon}" class="h-5.5 w-5.5"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 flex-wrap">
                <h3 class="text-xs sm:text-sm font-black tracking-wide text-white uppercase font-sans">${sub.subject}</h3>
                <span class="text-[9px] font-mono text-${sub.color}-400 uppercase tracking-widest font-bold">${sub.description}</span>
              </div>
              
              <!-- Mini Progress Info -->
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <div class="w-24 sm:w-36 bg-slate-950 h-1.5 rounded-full p-0.5 border border-slate-850 overflow-hidden shrink-0">
                  <div id="subject-progress-bar-val-${sub.id}" class="h-full rounded-full bg-${sub.color}-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,255,255,0.05)]" style="width: 0%;"></div>
                </div>
                <span class="text-[10px] font-mono font-medium text-slate-400">
                  <span id="subject-percent-val-${sub.id}" class="font-bold text-white font-mono">0%</span>
                  (<span id="subject-completed-val-${sub.id}" class="font-mono text-emerald-400">0</span>/<span id="subject-total-val-${sub.id}" class="font-mono">0</span> completed)
                </span>
              </div>
            </div>
          </div>
          
          <!-- Expand/Collapse arrow icon -->
          <div class="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 transition-transform duration-300 shrink-0" id="subject-chevron-${sub.id}">
            <i data-lucide="chevron-down" class="h-4 w-4"></i>
          </div>
        </div>

        <!-- Subject Expandable Checklist Grid -->
        <div id="subject-content-${sub.id}" class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-350 ease-out overflow-hidden">
          <div class="min-h-0">
            <div class="p-4 sm:p-5 bg-slate-950/20 border-t border-slate-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              ${topicsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateStudyTrackerProgressUI() {
  if (!state.studyTracker) return;
  
  let totalAll = 0;
  let completedAll = 0;
  
  syllabusData.forEach(sub => {
    let totalSub = sub.topics.length;
    let completedSub = 0;
    
    sub.topics.forEach(topic => {
      const checked = !!(state.studyTracker[sub.subject] && state.studyTracker[sub.subject][topic]);
      if (checked) {
        completedSub++;
      }
      
      const safeId = `${sub.id}-${topic.replace(/[^a-zA-Z0-9]/g, "-")}`;
      const chk = document.getElementById(`chk-${safeId}`);
      if (chk) {
        chk.checked = checked;
      }
      
      const label = document.getElementById(`lbl-${safeId}`);
      const badge = document.getElementById(`badge-${safeId}`);
      if (label) {
        if (checked) {
          label.className = "text-xs font-semibold text-slate-450 line-through decoration-emerald-500/50 select-none transition-all";
        } else {
          label.className = "text-xs font-semibold text-slate-200 select-none transition-all";
        }
      }
      if (badge) {
        if (checked) {
          badge.innerText = "COMPLETED";
          badge.className = `text-[8px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-bold leading-none shrink-0 transition-all shadow-[0_0_6px_rgba(16,185,129,0.15)]`;
        } else {
          badge.innerText = "NOT STARTED";
          badge.className = `text-[8px] font-mono px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-500 leading-none shrink-0 transition-all`;
        }
      }
    });
    
    totalAll += totalSub;
    completedAll += completedSub;
    
    const percentSub = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
    
    const subBar = document.getElementById(`subject-progress-bar-val-${sub.id}`);
    const subPercent = document.getElementById(`subject-percent-val-${sub.id}`);
    const subCompleted = document.getElementById(`subject-completed-val-${sub.id}`);
    const subTotal = document.getElementById(`subject-total-val-${sub.id}`);
    
    if (subBar) subBar.style.width = `${percentSub}%`;
    if (subPercent) subPercent.innerText = `${percentSub}%`;
    if (subCompleted) subCompleted.innerText = completedSub;
    if (subTotal) subTotal.innerText = totalSub;
  });
  
  const remainingAll = totalAll - completedAll;
  const percentAll = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0;
  
  const overallPercent = document.getElementById("study-overall-percent");
  const overallCompleted = document.getElementById("study-overall-completed");
  const overallRemaining = document.getElementById("study-overall-remaining");
  const overallBar = document.getElementById("study-overall-progress-bar");
  
  if (overallPercent) overallPercent.innerText = `${percentAll}%`;
  if (overallCompleted) overallCompleted.innerText = `${completedAll} / ${totalAll}`;
  if (overallRemaining) overallRemaining.innerText = remainingAll;
  if (overallBar) overallBar.style.width = `${percentAll}%`;
}

window.toggleSubjectCard = function(subjectId) {
  const content = document.getElementById(`subject-content-${subjectId}`);
  const chevron = document.getElementById(`subject-chevron-${subjectId}`);
  const card = document.getElementById(`subject-card-${subjectId}`);
  const header = document.getElementById(`subject-header-${subjectId}`);
  
  if (!content || !chevron) return;
  
  const isExpanded = content.classList.contains("grid-rows-[1fr]");
  
  if (isExpanded) {
    content.classList.remove("grid-rows-[1fr]");
    content.classList.add("grid-rows-[0fr]");
    chevron.classList.remove("rotate-180");
    card.classList.remove("border-slate-755/80", "shadow-[0_0_25px_rgba(255,255,255,0.03)]");
    card.classList.add("border-slate-800");
    header.classList.remove("bg-slate-900/40");
  } else {
    content.classList.remove("grid-rows-[0fr]");
    content.classList.add("grid-rows-[1fr]");
    chevron.classList.add("rotate-180");
    card.classList.remove("border-slate-800");
    card.classList.add("border-slate-700/80", "shadow-[0_0_25px_rgba(255,255,255,0.03)]");
    header.classList.add("bg-slate-900/40");
  }
};

window.toggleSyllabusTopic = function(subjectName, topicName, checkboxId) {
  const chk = document.getElementById(checkboxId);
  if (!chk) return;
  
  const isChecked = chk.checked;
  
  if (!state.studyTracker) state.studyTracker = {};
  if (!state.studyTracker[subjectName]) state.studyTracker[subjectName] = {};
  
  state.studyTracker[subjectName][topicName] = isChecked;
  
  // Web audio feedback
  playSingleMagicalTick();
  
  // Gamification rewards!
  if (isChecked) {
    addExperience(15);
    spawnXpFloatPopup(15);
  }
  
  saveStateToStorage();
};

// --- INITIALIZE APPLICATION TURN ON ---
window.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();
  initStudyTrackerUI();
  
  // Navigate to saved active tab
  switchTab(state.currentTab || "dashboard");
  triggerInterfaceUpdates();

  // Populate dynamic header quote
  const randomQ = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  const qText = document.getElementById("quote-text-node");
  const qAuthor = document.getElementById("quote-author-node");
  if (qText && qAuthor) {
    qText.innerText = `"${randomQ.text}"`;
    qAuthor.innerText = `— ${randomQ.author}`;
  }

  // Pop recovery messages quote
  const recoveryQuotePlaceholder = document.getElementById("recovery-quote-placeholder");
  if (recoveryQuotePlaceholder) {
    const randomRecQuote = RECOVERY_MOTIVATIONAL_QUOTES[Math.floor(Math.random() * RECOVERY_MOTIVATIONAL_QUOTES.length)];
    recoveryQuotePlaceholder.innerText = `"${randomRecQuote}"`;
  }

  // Pre-load default Mock date to today's date
  const mockDateInput = document.getElementById("mock-date-input");
  if (mockDateInput) {
    mockDateInput.value = new Date().toISOString().split("T")[0];
  }

  initGlowParticles();
  animateGlowLoop();

  // Setup clock cycles
  updateRealTimeClock();
  setInterval(updateRealTimeClock, 1000);
});

// --- SETTINGS PRESETS MANAGEMENT HANDLERS ---
window.saveSettingsUsername = function() {
  const input = document.getElementById("input-settings-username");
  if (input) {
    const val = input.value.trim();
    if (val) {
      state.username = val;
      saveStateToStorage();
      triggerInterfaceUpdates();
      alert(`🛡️ Identity Confirmed. Your enlistment name has been modified to: ${val}`);
    } else {
      alert("⚠️ Scribe error: Please provide a valid, non-empty Officer enlistment name.");
    }
  }
};

window.toggleAudioSetting = function(val) {
  state.audioCelebration = val;
  saveStateToStorage();
};

// --- PROGRESS RESET INTEGRATED ENGINE ---
window.openResetProgressModal = function() {
  const modal = document.getElementById("reset-progress-modal");
  const phase1 = document.getElementById("reset-phase-1");
  const phase2 = document.getElementById("reset-phase-2");
  const input = document.getElementById("reset-confirm-input");
  const proceedBtn = document.getElementById("btn-reset-proceed-phase-1");

  if (modal && phase1 && phase2) {
    modal.classList.remove("hidden");
    phase1.classList.remove("hidden");
    phase2.classList.add("hidden");
    if (input) {
      input.value = "";
      input.focus();
    }
    if (proceedBtn) {
      proceedBtn.disabled = true;
      proceedBtn.classList.add("bg-rose-950/60", "text-rose-300", "border-rose-500/40");
      proceedBtn.classList.remove("bg-rose-600", "text-white", "border-rose-500");
    }

    // Refresh dynamic vector icon widgets in opened modal
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.closeResetProgressModal = function() {
  const modal = document.getElementById("reset-progress-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
};

window.handleResetInputChange = function() {
  const input = document.getElementById("reset-confirm-input");
  const proceedBtn = document.getElementById("btn-reset-proceed-phase-1");
  if (input && proceedBtn) {
    const val = input.value;
    if (val === "RESET MY JOURNEY") {
      proceedBtn.disabled = false;
      proceedBtn.classList.remove("bg-rose-950/60", "text-rose-300", "border-rose-500/40");
      proceedBtn.classList.add("bg-rose-600", "text-white", "border-rose-500");
    } else {
      proceedBtn.disabled = true;
      proceedBtn.classList.add("bg-rose-950/60", "text-rose-300", "border-rose-500/40");
      proceedBtn.classList.remove("bg-rose-600", "text-white", "border-rose-500");
    }
  }
};

window.advanceResetToPhase2 = function() {
  const input = document.getElementById("reset-confirm-input");
  if (input && input.value === "RESET MY JOURNEY") {
    const phase1 = document.getElementById("reset-phase-1");
    const phase2 = document.getElementById("reset-phase-2");
    if (phase1 && phase2) {
      phase1.classList.add("hidden");
      phase2.classList.remove("hidden");

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }
};

window.cancelResetAndBackToPhase1 = function() {
  const phase1 = document.getElementById("reset-phase-1");
  const phase2 = document.getElementById("reset-phase-2");
  if (phase1 && phase2) {
    phase1.classList.remove("hidden");
    phase2.classList.add("hidden");
  }
};

window.executeAbsoluteReset = function() {
  // Clear other sub parts of storage or states
  localStorage.removeItem("ssc_tracker_state_v3");

  // Re-write to state block back to Recruit level, starting stats, and empty logs
  state.username = "Aspirant Officer";
  state.xp = 0;
  state.level = 1;
  state.streak = 0;
  state.totalHours = 0.0;
  state.pomodoroSessions = 0;
  state.lastActiveDate = new Date().toLocaleDateString();
  state.note = "";
  state.savedNotes = [];
  state.startDate = new Date().toISOString(); // new start date
  state.todaysFocus = "";
  state.sessions = [];
  state.currentTab = "dashboard";
  state.tokensConsumed = 0;
  state.claimedRankIndex = 0;
  state.unlockedRankBadges = [];
  state.cumulativeXp = 0;
  state.mockTests = []; // clear mock test history
  state.tasks = [
    { id: "task-1", title: "📜 Quantitative Trials", category: "Quant", completed: false, xpGained: 25 },
    { id: "task-2", title: "⚔️ Reasoning Challenges", category: "Reasoning", completed: false, xpGained: 20 },
    { id: "task-3", title: "📚 English Mastery", category: "English", completed: false, xpGained: 20 },
    { id: "task-4", title: "🧭 Knowledge Expedition", category: "GA", completed: false, xpGained: 20 },
    { id: "task-5", title: "📖 Current Affairs Chronicle", category: "Current Affairs", completed: false, xpGained: 15 },
    { id: "task-6", title: "🎯 Mock Test Challenge", category: "Mock Test", completed: false, xpGained: 35 },
    { id: "task-7", title: "🔥 Daily Revision Quest", category: "Revision", completed: false, xpGained: 15 }
  ];
  state.weeklyHistory = [
    { day: "Sun", hours: 0.0 },
    { day: "Mon", hours: 0.0 },
    { day: "Tue", hours: 0.0 },
    { day: "Wed", hours: 0.0 },
    { day: "Thu", hours: 0.0 },
    { day: "Fri", hours: 0.0 },
    { day: "Sat", hours: 0.0 }
  ];

  // Incinerate Study Tracker checklists back to clean slate
  state.studyTracker = {};
  syllabusData.forEach(sub => {
    state.studyTracker[sub.subject] = {};
    sub.topics.forEach(topic => {
      state.studyTracker[sub.subject][topic] = false;
    });
  });

  // Manual cleaning of specific notes elements
  const notesTitle = document.getElementById("notes-title-input");
  if (notesTitle) notesTitle.value = "";
  const notesArea = document.getElementById("notes-textarea");
  if (notesArea) notesArea.value = "";
  const resetInput = document.getElementById("reset-confirm-input");
  if (resetInput) resetInput.value = "";

  // Persist fresh record state
  localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));

  // If connected to Cloud, synchronize the refreshed starting state immediately
  if (currentCloudUserId) {
    saveUserStateToCloud(currentCloudUserId, state);
  }

  // Visual Clean up & redirect
  closeResetProgressModal();
  switchTab("dashboard");
  triggerInterfaceUpdates(true);

  // Success notifications
  alert("Your new journey begins.");
};

// --- CLOUD AUTHENTICATION & MULTI-USER DIRECT SYNCHRONIZATION ---

onCloudAuthStateChanged(async (user) => {
  const loggedInContainer = document.getElementById("cloud-logged-in-container");
  const loggedOutContainer = document.getElementById("cloud-logged-out-container");
  const userEmailSpan = document.getElementById("cloud-user-email");
  const badge = document.getElementById("cloud-connection-badge");
  const headerStatus = document.getElementById("header-cloud-sync-status");

  if (user) {
    currentCloudUserId = user.uid;
    
    // Toggle container views
    if (loggedInContainer) loggedInContainer.classList.remove("hidden");
    if (loggedOutContainer) loggedOutContainer.classList.add("hidden");
    if (userEmailSpan) userEmailSpan.innerText = user.email;
    
    // Update Connection Badge (emerald cloud)
    if (badge) {
      badge.innerHTML = `<i data-lucide="cloud" class="h-5 w-5 text-emerald-400"></i>`;
      badge.className = "h-10 w-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center";
    }

    // Update Header Status badge
    if (headerStatus) {
      headerStatus.innerHTML = `<i data-lucide="cloud" class="h-3 w-3"></i><span>CLOUD SECURED</span>`;
      headerStatus.className = "flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono border border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
    }

    // Attempt to download saved scrolls state from cloud
    try {
      const cloudState = await loadUserStateFromCloud(user.uid);
      if (cloudState) {
        // Overwrite local progress with downloaded archive database
        state = { ...state, ...cloudState };
        localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));
        // Completely refresh components
        triggerInterfaceUpdates(true);
      } else {
        // Create initial backup if cloud is empty
        await saveUserStateToCloud(user.uid, state);
      }
    } catch (err) {
      console.error("Failed loading or initializing user state in the cloud:", err);
    }
  } else {
    currentCloudUserId = null;

    if (loggedInContainer) loggedInContainer.classList.add("hidden");
    if (loggedOutContainer) loggedOutContainer.classList.remove("hidden");
    
    // Update Connection Badge (disabled grey)
    if (badge) {
      badge.innerHTML = `<i data-lucide="cloud-off" class="h-5 w-5 text-slate-500"></i>`;
      badge.className = "h-10 w-10 shrink-0 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center";
    }

    // Update Header Status badge
    if (headerStatus) {
      headerStatus.innerHTML = `<i data-lucide="cloud-off" class="h-3 w-3"></i><span>LOCAL ONLY</span>`;
      headerStatus.className = "flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono border border-slate-800 bg-slate-900/50 text-slate-500";
    }
  }

  // Reload lucide icon mapping dynamically
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Enlist authentication handlers internationally onto window object for HTML action attributes
window.handleGoogleLogin = async function() {
  const googleBtn = document.getElementById("google-login-btn");
  const originalText = googleBtn ? googleBtn.innerHTML : "Sign In with Google";
  
  if (googleBtn) {
    googleBtn.innerHTML = `
      <svg class="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Enlisting Google auth...</span>
    `;
    googleBtn.disabled = true;
  }

  const { user, error } = await loginWithGoogle();

  if (googleBtn) {
    googleBtn.innerHTML = originalText;
    googleBtn.disabled = false;
  }

  if (error) {
    alert("❌ Google Enlistment Failed: " + error);
  } else {
    alert("🌌 Divine Cloud Archives synchronized via Google! Welcome, Officer.");
  }
};

window.handleCloudLogin = async function() {
  const emailInput = document.getElementById("cloud-auth-email");
  const passwordInput = document.getElementById("cloud-auth-password");
  
  if (!emailInput || !passwordInput) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("⚠️ Please enter a valid Email Address and Password to login!");
    return;
  }

  const loginBtn = document.querySelector("button[onclick='handleCloudLogin()']");
  const originalText = loginBtn ? loginBtn.innerText : "Sign In 🔑";
  if (loginBtn) {
    loginBtn.innerText = "Connecting...";
    loginBtn.disabled = true;
  }

  const { user, error } = await loginCloudUser(email, password);
  
  if (loginBtn) {
    loginBtn.innerText = originalText;
    loginBtn.disabled = false;
  }

  if (error) {
    alert("❌ Access Denied: " + error);
  } else {
    alert("🌌 Cloud archives successfully synchronized! Welcome back, Officer.");
    emailInput.value = "";
    passwordInput.value = "";
  }
};

window.handleCloudRegister = async function() {
  const emailInput = document.getElementById("cloud-auth-email");
  const passwordInput = document.getElementById("cloud-auth-password");
  
  if (!emailInput || !passwordInput) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("⚠️ Please enter a valid Email and Password to register!");
    return;
  }

  if (password.length < 6) {
    alert("⚠️ Pass-incantation must be at least 6 characters in length!");
    return;
  }

  const registerBtn = document.querySelector("button[onclick='handleCloudRegister()']");
  const originalText = registerBtn ? registerBtn.innerText : "Create Account 🛡️";
  if (registerBtn) {
    registerBtn.innerText = "Securing Scroll...";
    registerBtn.disabled = true;
  }

  const { user, error } = await registerCloudUser(email, password);

  if (registerBtn) {
    registerBtn.innerText = originalText;
    registerBtn.disabled = false;
  }

  if (error) {
    alert("❌ Enlistment Failed: " + error);
  } else {
    alert("🛡️ Officer Cloud Profile registered! Your local study progress has been permanently synchronized to the cloud.");
    emailInput.value = "";
    passwordInput.value = "";
  }
};

window.handleCloudLogout = async function() {
  if (confirm("Sign out of your active Cloud Archive profile? (Your local cache copy remains safe on this browser!)")) {
    const { success, error } = await logoutCloudUser();
    if (success) {
      alert("🔒 Signed out. Transitioning to Local Sanctuary Mode.");
    } else {
      alert("❌ Error: " + error);
    }
  }
};

window.triggerImmediateCloudBackup = async function() {
  if (!currentCloudUserId) return;
  try {
    const success = await saveUserStateToCloud(currentCloudUserId, state);
    if (success) {
      alert("🚀 Divine Save Completed. Progress locked securely in the stars!");
    } else {
      alert("❌ Backup Spell interrupted. Check your network or try again.");
    }
  } catch (err) {
    console.error("Manual backup failed:", err);
    alert("❌ Backup Spell interrupted. Check your network or permissions.");
  }
};

window.triggerImmediateCloudRestore = async function() {
  if (!currentCloudUserId) return;
  if (confirm("Overwrite your current local progress with the latest data saved in the Cloud Archive? This cannot be undone.")) {
    try {
      const cloudState = await loadUserStateFromCloud(currentCloudUserId);
      if (cloudState) {
        state = { ...state, ...cloudState };
        localStorage.setItem("ssc_tracker_state_v3", JSON.stringify(state));
        triggerInterfaceUpdates(true);
        alert("📥 Restored successfully. Cloud synchronization complete.");
      } else {
        alert("⚠️ No saved progress found in the Cloud Archives for this profile yet.");
      }
    } catch (err) {
      console.error("Manual restore failed:", err);
      alert("❌ Restore Spell failed. Check your network or database permissions.");
    }
  }
};
