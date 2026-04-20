// HKIA API
// GET https://www.hongkongairport.com/flightinfo-rest/rest/flights/past?date=YYYY-MM-DD&arrival=false&lang=en&cargo=false
// Date is YYYY-MM-DD format

async function getFlightHistory(flightNo) {
  const container = document.getElementById('gate-history');
  if (!flightNo) {
    container.innerHTML = '<p>Please enter a flight number</p>';
    return;
  }

  container.innerHTML = '<p>Searching...</p>';

  const results = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    try {
      const proxy = 'https://corsproxy.io/?';
      const apiUrl = `https://www.hongkongairport.com/flightinfo-rest/rest/flights/past?date=${dateStr}&arrival=false&lang=en&cargo=false`;
      const resp = await fetch(proxy + encodeURIComponent(apiUrl));
      const data = await resp.json();

      for (const day of data) {
        for (const flight of day.list) {
          const matched = flight.flight.some(f => f.no.replace(' ', '') === flightNo.replace(' ', ''));
          if (matched) {
            results.push({
              date: day.date,
              time: flight.time,
              status: flight.status,
              gate: flight.gate,
              terminal: flight.terminal,
              destination: flight.destination.join(', ')
            });
          }
        }
      }
    } catch (e) {
      console.error(`Error fetching ${dateStr}:`, e);
    }
  }

  if (results.length === 0) {
    container.innerHTML = `<p>No flights found for ${flightNo} in the last 30 days</p>`;
    return;
  }

  results.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

  let html = `<h2>Flight ${flightNo} - Last 30 Days</h2>`;
  html += '<table><thead><tr><th>Date</th><th>Time</th><th>Destination</th><th>Terminal</th><th>Gate</th><th>Status</th></tr></thead><tbody>';

  for (const r of results) {
    html += `<tr>
      <td>${r.date}</td>
      <td>${r.time}</td>
      <td>${r.destination}</td>
      <td>${r.terminal}</td>
      <td>${r.gate}</td>
      <td>${r.status}</td>
    </tr>`;
  }

  html += '</tbody></table>';

  const gateCounts = {};
  for (const r of results) {
    gateCounts[r.gate] = (gateCounts[r.gate] || 0) + 1;
  }
  const topGates = Object.entries(gateCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  html += '<h3>Top 5 Gates</h3><ul>';
  for (const [gate, count] of topGates) {
    html += `<li>Gate ${gate}: ${count} flights</li>`;
  }
  html += '</ul>';

  container.innerHTML = html;
}
