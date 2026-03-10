let currentRTP = 0.96;
let chart;

const s0Input = document.getElementById('s0');
const vInput = document.getElementById('v');
const gInput = document.getElementById('g');
const finalBalanceText = document.getElementById('final-balance');
const lossImpactText = document.getElementById('loss-impact');

function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}

function updateSimulation() {
    const s0 = parseFloat(s0Input.value);
    const v = parseFloat(vInput.value);
    const g = parseFloat(gInput.value);
    
    // Update Label V
    document.getElementById('v-val').innerText = formatRupiah(v);
    
    // Update Label G
    const labels = ["Safe", "Rational", "Mild Tilt", "Aggressive", "Moderate Chase", "Panic", "Ruinous"];
    document.getElementById('g-desc').innerText = labels[Math.floor(g * (labels.length - 1))];

    // Rumus Utama
    const st = s0 + (v * (currentRTP - 1)) * (1 + g);
    const finalSt = Math.max(0, st);

    // Update UI
    finalBalanceText.innerText = formatRupiah(finalSt);
    const loss = s0 - finalSt;
    lossImpactText.innerText = `Loss: -${formatRupiah(loss)}`;

    updateChart(s0, v, g);
}

function setRTP(val) {
    currentRTP = val;
    document.querySelectorAll('.rtp-btn').forEach(btn => btn.classList.replace('bg-emerald-600', 'bg-slate-700'));
    event.target.classList.replace('bg-slate-700', 'bg-emerald-600');
    updateSimulation();
}

function initChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0, 1, 2, 3, 4, 5],
            datasets: [{
                label: 'Proyeksi Saldo',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function updateChart(s0, v, g) {
    const dataPoints = [];
    const labels = [];
    for (let i = 0; i <= 5; i++) {
        const partialV = (v / 5) * i;
        const res = s0 + (partialV * (currentRTP - 1)) * (1 + g);
        dataPoints.push(Math.max(0, res));
        labels.push((partialV / 1000000).toFixed(1) + "M");
    }
    chart.data.labels = labels;
    chart.data.datasets[0].data = dataPoints;
    chart.update();
}

// Listeners
[s0Input, vInput, gInput].forEach(el => el.addEventListener('input', updateSimulation));

// Init
initChart();
updateSimulation();
