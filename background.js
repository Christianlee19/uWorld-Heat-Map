

// Optional: You can have other background script logic here, like handling events or managing data


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.data) {
    const receivedData = request.data;
    console.log("Message received in background.js: " + receivedData);

    // Send the message to the popup script
    chrome.runtime.sendMessage({ data: receivedData }, function(response) {
      console.log("Message relayed to popup.js");
    });
  }
});
