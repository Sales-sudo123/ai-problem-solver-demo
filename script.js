const chests = ["🗝️ Chest A", "🗝️ Chest B", "🗝️ Chest C", "🗝️ Chest D"];
let rewards = [0, 0, 0, 0];
let probabilities = [0.25, 0.25, 0.25, 0.25];
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

function runAIStep() {
    roundCount++;
    roundDisplay.textContent = `Round: ${roundCount}`;

    const epsilon = 0.2; // 20% chance to explore randomly
    let chosenIndex;

    if (Math.random() < epsilon) {
        // Explore: pick a random chest
        chosenIndex = Math.floor(Math.random() * chests.length);
    } else {
        // Exploit: pick chest with highest rewards
        let maxReward = Math.max(...rewards);
        const candidates = rewards.map((r,i) => r === maxReward ? i : -1).filter(i => i !== -1);
        chosenIndex = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Reward for chosen chest
    let reward = Math.floor(Math.random() * 10 + 1);
    rewards[chosenIndex] += reward;

    // Update probabilities for display only
    const total = rewards.reduce((a,b)=>a+b,0);
    probabilities = rewards.map(r => total ? r/total : 0.25);

    // Update text output
    output.innerHTML = `AI chose <b>${chests[chosenIndex]}</b> and earned <b>${reward}</b> points!<br>
    Current rewards: ${chests.map((c,i)=>`${c}: ${rewards[i]} pts`).join(" | ")}`;

    probDisplay.innerHTML = `Probabilities: ${chests.map((c,i)=>`${c}: ${(probabilities[i]*100).toFixed(1)}%`).join(" | ")}`;

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
    probabilities = [0.25,0.25,0.25,0.25];
    roundCount = 0;
    roundDisplay.textContent = `Round: 0`;
    output.innerHTML = '';
    probDisplay.innerHTML = '';
    chart.data.datasets[0].data = rewards;
    chart.update();
});
