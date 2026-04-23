
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
  updateThemeIcon();

}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
  showGreeting();
  loadNavProfilePic();
  updateThemeIcon();
});

function loadTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("themeBtn");

  if (!btn) return;

  if (document.body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
  } else {
    btn.innerHTML = "🌙";
  }
}

function registerUser() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    alert("User already exists!");
    return false;
  }

  const user = {
    name,
    email,
    password,
    gameStats: {
      cs2: { score: 0, wins: 0, losses: 0 },
      valorant: { score: 0, wins: 0, losses: 0 },
      fortnite: { score: 0, wins: 0, losses: 0 },
      fifa: { score: 0, wins: 0, losses: 0 },
      cod: { score: 0, wins: 0, losses: 0 }
    }
  };

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered successfully!");

sessionStorage.setItem("currentUser", JSON.stringify(user));

document.getElementById("authSection").style.display = "none";
document.getElementById("profileSection").style.display = "block";

loadProfileDashboard(user);
showGreeting();
loadNavProfilePic();
return false;
}

function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid login");
    return false;
  }

  sessionStorage.setItem("currentUser", JSON.stringify(user));

  showToast("Login successful 🎮 Welcome " + user.name);

  document.getElementById("authSection").style.display = "none";
  document.getElementById("profileSection").style.display = "block";

  loadProfileDashboard(user);
  showGreeting();
  loadNavProfilePic();
  return false;
}
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

function logoutUser() {
  sessionStorage.removeItem("currentUser");
  location.reload();
}

function loadProfileDashboard(user) {
  if (!user) {
    user = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  if (!user) return; 

  document.getElementById("welcomeText").innerText =
    "Welcome " + (user.name || "Player") + " 🎮";

  document.getElementById("profileName").innerText =
    "Username: " + (user.name || "N/A");

  document.getElementById("profileEmail").innerText =
    "Email: " + (user.email || "N/A");

  let totalWins = 0;
  let totalLosses = 0;
  let totalScore = 0;

  let html = "";

  for (let game in (user.gameStats || {})) {
    let g = user.gameStats[game];

    totalWins += g.wins || 0;
    totalLosses += g.losses || 0;
    totalScore += g.score || 0;

    const gameIcons = {
  cs2: "🔫",
  valorant: "🎯",
  fortnite: "🪂",
  fifa: "⚽",
  cod: "⚔️"
};
let lossIcon = game === "fifa" ? "❌" : "💀";

html += `
  <div class="card">
    <h4>${gameIcons[game] || "🎮"} ${game.toUpperCase()}</h4>
    <p>🏆 Wins: ${g.wins || 0}</p>
    <p>${lossIcon} Losses: ${g.losses || 0}</p>
    <p>⭐ Score: ${g.score || 0}</p>
  </div>
`;
  }

  document.getElementById("totalWins").innerText = totalWins;
  document.getElementById("totalLosses").innerText = totalLosses;
  document.getElementById("totalScore").innerText = totalScore;

  document.getElementById("gameStats").innerHTML = html;

  if (user.profilePic) {
  document.getElementById("profilePic").src = user.profilePic;
}
}

function goToGame(game) {
  localStorage.setItem("selectedGame", game);
  window.location.href = "game-details.html";
}



function addScore(points) {
  let user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) return;

  user.score = (user.score || 0) + points;

  sessionStorage.setItem("currentUser", JSON.stringify(user));

  let users = JSON.parse(localStorage.getItem("users"));

  users = users.map(u => {
    if (u.email === user.email) {
      u.score = user.score;
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
}

// ===================== GAME DATA =====================
const gameData = {
  cs2: {
    name: "CS2",
    playLink: "https://store.steampowered.com/app/730/CounterStrike_2/",
    rules: ["Win rounds", "Plant/defuse bomb"],
    points: ["+100 win", "+50 kill"]
  },

  valorant: {
    name: "Valorant",
    playLink: "https://playvalorant.com/",
    rules: ["Plant spike", "Eliminate enemies"],
    points: ["+100 win", "+40 kill"]
  },

  cod: {
    name: "Call of Duty",
    playLink: "https://www.callofduty.com/",
    rules: ["Survive", "Eliminate players"],
    points: ["+150 win", "+60 kill"]
  },

  fifa: {
    name: "FIFA",
    playLink: "https://www.ea.com/games/ea-sports-fc",
    rules: ["Score goals", "Win matches"],
    points: ["+120 win", "+30 goal"]
  },

  fortnite: {
    name: "Fortnite",
    playLink: "https://www.epicgames.com/fortnite/",
    rules: [
      "Be the last player standing",
      "Collect weapons and materials",
      "Stay inside safe zone"
    ],
    points: [
      "+150 win",
      "+50 elimination",
      "+20 survival time"
    ]
  }
};

function addScore(game, playerName, score) {
  let scores = getScores(game);

  scores.push({
    name: playerName,
    score: Number(score)
  });

  localStorage.setItem(game + "_scores", JSON.stringify(scores));
}

function loadGame() {
  const params = new URLSearchParams(window.location.search);
  const game = params.get("game");
  localStorage.setItem("selectedGame", game);

  const data = gameData[game];
  if (!data) return;

  const title = document.getElementById("gameTitle");
  const table = document.getElementById("gameTable");
  const rules = document.getElementById("gameRules");
  const points = document.getElementById("gamePoints");

  title.textContent = data.name;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.sort((a, b) =>
    (b.gameStats?.[game]?.score || 0) -
    (a.gameStats?.[game]?.score || 0)
  );

  table.innerHTML = `
    <tr>
      <th>Rank</th>
      <th>Player</th>
      <th>Score</th>
    </tr>
  `;

  users.forEach((u, i) => {
    let score = u.gameStats?.[game]?.score || 0;

    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${u.name}</td>
        <td>${score}</td>
      </tr>
    `;
  });

 rules.innerHTML = "";
const ruleIcons = ["🎮", "⚔️", "🧠", "🚫", "🏆"];
data.rules.forEach((r, i) => {
  rules.innerHTML += `<li>${ruleIcons[i % ruleIcons.length]} ${r}</li>`;
});

  points.innerHTML = "";

const pointIcons = ["⭐", "💥", "🏅", "🔥", "❌"];
data.points.forEach((p, i) => {
  points.innerHTML += `<li>${pointIcons[i % pointIcons.length]} ${p}</li>`;
});
  window.currentGameLink = data.playLink;
}

function playGame() {
  const game = localStorage.getItem("selectedGame");

  let user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user || !game) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (!user.gameStats) user.gameStats = {};
  if (!user.gameStats[game]) {
    user.gameStats[game] = {
      wins: 0,
      losses: 0,
      score: 0
    };
  }

  let stats = user.gameStats[game];

  let win = Math.random() > 0.5;
  let points = Math.floor(Math.random() * 200);

  if (win) {
    stats.wins++;
    stats.score += 100 + points;
  } else {
    stats.losses++;
    stats.score += Math.floor(points / 2);
  }

  users = users.map(u => {
    if (u.email === user.email) {
      u.gameStats = user.gameStats;
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
  sessionStorage.setItem("currentUser", JSON.stringify(user));

  if (typeof loadGame === "function") loadGame();

  if (gameData && gameData[game]) {
    window.open(gameData[game].playLink, "_blank");
  }
}

function getRank(score) {
  if (score <= 999) return "Bronze";
  if (score <= 1999) return "Silver";
  if (score <= 2999) return "Gold";
  if (score <= 3999) return "Platinum";
  if (score <= 4999) return "Diamond";
  if (score <= 5999) return "Master";
  return "Grand Master";
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfileDashboard();
});

function submitForm() {
  alert("Message sent successfully!");
  document.querySelector("form").reset();
  return false;
}

function loadLeaderboard() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let leaderboard = users.map(u => {
    let total = 0;

    if (u.gameStats) {
      for (let game in u.gameStats) {
        total += u.gameStats[game].score || 0;
      }
    }

    return {
      name: u.name,
      score: total
    };
  });

  leaderboard.sort((a, b) => b.score - a.score);

  let html = "";

  leaderboard.forEach((u, index) => {
    let position = index + 1;

    let medal = "";
    let prize = "";

    if (position === 1) {
      medal = "🥇";
      prize = "🏆 $1000 + Legendary Badge";
    } 
    else if (position === 2) {
      medal = "🥈";
      prize = "💎 $500 + Epic Badge";
    } 
    else if (position === 3) {
      medal = "🥉";
      prize = "🔥 $250 + Rare Badge";
    } 
    else if (position <= 10) {
      prize = "⭐ Top 10 Reward Pack";
    } 
    else if (position <= 50) {
      prize = "🎁 Top 50 Bonus Reward";
    } 
    else {
      prize = "—";
    }

    html += `
      <div class="lb-card">
        <div class="rank">${medal} #${position}</div>
        <h3>${u.name}</h3>
        <p>Score: ${u.score}</p>
        <p class="prize">${prize}</p>
      </div>
    `;
  });

  document.getElementById("leaderboardContainer").innerHTML = html;
}

function refreshLeaderboardLive() {
  loadLeaderboard();
  setTimeout(refreshLeaderboardLive, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("leaderboardContainer")) {
    refreshLeaderboardLive();
  }
});

function initAccountPage() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("profileSection").style.display = "block";
    loadProfileDashboard(user);
  } else {
    document.getElementById("authSection").style.display = "flex";
    document.getElementById("profileSection").style.display = "none";
  }
}

function showAuth() {
  document.getElementById("authSection").style.display = "flex";
  document.getElementById("profileSection").style.display = "none";
}

function showProfile(user) {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("profileSection").style.display = "block";

  loadProfileDashboard(user);
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");

  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");

  document.querySelector(".slider").style.left = "0";
}

function showRegister() {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");

  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");

  document.querySelector(".slider").style.left = "50%";
}

function showGreeting() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const greeting = document.getElementById("userGreeting");

  if (!greeting) return;

  if (user && user.name) {
    greeting.innerText = "Hello, " + user.name + " 👋";
  } else {
    greeting.innerText = "";
  }
}

function uploadProfilePic() {
  const fileInput = document.getElementById("uploadPic");
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const imageBase64 = reader.result;

    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) return;

    user.profilePic = imageBase64;
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(u => {
      if (u.email === user.email) {
        u.profilePic = imageBase64;
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    document.getElementById("profilePic").src = imageBase64;
  };

  reader.readAsDataURL(file);
}
function loadNavProfilePic() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const img = document.getElementById("navProfilePic");

  if (!img) return;

  if (user && user.profilePic) {
    img.src = user.profilePic;
    img.style.display = "block";
  } else if (user) {
    img.src = "images/default.png";
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }
}
function updateUsername() {
  const newName = document.getElementById("newName").value;

  if (!newName) {
    alert("Please enter a username");
    return;
  }

  let user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) return;

  user.name = newName;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.map(u => {
    if (u.email === user.email) {
      u.name = newName;
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
  sessionStorage.setItem("currentUser", JSON.stringify(user));
  loadProfileDashboard(user);
  showGreeting();
  showToast("Username updated 👋 Hello " + newName);
}