let myChart = null;

async function loadData() {
    const response = await fetch('data.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    
    const chartData = {
        'wooden floor': { '10': [], '50': [], '100': [], '200': [], '500': [] },
        'yoga mat': { '10': [], '50': [], '100': [], '200': [], '500': [] }
    };

    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    rows.forEach(row => {
        if (!row.trim()) return;
        const columns = row.split(',');
        if (columns.length >= 4) {
            const delay = columns[0].trim();
            const power = columns[1].trim();
            const surface = columns[2].trim();
            const distance = parseFloat(columns[3].trim());

            // 收集数据用来计算平均值
            if (chartData[surface] && chartData[surface][delay]) {
                chartData[surface][delay].push(distance);
            }

            // 在网页上渲染完整的120行数据表
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${delay} ms</td><td>${power}</td><td>${surface}</td><td>${distance} cm</td>`;
            tbody.appendChild(tr);
        }
    });

    // 自动计算两种地板在不同延迟下的平均距离
    const avgData = { 'wooden floor': [], 'yoga mat': [] };
    const delays = ['10', '50', '100', '200', '500'];
    
    ['wooden floor', 'yoga mat'].forEach(surf => {
        delays.forEach(d => {
            const arr = chartData[surf][d];
            const avg = arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
            avgData[surf].push(parseFloat(avg));
        });
    });

    return avgData;
}

async function createChart() {
    const dataObj = await loadData();
    const ctx = document.getElementById('myChart').getContext('2d');
    const surfaceSelect = document.getElementById('surfaceSelect');

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['10 ms', '50 ms', '100 ms', '200 ms', '500 ms'],
            datasets: [{
                label: 'Average Distance to Wall (cm)',
                data: dataObj['wooden floor'],
                backgroundColor: '#85c1e9',
                borderColor: '#3498db',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 25 } }
        }
    });

    surfaceSelect.addEventListener('change', function() {
        const selectedSurface = this.value;
        myChart.data.datasets[0].data = dataObj[selectedSurface];
        if (selectedSurface === 'yoga mat') {
            myChart.data.datasets[0].backgroundColor = '#f5b041';
            myChart.data.datasets[0].borderColor = '#f39c12';
        } else {
            myChart.data.datasets[0].backgroundColor = '#85c1e9';
            myChart.data.datasets[0].borderColor = '#3498db';
        }
        myChart.update();
    });
}
createChart();
