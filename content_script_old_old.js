// Function to extract data from the table using the provided XPath
console.log('Content script is running');

const extractDataFromTable = () => {
  // Define the XPath expression to select the table
  const tableXPath = '//*[@id="cdk-drop-list-0"]/tbody';

  // Use document.evaluate to select the table element
  const tableElement = document.evaluate(tableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (tableElement) {
    // Initialize an array to store the extracted data
    const extractedData = [];

    // Select all rows in the table
    const rows = tableElement.querySelectorAll('tr');

    // Check if there are rows to iterate through
        if (rows) {
          // Iterate through rows
          rows.forEach((row) => {
            // Initialize an object to store data for this row
            const rowData = {};

            // Select all cells (columns) in this row
            const cells = row.querySelectorAll('td');

            // Iterate through cells
            cells.forEach((cell, index) => {
              // Use the cell's text content as the property name and the corresponding cell's text content as the value
              rowData[`Column${index + 1}`] = cell.textContent.trim();
            });

            // Add the row data to the extracted data array
            extractedData.push(rowData);
          });
        }

        return extractedData;
      } else {
        console.log('Table not found.');
        return null;
      }
};


// Function to calculate the sum of values in column 8 based on their associated dates from column 3
const calculateSumByDate = (tableData) => {
  const sumByDate = {};

  // Iterate through the table data
  tableData.forEach((row) => {
    const date = row['Column3']; // Assuming 'Column3' contains the date
    const valueInColumn8 = parseInt(row['Column8'], 10);

    if (!isNaN(valueInColumn8)) {
      if (!sumByDate[date]) {
        sumByDate[date] = 0;
      }
      sumByDate[date] += valueInColumn8;
    }
  });
  console.log(sumByDate);
  return sumByDate;
};

// Store the calculated data in Chrome's storage
const storeData = (data) => {
  chrome.storage.local.set({ 'sumByDate': data }, () => {
    console.log('Data stored in chrome.storage.local');
  });
};

// Add a brief delay (e.g., 3 seconds) to account for possible delayed loading
setTimeout(() => {
  // Call the function to extract data from the entire table
  const extractedData = extractDataFromTable();

  // Call the function to calculate the sum of values in column 8 by date
  const sumByDate = calculateSumByDate(extractedData);

  // Log the sums to the console
  console.log('Sum of values by date:', sumByDate);
}, 5000); // Adjust the delay as needed
