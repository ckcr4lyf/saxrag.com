const AMEX_POINTS_PER_MILE = 18000 / 1000;
const HSBC_RC_PER_MILE_REGULAR  = 0.1;
const HSBC_RC_PER_MILE_EVERYMILE = 0.05;

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
        pointsPerDollar: 5,
        pointsPerMile: AMEX_POINTS_PER_MILE,
        comments: '',
    },
    {
        cardName: 'AMEX Explorer',
        subcategory: 'FX Transactions',
        pointsPerDollar: 10.75,
        pointsPerMile: AMEX_POINTS_PER_MILE,
        comments: 'Limited to HK$10,000 per quarter',
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
        td.innerText = card.subcategory;
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