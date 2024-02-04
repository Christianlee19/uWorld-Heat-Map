// Function to retrieve data from chrome.storage.local

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
      // '2023-08-01': 5,
      // '2023-09-15': 10,
      // };

      // Call functions
      generateHeatmap(sumByDateData);
      populateTable(sumByDateData);
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
  const today = new Date();
  console.log(today);
  const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const endDate = new Date(today);
  endDate.setMonth(today.getMonth());

  // Function to create a heatmap square
  const createHeatmapSquare = (date, count) => {
    const square = document.createElement('div');
    square.classList.add('heatmap-square');
    square.style.backgroundColor = `rgba(255, 0, 0, ${count / 20})`; // Adjust the color based on the count
    square.title = `${date}: ${count} questions`;
    return square;
  };

  // Generate heatmap squares for each day in the date range
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
      // Create a new row (div) for each month
      const monthContainer = document.createElement('div');
      monthContainer.classList.add('heatmap-month');
      heatmapContainer.appendChild(monthContainer);

      // Generate heatmap squares for the current month
      const currentMonth = currentDate.getMonth();
      while (currentDate.getMonth() === currentMonth) {
        const dateString = currentDate.toISOString().split('T')[0];
        const count = sumByDateData[dateString] || 0; // Use the actual data from sumByDateData
        const square = createHeatmapSquare(dateString, count);
        monthContainer.appendChild(square);

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }
