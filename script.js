const chests = ["🗝️ Chest A", "🗝️ Chest B", "🗝️ Chest C", "🗝️ Chest D"];
let rewards = [0, 0, 0, 0];
let roundCount = 0;
let intervalId;

const output = document.getElementById("output");
const probDisplay = document.getElementById("probabilities");
const roundDisplay = document.getElementById("round");

// Chart.js setup
const ctx = document.getElementById('rewardChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chests,
        datasets: [{
            label: 'Rewards',
            data: rewards,
            backgroundColor: ['#f1c40f','#e67e22','#1abc9c','#3498db']
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw} pts`;
                    }
                }
            }
        }
    }
});

// Softmax function for probabilities
function softmax(arr, temperature = 5) {
    const expVals = arr.map(x => Math.exp(x / temperature));
    const sumExp = expVals.reduce((a,b) => a+b,0);
    return expVals.map(x => x/sumExp);
}

// Choose chest based on probability distribution
function chooseChest(probs) {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probs.length; i++) {
        cumulative += probs[i];
        if (r <= cumulative) return i;
    }
    return probs.length -1; // fallback
}

function runAIStep() {
    roundCount++;
    roundDisplay.textContent = `Round: ${roundCount}`;

    // Compute softmax probabilities
    const temperature = 5; // higher = more exploration
    const probs = softmax(rewards, temperature);

    // Pick a chest based on probabilities
    const chosenIndex = chooseChest(probs);

    // Assign reward
    const reward = Math.floor(Math.random() * 10 + 1);
    rewards[chosenIndex] += reward;

    // Update text
    output.innerHTML = `AI chose <b>${chests[chosenIndex]}</b> and earned <b>${reward}</b> points!<br>
        Current rewards: ${chests.map((c,i)=>`${c}: ${rewards[i]} pts`).join(" | ")}`;

    probDisplay.innerHTML = `Probabilities: ${chests.map((c,i)=>`${c}: ${(probs[i]*100).toFixed(1)}%`).join(" | ")}`;

    // Update chart
    chart.data.datasets[0].data = rewards;
    chart.update();
}

// Buttons
document.getElementById("runAI").addEventListener("click", () => {
    if (!intervalId) intervalId = setInterval(runAIStep, 1000);
});
document.getElementById("stopAI").addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
});
document.getElementById("resetAI").addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    rewards = [0,0,0,0];
    roundCount = 0;
    roundDisplay.textContent = `Round: 0`;
    output.innerHTML = '';
    probDisplay.innerHTML = '';
    chart.data.datasets[0].data = rewards;
    chart.update();
});
