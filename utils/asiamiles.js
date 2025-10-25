const AMEX_POINTS_PER_MILE = 18000 / 1000;
const HSBC_RC_PER_MILE_REGULAR  = 0.1;
const HSBC_RC_PER_MILE_EVERYMILE = 0.05;
const CITI_PRESTIGE_POINTS_PER_MILE = 12;
const BOCHK_CHEERS_VISA_INFINITE_POINTS_PER_MILE = 15;
const MOX_MILES_PER_MILE = 1; // Mox doesnt seem to mention points, just HKD$4 = 1 Mile. So we assume HK$1 = 0.25 "Mox Points"

const data = [
    {
        cardName: 'AMEX Explorer',
        subcategory: 'Regular HKD Spending',
        pointsPerDollar: 3,
        pointsPerMile: AMEX_POINTS_PER_MILE,
        comments: '',
    },
    {
        cardName: 'AMEX Explorer',
        subcategory: '5X Merchants',
        link: 'https://www.americanexpress.com/en-hk/benefits/offers/dining/5x-offer/index.html',
        pointsPerDollar: 5,
        pointsPerMile: AMEX_POINTS_PER_MILE,
        comments: '',
    },
    {
        cardName: 'AMEX Explorer',
        subcategory: 'Online Travel & FX Transactions',
        link: 'https://www.americanexpress.com/en-hk/benefits/offers/travel/explorer-overseas-spend-offer/',
        pointsPerDollar: 10.75,
        pointsPerMile: AMEX_POINTS_PER_MILE,
        comments: 'Limited to HK$10,000 per quarter for Travel & FX separately ($10k each). Online Travel includes several airlines, trip.com etc.',
    },
    {
        cardName: 'AMEX Platinum',
        subcategory: 'FX / Everyday Merchants / Travel',
        link: 'https://www.americanexpress.com/en-hk/benefits/offers/shopping/platinum-membership-rewards-accelerator/',
        pointsPerDollar: 9,
        pointsPerMile: AMEX_POINTS_PER_MILE,
        comments: 'Limited to HK$15,000 per quarter for Everyday Merchants, Travel & FX separately ($15k each). Online Travel includes several airlines, agoda, booking.com, trip.com etc.',
    },
    {
        cardName: 'HSBC Red',
        subcategory: 'Online Transactions',
        pointsPerDollar: 0.04,
        pointsPerMile: HSBC_RC_PER_MILE_REGULAR,
        comments: 'Limited to HK$10,000 per calendar month',
    },
    {
        cardName: 'HSBC Visa Signature',
        subcategory: 'RHRYC',
        link: 'https://www.hsbc.com.hk/credit-cards/rewards/your-choice/',
        pointsPerDollar: 0.036,
        pointsPerMile: HSBC_RC_PER_MILE_REGULAR,
        comments: 'RHRYC can only be set once per calendar year',
    },
    {
        cardName: 'HSBC Cards (except EveryMile)',
        subcategory: 'Regular HKD Spending',
        pointsPerDollar: 0.004,
        pointsPerMile: HSBC_RC_PER_MILE_REGULAR,
    },
    {
        cardName: 'HSBC EveryMile',
        subcategory: 'Regular HKD Spending',
        pointsPerDollar: 0.01,
        pointsPerMile: HSBC_RC_PER_MILE_EVERYMILE,
    },
    {
        cardName: 'HSBC EveryMile',
        subcategory: 'Designated Merchants',
        pointsPerDollar: 0.025,
        pointsPerMile: HSBC_RC_PER_MILE_EVERYMILE,
        comments: 'Native Octopus might be better value for transit (see below)'
    },
    {
        cardName: 'Citi Prestige',
        subcategory: 'Local Spending',
        pointsPerDollar: 2,
        pointsPerMile: CITI_PRESTIGE_POINTS_PER_MILE,
        comments: ''
    },
    {
        cardName: 'Citi Prestige',
        subcategory: 'Overseas Spending',
        pointsPerDollar: 3,
        pointsPerMile: CITI_PRESTIGE_POINTS_PER_MILE,
        comments: ''
    },
    /**
     * - https://www.bochk.com/dam/boccreditcard/cheers_TnC_EN.pdf
     * - https://www.bochk.com/dam/boccreditcard/cheerscard_360/eng/index.html
     */
    {
        cardName: 'BoC Cheers Visa Infinite',
        subcategory: 'Dining and FX',
        pointsPerDollar: 10,
        pointsPerMile: BOCHK_CHEERS_VISA_INFINITE_POINTS_PER_MILE,
        comments: 'REQUIRES minimum monthly spend of HK$5000. Dining is capped at HK$10,000/mo (100k points), FX at HK$25,000 (250k points). BUT total points are capped at 300k/mo (20k miles)'
    },
    {
        cardName: 'Mox',
        subcategory: '',
        pointsPerDollar: 0.25,
        pointsPerMile: MOX_MILES_PER_MILE,
        comments: 'MUST maintain balance of HK$250,000 in Mox Account'
    }
];

const dataToUse = data.map(element => {
    return {
        ...element,
        dollarsPerMile: (element.pointsPerMile / element.pointsPerDollar),
    }
});

const renderTable = (value) => {
    const table = document.querySelector('#minmax');

    const dataRows = document.querySelectorAll('tr#dataRow');
    for (const dataRow of dataRows){
        dataRow.remove();
    }
    

    for (const card of dataToUse){
        const row = document.createElement('tr');
        row.setAttribute('id', 'dataRow')

        let td = document.createElement('td');
        td.innerText = card.cardName;
        row.appendChild(td);

        td = document.createElement('td');
        if (card.link !== undefined){
            const a = document.createElement('a');
            a.href = card.link;
            a.innerText = card.subcategory;
            td.appendChild(a);
        } else {
            td.innerText = card.subcategory;
        }
        row.appendChild(td);

        td = document.createElement('td');
        td.innerText = card.pointsPerDollar;
        row.appendChild(td);

        td = document.createElement('td');
        td.innerText = card.dollarsPerMile.toFixed(2);
        row.appendChild(td);

        td = document.createElement('td');
        td.innerText = `${((value / card.dollarsPerMile) * 100).toFixed(2)}%`;
        row.appendChild(td);

        td = document.createElement('td');
        td.innerText = card.comments || '';
        row.appendChild(td);

        table.append(row);
    }
}

const calculate = () => {
    const dollarCost = parseFloat(document.querySelector('input#cost').value);
    const milesCost = parseFloat(document.querySelector('input#miles').value);

    const mileValue = dollarCost / milesCost;
    document.querySelector('input#value').value = mileValue.toFixed(2);
    renderTable(mileValue);
}

document.addEventListener('DOMContentLoaded', function() {
   calculate();
});