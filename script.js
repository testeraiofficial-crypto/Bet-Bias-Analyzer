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

// Tambahkan variabel selector untuk input RTP baru
const rtpInput = document.getElementById('rtp-input');

function updateSimulation() {
    const s0 = parseFloat(s0Input.value) || 0;
    const v = parseFloat(vInput.value) || 0;
    const g = parseFloat(gInput.value) || 0;
    
    // Ambil nilai RTP dari input bebas, lalu ubah ke desimal (misal 96 -> 0.96)
    let rtpValue = parseFloat(rtpInput.value) || 0;
    let rtpDecimal = rtpValue / 100;

    // Update Label Turnover (V)
    document.getElementById('v-val').innerText = formatRupiah(v);
    
    // Update Deskripsi G (Sama seperti sebelumnya)
    const labels = ["Disiplin (Bot)", "Rasional", "Mulai Panas", "Agresif", "Emosional (Tilt)", "Panic Chasing", "Total Ruin"];
    document.getElementById('g-desc').innerText = labels[Math.floor(g * (labels.length - 1))];

    // RUMUS UTAMA: St = S0 + [V * (RTP - 1)] * (1 + G)
    const st = s0 + (v * (rtpDecimal - 1)) * (1 + g);
    const finalSt = Math.max(0, st);

    // Update Tampilan Angka Saldo Akhir
    finalBalanceText.innerText = formatRupiah(finalSt);
    
    // Hitung Selisih (Loss)
    const loss = s0 - finalSt;
    lossImpactText.innerText = `Estimasi Penurunan: -${formatRupiah(loss)}`;

    // Update Grafik dengan RTP baru
    updateChart(s0, v, g, rtpDecimal);
}

// Tambahkan event listener agar saat angka RTP diketik, grafik langsung berubah
rtpInput.addEventListener('input', updateSimulation);

// Update fungsi updateChart agar menerima rtpDecimal sebagai parameter
function updateChart(s0, v, g, rtpDecimal) {
    const dataPoints = [];
    const labels = [];
    for (let i = 0; i <= 5; i++) {
        const partialV = (v / 5) * i;
        const res = s0 + (partialV * (rtpDecimal - 1)) * (1 + g);
        dataPoints.push(Math.max(0, res));
        labels.push((partialV / 1000000).toFixed(1) + "M");
    }
    chart.data.labels = labels;
    chart.data.datasets[0].data = dataPoints;
    chart.update();
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
