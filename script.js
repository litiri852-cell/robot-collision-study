let myChart = null;

async function loadData() {
    const response = await fetch('data.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    
    const parsedData = { 'wooden floor': [], 'yoga mat': [] };
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length === 3) {
            const delay = columns[0].trim();
            const surface = columns[1].trim();
            const distance = parseFloat(columns[2].trim());

            if (parsedData[surface]) {
                parsedData[surface].push(distance);
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${delay} ms</td><td>${surface}</td><td>${distance} cm</td>`;
            tbody.appendChild(tr);
        }
    });
    return parsedData;
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
            scales: { y: { beginAtZero: true, max: 30 } }
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
