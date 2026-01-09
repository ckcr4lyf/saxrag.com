// Use current timestamp to avoid caching (especially for access-control-allow-origin)
const TS = Date.now();

/**
 * @typedef {Object} AvailabilityEntry
 * @property {string} date - Date in YYYYMMDD format (e.g., "20260401")
 * @property {'H'|'L'|'NA'} availability - Availability status (e.g., "H" (High), "L" (Low), "NA" (Not Available))
 */

/**
 * @typedef {Object} Availabilities
 * @property {string} updateTime - Update time in "YYYY-MM-DD HH:mm:ss" format
 * @property {AvailabilityEntry[]} std - Standard availability entries
 * @property {any[]} pt1 - unknown
 * @property {any[]} pt2 - unknown
 */

/**
 * @typedef {Object} AvailabilityResponse
 * @property {Availabilities} availabilities - Availability data
 */

/**
 * Request availability from Cathay Pacific API
 * @param {string} origin - Origin airport code (e.g., "BKK")
 * @param {string} destination - Destination airport code (e.g., "HKG")
 * @param {'eco'|'pey'|'bus'|'fir'} cabinClass - Cabin class (e.g., "eco" for economy)
 * @param {string} startDate - Start date in YYYYMMDD format (e.g., "20260401")
 * @param {string} endDate - End date in YYYYMMDD format (e.g., "20260420")
 * @returns {Promise<AvailabilityResponse | string>} Promise that resolves to the availability data
 */
async function requestAvailability(origin, destination, cabinClass, startDate, endDate) {
  const url = `https://api.cathaypacific.com/afr/search/availability/en.${origin}.${destination}.${cabinClass}.CX.1.${startDate}.${endDate}.json?ts=${TS}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching availability:', error);
    return error.message;
  }
}

/**
 * @typedef {Object} AvailabilityTableEntry
 * @property {string} route - Route (e.g., "HKG-LON")
 * @property {string} cabinClass - Cabin class (e.g., "eco" for economy)
 * @property {AvailabilityEntry[]} availability - Availability data
 * @property {string} updateTime - Update time in "YYYY-MM-DD HH:mm:ss" format
 */

/**
 * Render availability data in a table
 * @param {AvailabilityTableEntry[]} data - Availability data
 * @returns {void}
 */
function renderAvailabilityTable(data) {
  const table = document.querySelector('#availability-table');
  table.innerHTML = '';

  // Render <th> with dates fronm the first entry's availability
  const thead = document.createElement('thead');
  thead.innerHTML = `
  <tr>
    <th>Route</th>
    <th>Cabin Class</th>
    ${data[0].availability.map(a => `<th>${a.date.slice(0, 4)}-${a.date.slice(4, 6)}-${a.date.slice(6, 8)}</th>`).join('')}
    <th>Update Time (on CX Backend) (HKT)</th>
  </tr>
  `;
  table.appendChild(thead);

  for (const entry of data) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.route}</td>
      <td>${entry.cabinClass}</td>
      ${entry.availability.map(a => `<td class="${a.availability}">${a.availability}</td>`).join('')}
      <td>${entry.updateTime}</td>
      </tr>
    `;
    table.appendChild(row);
  }
}

/**
 * Main function to fetch and render availability data
 * @returns {void}
 */
async function main() {
  const startDate = '20260401';
  const endDate = '20260414';
  const routes = [
    {
      origin: 'HKG',
      destination: 'BKK',
      cabinClass: 'eco',
    },
    {
      origin: 'HKG',
      destination: 'CTS',
      cabinClass: 'eco',
    },
    {
      origin: 'HKG',
      destination: 'HAN',
      cabinClass: 'eco',
    },
  ]
  const dataPromises = [];
  const data = [];

  
  for (const route of routes) {
    const availability1 = await requestAvailability(route.origin, route.destination, route.cabinClass, startDate, endDate);
    const availability2 = await requestAvailability(route.destination, route.origin, route.cabinClass, startDate, endDate);
    data.push(availability1);
    data.push(availability2);
    partialRender(routes, data);
  }


}

/**
 * @typedef {Object} RouteQuery
 * @property {string} origin - Origin airport code (e.g., "HKG")
 * @property {string} destination - Destination airport code (e.g., "BKK")
 * @property {string} cabinClass - Cabin class (e.g., "eco" for economy)
 */

/**
 * Partial render of the availability data
 * @param {RouteQuery[]} routes - Routes data
 * @param {AvailabilityResponse[]} data - Availability data
 * @returns {void}
 */
const partialRender = (routes, data) => {
  const tableData = [];
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === 'string') {
      continue;
    }
    const route = routes[Math.floor(i / 2)];
    const routeColumn = i % 2 == 0 ? `${route.origin}-${route.destination}` : `${route.destination}-${route.origin}`;
    tableData.push({
      route: routeColumn,
      cabinClass: route.cabinClass,
      availability: data[i].availabilities.std.map(a => ({
        date: a.date,
        availability: a.availability,
      })),
      updateTime: data[i].availabilities.updateTime,
    });
  }
  renderAvailabilityTable(tableData);
}