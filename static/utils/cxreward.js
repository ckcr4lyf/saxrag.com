// Use current timestamp to avoid caching (especially for access-control-allow-origin)
const TS = Date.now();

const FARE_CABIN_MAP = {
  eco: 'Y',
  pey: 'W',
  bus: 'J',
  fir: 'F'
};

const CXREWARD_STORAGE_KEY = 'cxreward-routes';
const CXREWARD_STORAGE_KEY_START = 'cxreward-startDate';
const CXREWARD_STORAGE_KEY_END = 'cxreward-endDate';

/**
 * Random delay between 300-400ms
 * @returns {Promise<void>}
 */
function randomDelay() {
  const ms = 300 + Math.random() * 100;
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  const url = `https://api.cathaypacific.com/afr/searchpanel/searchoptions/en.${origin}.${destination}.ow.std.CX.json?ts=${TS}`;
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
 * Request fare data from Cathay Pacific histogram API
 * @param {string} origin - Origin airport code
 * @param {string} destination - Destination airport code
 * @param {string} month - Month as a number string (e.g., "6")
 * @param {string} cabinClass - Cabin class for fare API (e.g., "Y")
 * @param {string} [tripType='R'] - Trip type ('R' for return, 'O' for one-way)
 * @returns {Promise<Array|null>} Fare data array, or null on error
 */
async function requestFareData(origin, destination, month, cabinClass, tripType = 'R') {
  const url = `https://book.cathaypacific.com/CathayPacificV3/dyn/air/api/instant/histogram?ORIGIN=${origin}&DESTINATION=${destination}&LANGUAGE=GB&SITE=CBEUCBEU&TYPE=DAY&MONTH=${month}&CABIN=${cabinClass}&TRIP_TYPE=${tripType}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching fare data:', error);
    return null;
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
 * @param {Object} fareMap - Fare data map keyed by "route-cabinClass" with date-keyed fare entries
 * @returns {void}
 */
function renderAvailabilityTable(data, fareMap = {}) {
  const table = document.querySelector('#availability-table');
  table.innerHTML = '';

  const thead = document.createElement('thead');
  thead.innerHTML = `
  <tr>
    <th>Route</th>
    <th>Cabin Class</th>
    <th>Miles</th>
    <th>Avg Tax (RT)</th>
    <th>Avg Tax (OW)</th>
    ${data[0].availability.map(a => `<th>${a.date.slice(0, 4)}-${a.date.slice(4, 6)}-${a.date.slice(6, 8)}</th>`).join('')}
    <th>Update Time (on CX Backend) (HKT)</th>
  </tr>
  `;
  table.appendChild(thead);

  const colCount = 6 + data[0].availability.length;
  let lastGroup = -1;

  for (const entry of data) {
    if (entry.groupIndex !== lastGroup && lastGroup >= 0) {
      const sep = document.createElement('tr');
      sep.innerHTML = `<td colspan="${colCount}"></td>`;
      sep.className = 'route-separator';
      table.appendChild(sep);
    }
    lastGroup = entry.groupIndex;

    const fareKey = `${entry.route}-${entry.cabinClass}`;
    const fareInfo = fareMap[fareKey] || {};
    const fareDates = fareInfo._dates || {};
    const fareDatesOW = fareInfo._dates_oneway || {};
    const currency = fareInfo.currency || '';
    const taxValues = Object.values(fareDates).map(f => f.tax).filter(t => t != null);
    const avgTax = taxValues.length > 0
      ? `${(taxValues.reduce((a, b) => a + b, 0) / taxValues.length).toFixed(0)} (${currency})`
      : '–';
    const taxValuesOW = Object.values(fareDatesOW).map(f => f.tax).filter(t => t != null);
    const avgTaxOW = taxValuesOW.length > 0
      ? `${(taxValuesOW.reduce((a, b) => a + b, 0) / taxValuesOW.length).toFixed(0)} (${currency})`
      : '–';

    const milesDisplay = entry.milesRequired != null ? entry.milesRequired.toLocaleString() : '–';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.route}</td>
      <td>${entry.cabinClass}</td>
      <td>${milesDisplay}</td>
      <td>${avgTax}</td>
      <td>${avgTaxOW}</td>
      ${entry.availability.map(a => {
        const dateStr = `${a.date.slice(0, 4)}-${a.date.slice(4, 6)}-${a.date.slice(6, 8)}`;
        const fareEntry = fareDates[a.date];
        const fareEntryOW = fareDatesOW[a.date];
        let title = `Route: ${entry.route}\nClass: ${entry.cabinClass}\nDate: ${dateStr}\nMiles: ${milesDisplay}`;
        if (fareEntry) {
          title += `\nBase Fare (RT): ${fareEntry.base_fare} ${currency}\nTax (RT): ${fareEntry.tax} ${currency}`;
          if (entry.milesRequired) {
            const vpm = (fareEntry.base_fare / entry.milesRequired).toFixed(4);
            title += `\nValue/Mile (RT): ${vpm} ${currency}`;
          }
        }
        if (fareEntryOW) {
          title += `\nBase Fare (OW): ${fareEntryOW.base_fare} ${currency}\nTax (OW): ${fareEntryOW.tax} ${currency}`;
          if (entry.milesRequired) {
            const vpmOW = (fareEntryOW.base_fare / entry.milesRequired).toFixed(4);
            title += `\nValue/Mile (OW): ${vpmOW} ${currency}`;
          }
        }
        return `<td class="${a.availability}" title="${title.replace(/"/g, '&quot;')}">${a.availability}</td>`;
      }).join('')}
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
  for (const pair of uniquePairs) {
    const [origin, destination] = pair.split('-');
    const milesRequired = await requestSearchOptions(origin, destination);
    milesMap[pair] = milesRequired;
    await randomDelay();
  }

  const data = [];
  const month = startDate.slice(4, 6);
  const fareMap = {};
  for (const pair of uniquePairs) {
    const [origin, destination] = pair.split('-');
    const cabinClasses = [...new Set(flattenedRoutes.filter(r => `${r.origin}-${r.destination}` === pair).map(r => r.cabinClass))];
    for (const cc of cabinClasses) {
      const fareCabin = FARE_CABIN_MAP[cc];
      if (!fareCabin) continue;
      const key = `${pair}-${cc}`;
      await randomDelay();
      const fareData = await requestFareData(origin, destination, month, fareCabin);
      if (fareData && fareData.length > 0) {
        fareMap[key] = { currency: fareData[0].currency, _dates: {} };
        for (const entry of fareData) {
          fareMap[key]._dates[entry.date_departure] = {
            base_fare: entry.base_fare,
            tax: entry.tax,
          };
        }
      }
      await randomDelay();
      const fareDataOW = await requestFareData(origin, destination, month, fareCabin, 'O');
      if (fareDataOW && fareDataOW.length > 0) {
        if (!fareMap[key]) fareMap[key] = { currency: fareDataOW[0].currency, _dates: {} };
        fareMap[key]._dates_oneway = {};
        for (const entry of fareDataOW) {
          fareMap[key]._dates_oneway[entry.date_departure] = {
            base_fare: entry.base_fare,
            tax: entry.tax,
          };
        }
      }
    }
  }

  for (const route of flattenedRoutes) {
    const availability = await requestAvailability(route.origin, route.destination, route.cabinClass, startDate, endDate);
    data.push(availability);
    partialRender(flattenedRoutes, data, milesMap, fareMap);
    await randomDelay();
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
 * @param {Object} fareMap - Fare data map keyed by "route-cabinClass" with date-keyed fare entries
 * @returns {void}
 */
const partialRender = (routes, data, milesMap = {}, fareMap = {}) => {
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
  renderAvailabilityTable(tableData, fareMap);
}