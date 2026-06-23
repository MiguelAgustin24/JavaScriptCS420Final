// 🎰 ENHANCED SLOT MACHINE GAME 🎰
// Features: Jackpot, Wild Symbols, Free Spins, Achievements, Statistics!

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "💎": 1,   // WILD - rarest, substitutes for any symbol
  "🍒": 2,   // A tier - cherry (formerly A)
  "🍋": 3,   // B tier - lemon (formerly B)
  "🍊": 5,   // C tier - orange (formerly C)
  "7️⃣": 7,   // Lucky 7 - medium
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

// Game statistics
const stats = {
  totalSpins: 0,
  totalWins: 0,
  totalLosses: 0,
  biggestWin: 0,
  jackpotsHit: 0,
  freeSpinsTriggered: 0,
  achievements: new Set(),
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

// Display welcome banner
const showWelcome = () => {
  console.log("\n" + "=".repeat(50));
  console.log("🎰  WELCOME TO SUPER SLOT MACHINE DELUXE  🎰");
  console.log("=".repeat(50));
  console.log("💎 = WILD (substitutes any symbol!)");
  console.log("⭐ = BONUS (trigger free spins!)");
  console.log("🍒 = Cherry | 🍋 = Lemon | 🍊 = Orange | 7️⃣ = Lucky 7");
  console.log("=".repeat(50) + "\n");
};

// Check and award achievements
const checkAchievement = (key) => {
  if (!stats.achievements.has(key)) {
    stats.achievements.add(key);
    const achievement = ACHIEVEMENTS[key];
    console.log(`\n🏆 ACHIEVEMENT UNLOCKED! ${achievement.emoji}`);
    console.log(`   "${achievement.name}" - ${achievement.desc}\n`);
  }
};

// Display current statistics
const showStats = () => {
  console.log("\n" + "─".repeat(50));
  console.log("📊 YOUR STATISTICS:");
  console.log(`   Total Spins: ${stats.totalSpins}`);
  console.log(`   Wins: ${stats.totalWins} | Losses: ${stats.totalLosses}`);
  console.log(`   Win Rate: ${stats.totalSpins > 0 ? ((stats.totalWins / stats.totalSpins) * 100).toFixed(1) : 0}%`);
  console.log(`   Biggest Win: $${stats.biggestWin}`);
  console.log(`   Jackpots Hit: ${stats.jackpotsHit}`);
  console.log(`   Free Spins Triggered: ${stats.freeSpinsTriggered}`);
  console.log(`   Achievements: ${stats.achievements.size}/${Object.keys(ACHIEVEMENTS).length}`);
  console.log("─".repeat(50) + "\n");
};

const deposit = () => {
  showWelcome();
  while (true) {
    const depositAmount = prompt("💵 Enter a deposit amount: $");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("❌ Invalid deposit amount, try again.");
    } else {
      console.log(`✅ Deposited $${numberDepositAmount}!`);
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("📊 Enter lines to bet on (1-3 horizontal + 2 diagonal = max 5): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 5) {
      console.log("❌ Invalid number of lines (1-5), try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt(`💰 Enter bet per line (max $${(balance / lines).toFixed(2)}): $`);
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("❌ Invalid bet, try again.");
    } else {
      if (numberBet >= 100) {
        checkAchievement("HIGH_ROLLER");
      }
      return numberBet;
    }
  }
};

const spin = () => {
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
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  console.log("\n" + "┌─────────────────┐");
  for (const row of rows) {
    let rowString = "│ ";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol + " ";
      if (i != row.length - 1) {
        rowString += "│ ";
      }
    }
    rowString += "│";
    console.log(rowString);
  }
  console.log("└─────────────────┘\n");
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  let freeSpinsAwarded = 0;
  let winningLines = [];
  let hasWild = false;

  // Helper function to check if symbols match (considering wilds)
  const symbolsMatch = (symbols) => {
    const nonWild = symbols.filter(s => s !== "💎");
    if (nonWild.length === 0) return true; // All wilds
    return nonWild.every(s => s === nonWild[0]);
  };

  // Check horizontal lines
  for (let row = 0; row < Math.min(3, lines); row++) {
    const symbols = rows[row];
    
    if (symbolsMatch(symbols)) {
      const mainSymbol = symbols.find(s => s !== "💎") || "💎";
      const payout = bet * SYMBOL_VALUES[mainSymbol];
      winnings += payout;
      winningLines.push(`Row ${row + 1}: ${payout.toFixed(2)}`);
      
      if (symbols.includes("💎")) {
        hasWild = true;
      }
      
      // Check for bonus symbols
      if (symbols.filter(s => s === "⭐").length >= 2) {
        freeSpinsAwarded += 3;
      }
    }
  }

  // Check diagonal lines if bet on them
  if (lines >= 4) {
    // Top-left to bottom-right diagonal
    const diag1 = [rows[0][0], rows[1][1], rows[2][2]];
    if (symbolsMatch(diag1)) {
      const mainSymbol = diag1.find(s => s !== "💎") || "💎";
      const payout = bet * SYMBOL_VALUES[mainSymbol];
      winnings += payout;
      winningLines.push(`Diagonal ↘: ${payout.toFixed(2)}`);
      
      if (diag1.includes("💎")) hasWild = true;
      if (diag1.filter(s => s === "⭐").length >= 2) freeSpinsAwarded += 3;
    }
  }

  if (lines >= 5) {
    // Top-right to bottom-left diagonal
    const diag2 = [rows[0][2], rows[1][1], rows[2][0]];
    if (symbolsMatch(diag2)) {
      const mainSymbol = diag2.find(s => s !== "💎") || "💎";
      const payout = bet * SYMBOL_VALUES[mainSymbol];
      winnings += payout;
      winningLines.push(`Diagonal ↙: ${payout.toFixed(2)}`);
      
      if (diag2.includes("💎")) hasWild = true;
      if (diag2.filter(s => s === "⭐").length >= 2) freeSpinsAwarded += 3;
    }
  }

  // JACKPOT - All same premium symbols (Cherry or Wild)
  const allSymbols = rows.flat();
  if (allSymbols.every(s => s === "🍒") || allSymbols.every(s => s === "💎")) {
    const jackpot = bet * lines * 50; // 50x multiplier!
    winnings += jackpot;
    console.log("\n🎰💰 J A C K P O T ! ! ! 💰🎰");
    console.log(`🏆 MEGA WIN: $${jackpot.toFixed(2)} 🏆\n`);
    stats.jackpotsHit++;
    checkAchievement("JACKPOT");
  }

  // Display winning lines
  if (winningLines.length > 0) {
    console.log("🎉 WINNING LINES:");
    winningLines.forEach(line => console.log(`   ✓ ${line}`));
    console.log(`   💵 Total Win: $${winnings.toFixed(2)}\n`);
    
    if (hasWild) {
      checkAchievement("WILD_WINNER");
    }
  }

  // Free spins bonus
  if (freeSpinsAwarded > 0) {
    console.log(`⭐ BONUS! You won ${freeSpinsAwarded} FREE SPINS! ⭐\n`);
    stats.freeSpinsTriggered++;
    checkAchievement("FREE_SPIN_MASTER");
  }

  return { winnings, freeSpins: freeSpinsAwarded };
};

const game = () => {
  let balance = deposit();
  let freeSpinsRemaining = 0;
  let consecutiveWins = 0;

  while (true) {
    console.log("\n" + "=".repeat(50));
    console.log(`💰 Balance: $${balance.toFixed(2)} | 🎮 Spins: ${stats.totalSpins} | 🏆 Achievements: ${stats.achievements.size}/${Object.keys(ACHIEVEMENTS).length}`);
    
    if (freeSpinsRemaining > 0) {
      console.log(`⭐ FREE SPINS REMAINING: ${freeSpinsRemaining} ⭐`);
    }
    console.log("=".repeat(50));

    let numberOfLines, bet;
    
    if (freeSpinsRemaining > 0) {
      // Use previous bet settings for free spins
      numberOfLines = 3;
      bet = 0;
      console.log("🎁 FREE SPIN! No charge!");
      freeSpinsRemaining--;
    } else {
      numberOfLines = getNumberOfLines();
      bet = getBet(balance, numberOfLines);
      balance -= bet * numberOfLines;
    }

    stats.totalSpins++;
    
    if (stats.totalSpins >= 20) {
      checkAchievement("SURVIVOR");
    }

    console.log("\n🎰 SPINNING...\n");
    
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    
    const result = getWinnings(rows, bet || 10, numberOfLines);
    const winnings = result.winnings;
    
    balance += winnings;
    
    if (result.freeSpins > 0) {
      freeSpinsRemaining += result.freeSpins;
    }

    if (winnings > 0) {
      stats.totalWins++;
      consecutiveWins++;
      
      if (stats.totalWins === 1) {
        checkAchievement("FIRST_WIN");
      }
      
      if (winnings >= 500) {
        checkAchievement("BIG_WIN");
      }
      
      if (consecutiveWins >= 3) {
        checkAchievement("LUCKY_STREAK");
      }
      
      if (winnings > stats.biggestWin) {
        stats.biggestWin = winnings;
      }
    } else {
      console.log("❌ No win this time. Try again!\n");
      stats.totalLosses++;
      consecutiveWins = 0;
    }

    if (balance <= 0 && freeSpinsRemaining === 0) {
      console.log("\n💔 You ran out of money! 💔");
      break;
    }

    const choice = prompt("\n[P]lay again | [S]tats | [Q]uit: ").toLowerCase();

    if (choice === 's') {
      showStats();
      continue;
    } else if (choice !== 'p' && choice !== '') {
      break;
    }
  }

  // End game summary
  console.log("\n" + "=".repeat(50));
  console.log("🎰 GAME OVER - FINAL SESSION SUMMARY 🎰");
  console.log("=".repeat(50));
  showStats();
  
  console.log("🏆 ACHIEVEMENTS UNLOCKED:");
  if (stats.achievements.size === 0) {
    console.log("   No achievements yet. Play more to unlock them!");
  } else {
    stats.achievements.forEach(key => {
      const ach = ACHIEVEMENTS[key];
      console.log(`   ${ach.emoji} ${ach.name} - ${ach.desc}`);
    });
  }
  console.log("\n" + "=".repeat(50));
  console.log("Thanks for playing! Come back soon! 🎰\n");
};

game();