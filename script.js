// --------------- Variables ---------------
const stocks = ["Stock 1", "Stock 2", "Stock 3", "Stock 4"];
let rewards = [0, 0, 0, 0];
let picks = [0, 0, 0, 0]; // number of times each stock chosen
let roundCount = 0;
let running = false;
let interval;

const modeSelect = document.getElementById("mode");
const roundDisplay = document.getElementById("round");
const rewardDisplay = document.getElementById("output");
const startBtn = document.getElementById("runAI");
const stopBtn = document.getElementById("stopAI");
const resetBtn = document.getElementById("resetAI");

// --------------- Helper Functions ---------------

// Softmax function
function softmax(values, temperature = 1) {
  const exps = values.map(v => Math.exp(v / temperature));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExps);
}

// Pick a stock based on mode
function pickStock() {
  const mode = modeSelect.value;
  const epsilon = 0.3; // 30% explore

  if (mode === "greedy") {
    let maxReward = Math.max(...rewards);
    const candidates = rewards
      .map((r, i) => r === maxReward ? i : -1)
      .filter(i => i !== -1);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Learning AI
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * stocks.length); // explore randomly
  } else {
    // Softmax over average rewards
    const avgRewards = rewards.map((r, i) => (picks[i] > 0 ? r / picks[i] : 0));
    const probs = softmax(avgRewards, 2);
    let r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probs.length; i++) {
      cumulative += probs[i];
      if (r <= cumulative) return i;
    }
    return probs.length - 1;
  }
}

// Simulate reward (random 1–10)
function getReward() {
  return Math.floor(Math.random() * 10) + 1;
}

// Update display
function updateDisplay(chosenIndex, reward) {
  roundCount++;
  rewards[chosenIndex] += reward;
  picks[chosenIndex]++;

  const modeText = modeSelect.value === "greedy"
    ? "Greedy Algorithm (rule-based)"
    : "Learning AI (trial & error)";

  roundDisplay.textContent = `Round: ${roundCount} | Mode: ${modeText}`;

  rewardDisplay.innerHTML = stocks.map((s, i) =>
    `${s}: ${rewards[i]} pts`
  ).join(" | ");

  updateChart();
}

// --------------- Chart ---------------
let chart;
function initChart() {
  const ctx = document.getElementById('rewardChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stocks,
      datasets: [{
        label: 'Rewards',
        data: rewards,
        backgroundColor: ['#f1c40f','#e67e22','#1abc9c','#3498db']
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      animation: { duration: 300 }
    }
  });
}

function updateChart() {
  chart.data.datasets[0].data = rewards;
  chart.update();
}

// --------------- Simulation Control ---------------
function runAIStep() {
  const chosen = pickStock();
  const reward = getReward();
  updateDisplay(chosen, reward);
}

function startSimulation() {
  if (!running) {
    running = true;
    interval = setInterval(runAIStep, 1000); // 1 second per round
  }
}

function stopSimulation() {
  running = false;
  clearInterval(interval);
}

function resetSimulation() {
  stopSimulation();
  rewards = [0, 0, 0, 0];
  picks = [0, 0, 0, 0];
  roundCount = 0;
  updateChart();
  roundDisplay.textContent = 'Round: 0';
  rewardDisplay.textContent = stocks.map(s => `${s}: 0 pts`).join(" | ");
}

// --------------- Event Listeners ---------------
startBtn.addEventListener('click', startSimulation);
stopBtn.addEventListener('click', stopSimulation);
resetBtn.addEventListener('click', resetSimulation);

// Initialize chart on page load
window.onload = () => {
  initChart();
  resetSimulation();
};
