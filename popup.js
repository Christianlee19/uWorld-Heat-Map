const { DateTime } = luxon;
const today = DateTime.local();


document.addEventListener('DOMContentLoaded', function() {
  const refreshButton = document.getElementById('refreshButton');

  refreshButton.addEventListener('click', function() {
    // chrome.tabs.reload();
    // console.log('Button clicked! Refreshing tab ...');
    chrome.runtime.reload();
    console.log('Reloading extension...');
  });
});


setTimeout(() => {
  console.log('loading popup.js')

  chrome.storage.local.get(['sumByDate'], function(data) {
    const rawData = data.sumByDate;

    if (rawData) {
    // Convert raw data to the desired format (YYYY-MM-DD)
    const sumByDateData = {};
    for (const date in rawData) {
      if (rawData.hasOwnProperty(date)) {
        const count = rawData[date];
        const formattedDate = new Date(date).toISOString().split('T')[0];
        sumByDateData[formattedDate] = count;
      }
    }

    // Convert raw data to the desired format (YYYY-MM-DD)
    console.log('Data retrieved from chrome.storage.local:', sumByDateData);
    const objectLength = Object.keys(sumByDateData).length;
    console.log("Object Length:", objectLength);

    // const testData = {
    //     '2023-12-01': 10,
    //     '2023-12-02': 20,
    //     '2023-12-03': 30,
    //     '2023-12-04': 40,
    //     '2023-12-05': 50,
    //     '2023-12-06': 90,
    //     '2023-12-07': 60,
    //     '2023-12-08': 40,
    //     '2023-12-10': 10,
    //     '2023-12-11': 70,
    //     '2023-12-13': 10,
    //     '2023-12-14': 40,
    //     '2023-12-15': 90,
    //     '2023-12-16': 90,
    //     '2023-12-17': 40,
    //     '2023-12-19': 50,
    //     '2023-12-21': 20,
    //     '2023-12-22': 30,
    //     '2023-12-23': 40,
    //     '2023-12-26': 10,
    //     '2023-12-27': 40,
    //     '2023-12-28': 40,
    //     '2023-12-29': 30,
    //     '2023-12-30': 60,
    //     '2024-01-01': 20,
    //     '2024-01-02': 70,
    //     '2024-01-03': 20,
    //     '2024-01-04': 10,
    //     '2024-01-05': 20,
    //     '2024-01-07': 40,
    //     '2024-01-09': 05,
    //     '2024-01-10': 20,
    //     '2024-01-11': 80,
    //     '2024-01-13': 60,
    //     '2024-01-14': 20,
    //     '2024-01-14': 80,
    //     '2024-01-16': 20,
    //     '2024-01-17': 60,
    //     '2024-01-18': 20,
    //     '2024-01-19': 25,
    //     '2024-01-12': 45,
    //     '2024-01-22': 10,
    //     '2024-01-23': 50,
    //     '2024-01-25': 15,
    //     '2024-01-26': 10,
    //     '2024-01-27': 40,
    //     '2024-01-28': 30,
    //     '2024-01-30': 30,
    //     '2024-01-31': 80,
    //     '2024-02-01': 50,
    //     '2024-02-02': 10,
    //     '2024-02-03': 40
    // };

    // Call functions
    generateHeatmap(sumByDateData);
    populateTable(sumByDateData);

    // Calculate and display the current streak
    const sortedData = Object.entries(sumByDateData).map(([date, count]) => ({
        date,
        count,
    }));

    // Sort the test data by date
    sortedData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });


    const currentStreak = calculateCurrentStreak(sortedData);
    updateStreakInfo(currentStreak);

    console.log('Current streak:', currentStreak);

    } else {
      console.log('No data found in chrome.storage.local for key "sumByDate".');
    }
  })
}, 1000); // Adjust the delay as needed



// Function to populate the table with data from the object
function populateTable(sumByDateData) {
  const table = document.querySelector("#dataTable tbody");

  // Clear any existing rows
  table.innerHTML = "";

  // Convert the sumByDateData object into an array of objects for sorting
  const sortedData = Object.entries(sumByDateData).map(([date, count]) => ({
    date,
    count,
  }));

  // Sort the data by date
  sortedData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  const last5Data = sortedData.slice(0, 5);


  // Iterate through the object and create table rows
  last5Data.forEach((item) => {
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    const countCell = document.createElement("td");

    dateCell.textContent = item.date;
    countCell.textContent = item.count;

    row.appendChild(dateCell);
    row.appendChild(countCell);
    table.appendChild(row);
  });
}


function generateHeatmap(sumByDateData) {
  const heatmapContainer = document.getElementById('heatmap-container');
  // const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  // const endDate = new Date(today);
  // endDate.setMonth(today.getMonth());
  console.log(today);
  const startDate = today.minus({ months: 2 }).startOf('month');
  const endDate = today.endOf('month');

  // Function to create a heatmap square
  const createHeatmapSquare = (date, count) => {
    const square = document.createElement('div');
    square.classList.add('heatmap-square');
    square.style.backgroundColor = `rgba(255, 0, 0, ${count / 20})`; // Adjust the color based on the count
    square.title = `${date}: ${count} questions`;

    if (date === today.toISODate()) {
        square.style.borderColor = 'black'; // You can change this color as needed
    }
    return square;
  };

  // Generate heatmap squares for each day in the date range
  let currentDate = startDate;

  while (currentDate <= endDate) {
      // Create a new row (div) for each month
      const monthContainer = document.createElement('div');
      monthContainer.classList.add('heatmap-month');
      heatmapContainer.appendChild(monthContainer);

      // Generate heatmap squares for the current month
      const currentMonth = currentDate.month;
      while (currentDate.month === currentMonth) {
        const dateString = currentDate.toISODate();
        const count = sumByDateData[dateString] || 0; // Use the actual data from sumByDateData
        const square = createHeatmapSquare(dateString, count);
        monthContainer.appendChild(square);

        // Move to the next day
        currentDate = currentDate.plus({ days: 1 });
      }
    }
  }


  function calculateCurrentStreak(sortedData) {
      let currentStreak = 0;

      const today = DateTime.local();
      const yesterday = today.minus({ days: 1 });

      console.log('today:', today.toISODate());
      console.log('yesterday:', yesterday.toISODate());
      console.log('sortedData_index_0:', sortedData[0]?.date);

      if (
          (sortedData[0]?.date === today.toISODate() && sortedData[0]?.count > 0) ||
          (sortedData[0]?.date === yesterday.toISODate() && sortedData[0]?.count > 0)
      ) {
          currentStreak = 1;
          for (let i = 0; i < sortedData.length - 1; i++) {
              console.log(i);
              const currentDate = DateTime.fromISO(sortedData[i].date).startOf('day');
              console.log('currentDate:', currentDate);

              const prevDate = DateTime.fromISO(sortedData[i + 1].date).startOf('day');
              console.log('prevDate:', prevDate);

              const daysDifference = currentDate.diff(prevDate, 'days').toObject().days;
              console.log('daysDifference:', daysDifference);

              if (Math.abs(daysDifference) === 1 && i + 2 < sortedData.length) {
                  currentStreak += 1;
                  console.log('currentStreak:', currentStreak);
              } else if (Math.abs(daysDifference) === 1 && i + 2 === sortedData.length) {
                  currentStreak += 2;
                  console.log('currentStreak:', currentStreak);
                  break;
              } else if (Math.abs(daysDifference) !== 1 && i + 2 === sortedData.length) {
                  currentStreak += 1;
                  console.log('currentStreak:', currentStreak);
                  console.log('adding one and breaking')
                  break;
              } else {
                  break;
              }
          }
          return currentStreak;
      } else {
          return currentStreak;
      }
  }



function updateStreakInfo(currentStreak) {
  const currentStreakValue = document.getElementById('currentStreakValue');
  currentStreakValue.textContent = currentStreak;
}
