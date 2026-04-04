const chests = ["🗝️ Chest A", "🗝️ Chest B", "🗝️ Chest C", "🗝️ Chest D"];
let rewards = [0, 0, 0, 0]; // cumulative points
let probabilities = [0.25, 0.25, 0.25, 0.25]; // initial equal chance
let roundCount = 0;

const output = document.getElementById("output");
const probDisplay = document.getElementById("probabilities");
const roundDisplay = document.getElementById("round");
const button = document.getElementById("runAI");

function runAI() {
  roundCount++;
  roundDisplay.textContent = `Round: ${roundCount}`;

  // AI chooses a chest based on probabilities
  let rand = Math.random();
  let sum = 0;
  let chosenIndex = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (rand <= sum) {
      chosenIndex = i;
      break;
    }
  }

  // Simulate reward for chosen chest
  let reward = Math.floor(Math.random() * 10 + 1); // 1-10 points
  rewards[chosenIndex] += reward;

  // Update probabilities to simulate learning
  const total = rewards.reduce((a, b) => a + b, 0);
  probabilities = rewards.map(r => r / total || 0.25);

  // Display output
  output.innerHTML = `AI chose <b>${chests[chosenIndex]}</b> and earned <b>${reward}</b> points!<br>
  Current rewards: ${chests.map((c, i) => `${c}: ${rewards[i]} pts`).join(" | ")}`;

  probDisplay.innerHTML = `Current probabilities: ${chests.map((c, i) => `${c}: ${(probabilities[i]*100).toFixed(1)}%`).join(" | ")}`;
}

button.addEventListener("click", runAI);
