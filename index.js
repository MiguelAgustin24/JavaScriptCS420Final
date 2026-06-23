// 🎰 SUPER SLOT MACHINE DELUXE - Browser Version 🎰

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "💎": 1,   // WILD - rarest, substitutes for any symbol
  "🍒": 2,   // Cherry
  "🍋": 3,   // Lemon
  "🍊": 5,   // Orange
  "7️⃣": 7,   // Lucky 7
  "⭐": 2,   // BONUS - triggers free spins
};

const SYMBOL_VALUES = {
  "💎": 10,  // Wild pays 10x
  "🍒": 7,   // Cherry pays 7x
  "🍋": 5,   // Lemon pays 5x
  "🍊": 3,   // Orange pays 3x
  "7️⃣": 4,   // Lucky 7 pays 4x
  "⭐": 8,   // Bonus pays 8x
};

// Game state
let gameState = {
  balance: 0,
  freeSpinsRemaining: 0,
  stats: {
    totalSpins: 0,
    totalWins: 0,
    totalLosses: 0,
    biggestWin: 0,
    totalWagered: 0,
    totalLost: 0,
    jackpotsHit: 0,
    freeSpinsTriggered: 0,
    consecutiveWins: 0,
    achievements: new Set(),
  }
};

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_WIN: { name: "First Blood", desc: "Win your first spin", emoji: "🎉" },
  BIG_WIN: { name: "Big Winner", desc: "Win $500+ in one spin", emoji: "💰" },
  JACKPOT: { name: "Jackpot King", desc: "Hit a JACKPOT!", emoji: "👑" },
  LUCKY_STREAK: { name: "Hot Streak", desc: "Win 3 times in a row", emoji: "🔥" },
  WILD_WINNER: { name: "Wild Card", desc: "Win with a Wild symbol", emoji: "💎" },
  FREE_SPIN_MASTER: { name: "Bonus Hunter", desc: "Trigger free spins", emoji: "⭐" },
  SURVIVOR: { name: "Survivor", desc: "Play 20+ spins", emoji: "🎮" },
  HIGH_ROLLER: { name: "High Roller", desc: "Bet $100+ per line", emoji: "🎲" },
};

// Initialize game
function makeDeposit() {
  const depositInput = document.getElementById('deposit-input');
  const amount = parseFloat(depositInput.value);

  if (isNaN(amount) || amount <= 0) {
    showMessage("❌ Please enter a valid deposit amount!");
    return;
  }

  gameState.balance = amount;
  updateDisplay();
  
  document.getElementById('deposit-section').classList.add('hidden');
  document.getElementById('game-section').classList.remove('hidden');
  
  showMessage(`✅ Deposited $${amount.toFixed(2)}! Good luck! 🍀`);
}

// Spin the reels
function spin() {
  const linesInput = document.getElementById('lines-input');
  const betInput = document.getElementById('bet-input');
  
  const numberOfLines = parseInt(linesInput.value);
  const bet = parseFloat(betInput.value);

  // Validation
  if (numberOfLines < 1 || numberOfLines > 5) {
    showMessage("❌ Please select 1-5 lines!");
    return;
  }

  const totalBet = gameState.freeSpinsRemaining > 0 ? 0 : bet * numberOfLines;
  
  if (totalBet > gameState.balance) {
    showMessage("❌ Insufficient balance!");
    return;
  }

  if (bet >= 100) {
    checkAchievement("HIGH_ROLLER");
  }

  // Deduct bet
  if (gameState.freeSpinsRemaining > 0) {
    gameState.freeSpinsRemaining--;
    showMessage("🎁 FREE SPIN! No charge!");
  } else {
    gameState.balance -= totalBet;
    gameState.stats.totalWagered += totalBet;
  }

  gameState.stats.totalSpins++;
  
  if (gameState.stats.totalSpins >= 20) {
    checkAchievement("SURVIVOR");
  }

  updateDisplay();
  
  // Disable spin button during animation
  const spinBtn = document.getElementById('spin-btn');
  spinBtn.disabled = true;

  // Animate reels
  animateSpin(() => {
    const reels = spinReels();
    const rows = transpose(reels);
    displayReels(rows);
    
    const result = getWinnings(rows, bet || 10, numberOfLines, totalBet);
    
    gameState.balance += result.winnings;
    
    if (result.freeSpins > 0) {
      gameState.freeSpinsRemaining += result.freeSpins;
    }

    updateDisplay();
    spinBtn.disabled = false;

    // Check if game over
    if (gameState.balance <= 0 && gameState.freeSpinsRemaining === 0) {
      setTimeout(() => {
        showMessage("💔 Game Over! You ran out of money!");
        showStats();
      }, 1500);
    }
  });
}

// Animate spinning
function animateSpin(callback) {
  const reels = document.querySelectorAll('.reel');
  reels.forEach(reel => reel.classList.add('spinning'));
  
  setTimeout(() => {
    reels.forEach(reel => reel.classList.remove('spinning'));
    callback();
  }, 1000);
}

// Generate random reels
function spinReels() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
}

// Transpose reels to rows
function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

// Display reels on screen
function displayReels(rows) {
  const reelElements = document.querySelectorAll('.reel .symbol');
  let index = 0;
  
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      reelElements[index].textContent = rows[i][j];
      index++;
    }
  }
}

// Calculate winnings
function getWinnings(rows, bet, lines, totalBet) {
  let winnings = 0;
  let freeSpinsAwarded = 0;
  let winningLines = [];
  let hasWild = false;

  const symbolsMatch = (symbols) => {
    const nonWild = symbols.filter(s => s !== "💎");
    if (nonWild.length === 0) return true;
    return nonWild.every(s => s === nonWild[0]);
  };

  // Check horizontal lines
  for (let row = 0; row < Math.min(3, lines); row++) {
    const symbols = rows[row];
    
    if (symbolsMatch(symbols)) {
      const mainSymbol = symbols.find(s => s !== "💎") || "💎";
      const payout = bet * SYMBOL_VALUES[mainSymbol];
      winnings += payout;
      winningLines.push(`Row ${row + 1}: +$${payout.toFixed(2)}`);
      
      if (symbols.includes("💎")) hasWild = true;
      if (symbols.filter(s => s === "⭐").length >= 2) freeSpinsAwarded += 3;
    }
  }

  // Check diagonal lines
  if (lines >= 4) {
    const diag1 = [rows[0][0], rows[1][1], rows[2][2]];
    if (symbolsMatch(diag1)) {
      const mainSymbol = diag1.find(s => s !== "💎") || "💎";
      const payout = bet * SYMBOL_VALUES[mainSymbol];
      winnings += payout;
      winningLines.push(`Diagonal ↘: +$${payout.toFixed(2)}`);
      
      if (diag1.includes("💎")) hasWild = true;
      if (diag1.filter(s => s === "⭐").length >= 2) freeSpinsAwarded += 3;
    }
  }

  if (lines >= 5) {
    const diag2 = [rows[0][2], rows[1][1], rows[2][0]];
    if (symbolsMatch(diag2)) {
      const mainSymbol = diag2.find(s => s !== "💎") || "💎";
      const payout = bet * SYMBOL_VALUES[mainSymbol];
      winnings += payout;
      winningLines.push(`Diagonal ↙: +$${payout.toFixed(2)}`);
      
      if (diag2.includes("💎")) hasWild = true;
      if (diag2.filter(s => s === "⭐").length >= 2) freeSpinsAwarded += 3;
    }
  }

  // JACKPOT check
  const allSymbols = rows.flat();
  if (allSymbols.every(s => s === "🍒") || allSymbols.every(s => s === "💎")) {
    const jackpot = bet * lines * 50;
    winnings += jackpot;
    showMessage(`\n🎰💰 J A C K P O T ! ! ! 💰🎰\n🏆 MEGA WIN: $${jackpot.toFixed(2)} 🏆`, true);
    gameState.stats.jackpotsHit++;
    checkAchievement("JACKPOT");
  }

  // Display results
  if (winningLines.length > 0) {
    gameState.stats.totalWins++;
    gameState.stats.consecutiveWins++;
    
    const netProfit = winnings - totalBet;
    
    let message = "🎉 WINNER! 🎉\n";
    message += winningLines.map(line => `✓ ${line}`).join('\n');
    message += `\n💵 Total Win: $${winnings.toFixed(2)}`;
    
    if (totalBet > 0) {
      message += `\n💰 Bet: -$${totalBet.toFixed(2)}`;
      message += `\n📊 Net Profit: ${netProfit >= 0 ? '+' : ''}$${netProfit.toFixed(2)}`;
    }
    
    showMessage(message);

    if (gameState.stats.totalWins === 1) {
      checkAchievement("FIRST_WIN");
    }

    if (winnings >= 500) {
      checkAchievement("BIG_WIN");
    }

    if (gameState.stats.consecutiveWins >= 3) {
      checkAchievement("LUCKY_STREAK");
    }

    if (winnings > gameState.stats.biggestWin) {
      gameState.stats.biggestWin = winnings;
    }

    if (hasWild) {
      checkAchievement("WILD_WINNER");
    }
  } else {
    gameState.stats.totalLosses++;
    gameState.stats.consecutiveWins = 0;
    
    if (totalBet > 0) {
      gameState.stats.totalLost += totalBet;
      showMessage(`❌ No win this time. You lost $${totalBet.toFixed(2)} 💸`);
    } else {
      showMessage("❌ No win on this free spin. Try again! 🎰");
    }
  }

  // Free spins
  if (freeSpinsAwarded > 0) {
    setTimeout(() => {
      showMessage(`⭐ BONUS! You won ${freeSpinsAwarded} FREE SPINS! ⭐`);
      gameState.stats.freeSpinsTriggered++;
      checkAchievement("FREE_SPIN_MASTER");
    }, 1000);
  }

  return { winnings, freeSpins: freeSpinsAwarded };
}

// Update display
function updateDisplay() {
  document.getElementById('balance').textContent = `$${gameState.balance.toFixed(2)}`;
  document.getElementById('spins').textContent = gameState.stats.totalSpins;
  
  const winRate = gameState.stats.totalSpins > 0 
    ? ((gameState.stats.totalWins / gameState.stats.totalSpins) * 100).toFixed(1) 
    : 0;
  document.getElementById('winrate').textContent = `${winRate}%`;
  document.getElementById('biggestwin').textContent = `$${gameState.stats.biggestWin.toFixed(2)}`;

  // Free spins banner
  const freeSpinsBanner = document.getElementById('freespins-banner');
  const freeSpinsCount = document.getElementById('freespins-count');
  
  if (gameState.freeSpinsRemaining > 0) {
    freeSpinsBanner.classList.remove('hidden');
    freeSpinsCount.textContent = gameState.freeSpinsRemaining;
  } else {
    freeSpinsBanner.classList.add('hidden');
  }
}

// Show message
function showMessage(text, isJackpot = false) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  
  if (isJackpot) {
    messageEl.classList.add('jackpot-animation');
    setTimeout(() => messageEl.classList.remove('jackpot-animation'), 1000);
  }
}

// Check and unlock achievement
function checkAchievement(key) {
  if (!gameState.stats.achievements.has(key)) {
    gameState.stats.achievements.add(key);
    const achievement = ACHIEVEMENTS[key];
    
    const achievementEl = document.getElementById('achievement');
    achievementEl.innerHTML = `
      🏆 ACHIEVEMENT UNLOCKED! ${achievement.emoji}<br>
      "${achievement.name}" - ${achievement.desc}
    `;
    achievementEl.classList.remove('hidden');
    
    setTimeout(() => {
      achievementEl.classList.add('hidden');
    }, 5000);
  }
}

// Show statistics
function showStats() {
  const stats = gameState.stats;
  const winRate = stats.totalSpins > 0 ? ((stats.totalWins / stats.totalSpins) * 100).toFixed(1) : 0;
  const netProfit = (stats.totalWagered > 0 ? gameState.balance - (stats.totalWagered - stats.totalLost) : 0);
  
  const html = `
    <h2>📊 YOUR STATISTICS</h2>
    <div style="text-align: left; line-height: 2;">
      <p><strong>Total Spins:</strong> ${stats.totalSpins}</p>
      <p><strong>Wins:</strong> ${stats.totalWins} | <strong>Losses:</strong> ${stats.totalLosses}</p>
      <p><strong>Win Rate:</strong> ${winRate}%</p>
      <p><strong>Biggest Win:</strong> $${stats.biggestWin.toFixed(2)}</p>
      <p><strong>Total Wagered:</strong> $${stats.totalWagered.toFixed(2)}</p>
      <p><strong>Total Lost:</strong> <span style="color: #ff6b6b;">$${stats.totalLost.toFixed(2)}</span></p>
      <p><strong>Jackpots Hit:</strong> ${stats.jackpotsHit}</p>
      <p><strong>Free Spins Triggered:</strong> ${stats.freeSpinsTriggered}</p>
      <p><strong>Achievements:</strong> ${stats.achievements.size}/${Object.keys(ACHIEVEMENTS).length}</p>
    </div>
  `;
  
  showModal(html);
}

// Show achievements
function showAchievements() {
  let html = '<h2>🏆 ACHIEVEMENTS</h2>';
  
  for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
    const unlocked = gameState.stats.achievements.has(key);
    html += `
      <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
        <strong>${achievement.emoji} ${achievement.name}</strong>
        <p>${achievement.desc}</p>
        ${unlocked ? '<span style="color: #00ff88;">✓ Unlocked</span>' : '<span style="color: #666;">🔒 Locked</span>'}
      </div>
    `;
  }
  
  showModal(html);
}

// Modal controls
function showModal(content) {
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// Reset game
function resetGame() {
  if (confirm('Are you sure you want to start a new game? All progress will be lost.')) {
    gameState = {
      balance: 0,
      freeSpinsRemaining: 0,
      stats: {
        totalSpins: 0,
        totalWins: 0,
        totalLosses: 0,
        biggestWin: 0,
        totalWagered: 0,
        totalLost: 0,
        jackpotsHit: 0,
        freeSpinsTriggered: 0,
        consecutiveWins: 0,
        achievements: new Set(),
      }
    };
    
    document.getElementById('deposit-section').classList.remove('hidden');
    document.getElementById('game-section').classList.add('hidden');
    document.getElementById('deposit-input').value = '';
    
    // Reset reels
    document.querySelectorAll('.reel .symbol').forEach(el => el.textContent = '❓');
    
    showMessage('🎰 New game started! Make your deposit to begin.');
    updateDisplay();
  }
}

// Click outside modal to close
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    closeModal();
  }
});
