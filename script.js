let phase = 0;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playMeow() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.38);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.start(now);
    osc.stop(now + 0.55);
  } catch (e) {}
}

function playBell() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {}
}

function playKiss() {
  try {
    const ctx = getAudioCtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] =
        (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (e) {}
}

function playCoin() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function startJourney() {
  if (phase > 0) return;
  phase = 1;

  const question =
    document.getElementById("question-input").value || "Con mèo kêu sao?";
  const btn = document.getElementById("ask-btn");
  const inputRow = document.getElementById("input-row");

  const qd = document.getElementById("question-display");
  qd.textContent = question;
  qd.classList.add("visible");

  btn.classList.add("falling");
  playBell();

  inputRow.style.opacity = "0";
  inputRow.style.pointerEvents = "none";
  document.getElementById("btn-ball").classList.add("visible");

  setTimeout(() => {
    document.getElementById("title").textContent =
      "Cat is pondering your question...";
    document.getElementById("cat-eyes").classList.remove("open");
    document.getElementById("thinking-dots").classList.add("visible");
  }, 1200);

  setTimeout(() => {
    document.getElementById("title").textContent = "Cat has an answer...";
    document.getElementById("cat-eyes").classList.add("open");
    document.getElementById("thinking-dots").classList.remove("visible");
  }, 3200);

  setTimeout(() => {
    document.getElementById("title").textContent = "Cat can speak now!";
    document.getElementById("thinking-dots").classList.remove("visible");
  }, 4200);

  setTimeout(() => {
    playMeow();
    document.getElementById("meow-text").classList.add("visible");
    document.getElementById("cat-tail").classList.add("wagging");

    setTimeout(() => {
      document.getElementById("tip-section").classList.add("visible");
    }, 900);
  }, 5200);

  setTimeout(() => {
    document.getElementById("title").textContent = "bye bye nè ~ 🐾";
  }, 6500);
}

function giveTip(amount) {
  const rewards = {
    $10: {
      emoji: "😸",
      msg: "Cat says: Nyaa~!",
      sub: "Cat is happy and purring loudly!",
    },
    $20: {
      emoji: "🥰",
      msg: "Cat is kneading!",
      sub: "That's biscuit-making energy right there. So cute!",
    },
    $50: {
      emoji: "🎊",
      msg: "Cat is OVERJOYED!",
      sub: "Cat rolled over and showed you its tummy. The highest honor!",
    },
    kiss: {
      emoji: "💋😻",
      msg: "Mwah! Cat blushes!",
      sub: 'Cat slow-blinked back. That means "I love you" in cat language 💕',
    },
  };
  const r = rewards[amount] || rewards["$10"];
  document.getElementById("reward-emoji").textContent = r.emoji;
  document.getElementById("reward-msg").textContent = r.msg;
  document.getElementById("reward-sub").textContent = r.sub;
  document.getElementById("reward").classList.add("visible");
  if (amount === "kiss") {
    playKiss();
    spawnHearts();
  } else {
    playCoin();
    launchConfetti();
  }
}

function closeReward() {
  document.getElementById("reward").classList.remove("visible");
}

function spawnHearts() {
  const emojis = ["💋", "💕", "💖", "💗", "😻", "💝"];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "heart-particle";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = 20 + Math.random() * 60 + "%";
      el.style.top = 40 + Math.random() * 40 + "%";
      el.style.animationDuration = 1 + Math.random() + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 80);
  }
}

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const colors = ["#B8863A", "#FFD166", "#ff6b9d", "#c9b1ff", "#06d6a0"];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 8,
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 120);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 150) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ask-btn").addEventListener("click", startJourney);

  document.querySelectorAll(".tip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      giveTip(btn.dataset.tip);
    });
  });

  document
    .getElementById("reward-close")
    .addEventListener("click", closeReward);
});
