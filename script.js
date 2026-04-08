// --------------- Variables ---------------
const stocks = ["Stock 1", "Stock 2", "Stock 3", "Stock 4"];
let rewards = [0, 0, 0, 0];
let roundCount = 0;
let running = false;
let interval;

// Hidden true values for each stock (unknown to AI)
const trueValues = [4, 25, 3, 5]; // can adjust numbers for each stock

// --------------- DOM Elements ---------------
const modeSelect = document.getElementById("mode");
const roundDisplay = document.getElementById("roundDisplay");
const rewardDisplay = document.getElementById("rewardDisplay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

// --------------- Helper Functions ---------------

// Softmax function for probabilistic selection
function softmax(values, temperature = 1) {
  const exps = values.map(v => Math.exp(v / temperature));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExps);
}

// Pick a stock based on mode
function pickStock() {
  const mode = modeSelect.value;

  if (mode === "greedy") {
    // Pick the stock with the highest reward so far
    let maxReward = Math.max(...rewards);
    const candidates = rewards
      .map((r, i) => r === maxReward ? i : -1)
      .filter(i => i !== -1);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Learning AI (epsilon-greedy)
  const epsilon = 0.75; // probability to explore
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * stocks.length); // explore randomly
  } else {
    const probs = softmax(rewards, 2); // probabilistic choice based on rewards
    let r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probs.length; i++) {
      cumulative += probs[i];
      if (r <= cumulative) return i;
    }
    return stocks.length - 1; // fallback
  }
}

// Simulate reward based on hidden true value + some randomness
function getReward(index) {
  // Small random variation to simulate real-world stock fluctuations
  const reward = Math.floor(trueValues[index] + Math.random() * 4 - 2);
  return Math.max(reward, 0); // never negative
}

// Update display and chart
function updateDisplay(chosenIndex, reward) {
  roundCount++;
  rewards[chosenIndex] += reward;

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
  const reward = getReward(chosen);
  updateDisplay(chosen, reward);
}

function startSimulation() {
  if (!running) {
    running = true;
    interval = setInterval(runAIStep, 500); // change 500 to slower/faster
  }
}

function stopSimulation() {
  running = false;
  clearInterval(interval);
}

function resetSimulation() {
  stopSimulation();
  rewards = [0, 0, 0, 0];
  roundCount = 0;
  updateChart();
  roundDisplay.textContent = 'Round: 0';
  rewardDisplay.textContent = stocks.map(s => `${s}: 0 pts`).join(" | ");
}

// --------------- Event Listeners ---------------
startBtn.addEventListener('click', startSimulation);
stopBtn.addEventListener('click', stopSimulation);
resetBtn.addEventListener('click', resetSimulation);

// --------------- Initialize ---------------
window.onload = () => {
  initChart();
  resetSimulation();
};
