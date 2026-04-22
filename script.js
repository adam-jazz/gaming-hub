
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

function loadGame() {
  const game = localStorage.getItem("selectedGame");
  if (!game) return;

  const title = document.getElementById("gameTitle");
  const table = document.getElementById("gameTable");
  const rulesList = document.getElementById("gameRules");
  const pointsList = document.getElementById("gamePoints");

  title.innerText = game.toUpperCase() + " Leaderboard";

  let data = {
    cs2: {
      rules: [
        "5v5 competitive matches",
        "First team to 13 rounds wins",
        "No cheating or exploits",
        "Teamwork is required"
      ],
      points: [
        "+100 per win",
        "+10 per kill",
        "+20 for MVP",
        "-50 for leaving match"
      ]
    },

    valorant: {
      rules: [
        "5v5 tactical gameplay",
        "Attackers plant spike, defenders stop them",
        "Use abilities wisely",
        "No toxic behavior"
      ],
      points: [
        "+120 per win",
        "+8 per kill",
        "+25 for clutch win",
        "-40 for AFK"
      ]
    },

    fortnite: {
      rules: [
        "Battle royale survival",
        "Last player/team wins",
        "Building allowed",
        "Avoid storm damage"
      ],
      points: [
        "+150 Victory Royale",
        "+15 per elimination",
        "+50 top 5 finish",
        "-30 early elimination"
      ]
    },

    fifa: {
      rules: [
        "Standard football match",
        "Score more goals than opponent",
        "Fair play required",
        "No quitting mid-game"
      ],
      points: [
        "+100 win",
        "+5 per goal",
        "+20 clean sheet",
        "-25 for loss"
      ]
    },

    cod: {
      rules: [
        "Battle royale or team modes",
        "Eliminate enemies to survive",
        "Use strategy and positioning",
        "No hacks or cheats"
      ],
      points: [
        "+120 win",
        "+12 per kill",
        "+30 for top 3",
        "-40 early death"
      ]
    }
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.sort((a, b) =>
    (b.gameStats?.[game]?.score || 0) - (a.gameStats?.[game]?.score || 0)
  );

  let rows = "<tr><th>Rank</th><th>Player</th><th>Score</th><th>Tier</th></tr>";

  users.forEach((u, index) => {
    let score = u.gameStats?.[game]?.score || 0;
    let rank = typeof getRank === "function" ? getRank(score) : "Unranked";

    rows += `
      <tr>
        <td>${index + 1}</td>
        <td>${u.name}</td>
        <td>${score}</td>
        <td>${rank}</td>
      </tr>
    `;
  });

  table.innerHTML = rows;

  rulesList.innerHTML = "";

  if (data[game]) {
    const ruleIcons = ["🎯", "⚔️", "🧠", "🚫"];

    data[game].rules.forEach((rule, i) => {
      rulesList.innerHTML += `<li>${ruleIcons[i % ruleIcons.length]} ${rule}</li>`;
    });

    pointsList.innerHTML = "";

    const pointIcons = ["🏆", "💥", "⭐", "❌"];

    data[game].points.forEach((point, i) => {
      pointsList.innerHTML += `<li>${pointIcons[i % pointIcons.length]} ${point}</li>`;
    });

  } else {
    rulesList.innerHTML = "<li>No rules available</li>";
    pointsList.innerHTML = "<li>No points system available</li>";
  }
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

function playGame() {
  const game = localStorage.getItem("selectedGame");

  let user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) return;

  if (!user.gameStats) user.gameStats = {};

  if (!user.gameStats[game]) {
    user.gameStats[game] = {
      wins: 0,
      losses: 0,
      score: 0,
      kills: 0,
      deaths: 0,
      goals: 0,
      conceded: 0
    };
  }

  let stats = user.gameStats[game];

  let win = Math.random() > 0.5;

  let kills = 0, deaths = 0;
  let goals = 0, conceded = 0;

  if (game !== "fifa") {
    kills = Math.floor(Math.random() * 20);
    deaths = Math.floor(Math.random() * 15);

    stats.kills += kills;
    stats.deaths += deaths;

    stats.score += kills * 5 - deaths * 2;
  }
  else {
    goals = win ? 2 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
    conceded = win ? Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3);

    stats.goals += goals;
    stats.conceded += conceded;

    stats.score += goals * 10 - conceded * 5;
  }

  if (win) {
    stats.wins++;
    stats.score += 100;
  } else {
    stats.losses++;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.map(u => {
    return u.email === user.email ? user : u;
  });

  localStorage.setItem("users", JSON.stringify(users));

  sessionStorage.setItem(
    "currentUser",
    JSON.stringify(users.find(u => u.email === user.email))
  );

  alert(
    `${game.toUpperCase()} finished!\n` +
    (game === "fifa"
      ? `Goals: ${goals}, Conceded: ${conceded}`
      : `Kills: ${kills}, Deaths: ${deaths}`) +
    `\n${win ? "WIN 🏆" : "LOSS ❌"}`
  );

  if (typeof loadGame === "function") loadGame();
if (typeof loadProfile === "function") loadProfile();
if (typeof checkUser === "function") checkUser();
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