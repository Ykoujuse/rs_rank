let leaderboardData = []
let config = {}
let lastUpdated = new Date()

window.addEventListener("message", (event) => {
  const data = event.data

  if (data.type === "open_rank") {
    leaderboardData = data.leaderboard
    config = data.config
    document.getElementById("wealth-rank").classList.remove("hidden")
    updateUI()
    updateTimestamp()
  } else if (data.type === "close_rank") {
    document.getElementById("wealth-rank").classList.add("hidden")
  } else if (data.type === "refresh_data") {
    leaderboardData = data.leaderboard
    updateUI()
    updateTimestamp()
  }
})

function updateUI() {
  if (config.UITitle) {
    document.getElementById("main-title").textContent = config.UITitle
  }

  if (config.UISubtitle) {
    document.getElementById("subtitle").textContent = config.UISubtitle
  }

  if (config.Locales) {
    document.getElementById("rank-header").textContent = config.Locales.rank
    document.getElementById("player-header").textContent = config.Locales.player
    document.getElementById("cash-header").textContent = config.Locales.cash
    document.getElementById("bank-header").textContent = config.Locales.bank
    document.getElementById("wealth-header").textContent = config.Locales.total
  }

  const realPlayerCount = leaderboardData.filter((player) => !player.isFake).length
  document.getElementById("player-count").textContent = `在线玩家: ${realPlayerCount}`

  for (let i = 0; i < Math.min(3, leaderboardData.length); i++) {
    const player = leaderboardData[i]
    const rankElement = document.querySelector(`.rank-${i + 1}`)

    if (rankElement) {
      rankElement.querySelector(".player-name").textContent = player.name
      rankElement.querySelector(".player-wealth").textContent =
        `${config.CurrencySymbol || "$"}${formatNumber(player.wealth)}`
      rankElement.style.display = "flex"
    }
  }

  for (let i = leaderboardData.length; i < 3; i++) {
    const rankElement = document.querySelector(`.rank-${i + 1}`)
    if (rankElement) {
      rankElement.style.display = "none"
    }
  }

  const leaderboardList = document.getElementById("leaderboard-list")
  leaderboardList.innerHTML = ""

  if (leaderboardData.length === 0) {
    const noData = document.createElement("div")
    noData.className = "loading-message"
    noData.textContent = config.Locales?.noPlayers || "暂无玩家数据"
    leaderboardList.appendChild(noData)
    return
  }

  leaderboardData.forEach((player, index) => {
    const row = document.createElement("div")
    row.className = "leaderboard-row"

    if (index < 3) {
      row.classList.add(`top-${index + 1}`)
    }

    row.innerHTML = `
      <div class="rank-col">
        <div class="rank-number">${index + 1}</div>
      </div>
      <div class="name-col">${player.name}${player.isFake ? " <small>(AI)</small>" : ""}</div>
      <div class="cash-col">${config.CurrencySymbol || "$"}${formatNumber(player.cash)}</div>
      <div class="bank-col">${config.CurrencySymbol || "$"}${formatNumber(player.bank)}</div>
      <div class="wealth-col">${config.CurrencySymbol || "$"}${formatNumber(player.wealth)}</div>
    `

    leaderboardList.appendChild(row)
  })
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function updateTimestamp() {
  lastUpdated = new Date()
  document.getElementById("last-updated").textContent = `最后更新: 刚刚`

  setInterval(() => {
    const now = new Date()
    const diff = Math.floor((now - lastUpdated) / 60000) 

    let timeText = "刚刚"
    if (diff === 1) {
      timeText = "1分钟前"
    } else if (diff > 1) {
      timeText = `${diff}分钟前`
    }

    document.getElementById("last-updated").textContent = `最后更新: ${timeText}`
  }, 60000)
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-btn").addEventListener("click", () => {
    fetch("https://rs_rank/close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
  })

  document.getElementById("refresh-btn").addEventListener("click", () => {
    const refreshBtn = document.getElementById("refresh-btn")
    refreshBtn.classList.add("rotating")

    fetch("https://rs_rank/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then(() => {
      setTimeout(() => {
        refreshBtn.classList.remove("rotating")
      }, 1000)
    })
  })
})

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    fetch("https://rs_rank/close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
  }
})

document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    @keyframes rotating {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .rotating {
      animation: rotating 1s linear;
    }
  </style>
`,
)
