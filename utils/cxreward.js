// Use current timestamp to avoid caching (especially for access-control-allow-origin)
const TS = Date.now();

const CXREWARD_STORAGE_KEY = 'cxreward-routes';
const CXREWARD_STORAGE_KEY_START = 'cxreward-startDate';
const CXREWARD_STORAGE_KEY_END = 'cxreward-endDate';

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(CXREWARD_STORAGE_KEY);
  if (saved) {
    const textarea = document.querySelector('#routes');
    if (textarea) textarea.value = saved;
  }
  const savedStart = localStorage.getItem(CXREWARD_STORAGE_KEY_START);
  if (savedStart) {
    const el = document.querySelector('#startDate');
    if (el) el.value = savedStart;
  }
  const savedEnd = localStorage.getItem(CXREWARD_STORAGE_KEY_END);
  if (savedEnd) {
    const el = document.querySelector('#endDate');
    if (el) el.value = savedEnd;
  }
});

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
 * Request search options (miles required) for a route pair
 * @param {string} origin - Origin airport code
 * @param {string} destination - Destination airport code
 * @returns {Promise<Record<string,number>|null>} milesRequired by cabin class, or null on error
 */
async function requestSearchOptions(origin, destination) {
  const url = `https://api.cathaypacific.com/afr/searchpanel/searchoptions/en.${origin}.${destination}.rt.std.CX.json?ts=${TS}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.milesRequired ?? null;
  } catch (error) {
    console.error('Error fetching search options:', error);
    return null;
  }
}

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
    <th>Miles</th>
    ${data[0].availability.map(a => `<th>${a.date.slice(0, 4)}-${a.date.slice(4, 6)}-${a.date.slice(6, 8)}</th>`).join('')}
    <th>Update Time (on CX Backend) (HKT)</th>
  </tr>
  `;
  table.appendChild(thead);

  const colCount = 4 + data[0].availability.length;
  let lastGroup = -1;

  for (const entry of data) {
    if (entry.groupIndex !== lastGroup && lastGroup >= 0) {
      const sep = document.createElement('tr');
      sep.innerHTML = `<td colspan="${colCount}"></td>`;
      sep.className = 'route-separator';
      table.appendChild(sep);
    }
    lastGroup = entry.groupIndex;

    const milesDisplay = entry.milesRequired != null ? entry.milesRequired.toLocaleString() : '–';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.route}</td>
      <td>${entry.cabinClass}</td>
      <td>${milesDisplay}</td>
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
  const routesEl = document.querySelector('#routes');
  if (routesEl) localStorage.setItem(CXREWARD_STORAGE_KEY, routesEl.value);
  const startDateEl = document.querySelector('#startDate');
  const endDateEl = document.querySelector('#endDate');
  if (startDateEl) localStorage.setItem(CXREWARD_STORAGE_KEY_START, startDateEl.value);
  if (endDateEl) localStorage.setItem(CXREWARD_STORAGE_KEY_END, endDateEl.value);

  const startDate = startDateEl?.value ?? '';
  const endDate = endDateEl?.value ?? '';
  const autoReturn = document.querySelector('#autoReturn').checked;
  const routes = document.querySelector('#routes').value.split('\n').map(route => {
    const [origin, destination, ...cabinClasses] = route.split(',');
    let innerRoutes = [];

    for (const cabinClass of cabinClasses) {
      innerRoutes.push({
        origin,
        destination,
        cabinClass,
      });

      if (autoReturn) {
        innerRoutes.push({
          origin: destination,
          destination: origin,
          cabinClass,
        });
      }
    }

    return innerRoutes;
  });

  const flattenedRoutes = routes.flatMap((innerRoutes, groupIndex) =>
    innerRoutes.map(r => ({ ...r, groupIndex }))
  );

  const uniquePairs = [...new Set(flattenedRoutes.map(r => `${r.origin}-${r.destination}`))];
  const milesMap = {};
  await Promise.all(uniquePairs.map(async (pair) => {
    const [origin, destination] = pair.split('-');
    const milesRequired = await requestSearchOptions(origin, destination);
    milesMap[pair] = milesRequired;
  }));

  const data = [];
  for (const route of flattenedRoutes) {
    const availability = await requestAvailability(route.origin, route.destination, route.cabinClass, startDate, endDate);
    data.push(availability);
    partialRender(flattenedRoutes, data, milesMap);
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
 * @param {Record<string,Record<string,number>>} milesMap - Miles required by route pair and cabin class
 * @returns {void}
 */
const partialRender = (routes, data, milesMap = {}) => {
  const tableData = [];
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === 'string') {
      continue;
    }
    const route = routes[i];
    const routeColumn = `${route.origin}-${route.destination}`;
    const miles = milesMap[routeColumn]?.[route.cabinClass];
    tableData.push({
      route: routeColumn,
      cabinClass: route.cabinClass,
      milesRequired: miles,
      groupIndex: route.groupIndex,
      availability: data[i].availabilities.std.map(a => ({
        date: a.date,
        availability: a.availability,
      })),
      updateTime: data[i].availabilities.updateTime,
    });
  }
  renderAvailabilityTable(tableData);
}