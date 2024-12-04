const AMEX_POINTS_PER_MILE = 18000 / 1000;
const HSBC_RC_PER_MILE_REGULAR  = 0.1;
const HSBC_RC_PER_MILE_EVERYMILE = 0.05;

const data = [
    {
        cardName: 'AMEX Explorer',
        subcategory: 'Regular HKD Spending',
        pointsPerDollar: 3,
        pointsPerMile: AMEX_POINTS_PER_MILE,
    }
];

const dataToUse = data.map(element => {
    return {
        ...element,
        dollarsPerMile: (element.pointsPerMile / element.pointsPerDollar),
    }
});

const renderTable = () => {
    const table = document.querySelector('#minmax');

    for (const card of dataToUse){
        const row = document.createElement('tr');

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
        td.innerText = card.dollarsPerMile;
        row.appendChild(td);

        td = document.createElement('td');
        td.innerText = "TODO";
        row.appendChild(td);

        // row.append(...[
        //     document.createElement('td').setHTMLUnsafe(card.subcategory)
        //     // document.createElement('td').innerText = card.subcategory,
        //     // document.createElement('td').innerText = card.pointsPerDollar.toString(),
        //     // document.createElement('td').innerText = card.pointsPerMile.toString(),
        //     // document.createElement('td').innerText = 'XD',
        // ]);

        table.append(row);
    }
}

