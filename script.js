const options = ["🍎 Apple", "🍌 Banana", "🍇 Grape"];
let rewards = [0, 0, 0]; // reward points
let probabilities = [0.33, 0.33, 0.34];

const output = document.getElementById("output");
const button = document.getElementById("runAI");

function chooseOption() {
  // Choose randomly based on probabilities
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

  // Simulate reward
  let reward = Math.floor(Math.random() * 10 + 1); // 1-10 points
  rewards[chosenIndex] += reward;

  // Update probabilities (AI “learning”)
  const total = rewards.reduce((a,b) => a+b, 0);
  probabilities = rewards.map(r => r/total || 1/options.length);

  // Show output
  output.innerHTML = `
    AI chose: <b>${options[chosenIndex]}</b> and earned ${reward} points!<br>
    Current rewards: ${options.map((opt, i) => `${opt}: ${rewards[i]} pts`).join(" | ")}
  `;
}

button.addEventListener("click", chooseOption);
