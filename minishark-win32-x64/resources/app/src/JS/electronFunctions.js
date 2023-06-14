window.api.receive('save', () => {
    saveFunction();
  });

  window.api.receive('startCapture', () => {
    startFunction();
  });
  
  window.api.receive('stopCapture', () => {
    stopFunction();
  });
  
  window.api.receive('restartCapture', () => {
    restartFunction();
  });

  window.api.receive('movePackets', () => {
    movePacketsFunction();
  });


function saveFunction() {
    console.log('Save event received!');

    // Show the save dialog using the exposed Electron API
    window.api.showSaveDialog({
        defaultPath: 'filename.pcap', // Set a default file name
        properties: ['createDirectory'] // Optional: Allow creating a new directory
    }).then(result => {
        if (!result.canceled) {
        const filePath = result.filePath;
        handleFileSelection(filePath);
        } else {
        // Handle dialog cancellation
        }
    }).catch(error => {
        // Handle errors
        console.error('File save error:', error);
    });
}

function handleFileSelection(filePath) {
    console.log('Selected file path:', filePath);

    // Implement your saving logic here

    // Implement logic for tabs

    api.SavePCAP(dataPackets[activeTabId], filePath);
}