function runLiveCaptureLoop(tabId) {
    setTimeout(function () {
        if(tabId != activeTabId)
        {
        return;
        }
        
        const classic = document.querySelector('#classic');
        capturedPackets[tabId] = classic.innerHTML;

        liveCaptureFunction(tabId);
        runLiveCaptureLoop(tabId); // Recursive call to continue the loop
    }, 2000);
}

async function startFunction()
{
    console.log("Start function!");
    await api.StartLiveCapture(parseInt(activeTabId));
}

async function stopFunction()
{
    console.log("Stop function!");
    await api.StopLiveCapture(parseInt(activeTabId));
}

function restartFunction()
{
    console.log("Restart function!");
}

function addTabLiveCapture(){
    const tabList = document.querySelector('.tab-list');
  
    // create new tab and set its class and data attributes
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', tabCounter);
  
    // create tab title and set its text
    const tabTitle = document.createElement('span');
    tabTitle.textContent = "Live Capture";
  
    // create close button for the tab
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-tab');
    closeButton.setAttribute('data-tab', tabCounter);
    closeButton.textContent = '×';
  
    // add the title and close button to the tab
    tab.appendChild(tabTitle);
    tab.appendChild(closeButton);
  
    // add the tab to the tab list
    tabList.appendChild(tab);
  
    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = `
    <div class="table-container">
  <table id="printDataTable-${tabCounter}">
    <thead>
      <tr>
        <th>Index</th>
        <th>Time</th>
        <th>Destination</th>
        <th>Source</th>
        <th>Protocol</th>
        <th>Length</th>
        <th>Info</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
  </table>

  <div id="movingPacketsOptions">
  This is the bottom content
  </div>

  <div class="table-details" id="dropdown-${tabCounter}"></div>

  <div class="table-content-details" id="hex-${tabCounter}" style="margin-left:50%"></div>

  <div class="table-content-details" id="readableString-${tabCounter}" style="margin-left:75%"></div>
  </div>
`;

// add the table container to the classic div
//const classic = document.querySelector('#classic');
//classic.appendChild(tableContainer);

//const classic = document.querySelector('#classic');

//classic.innerHTML = "";

//classic.innerHTML = tableContainer;

//myFunction(tabCounter);

tabContent[tabCounter] = tableContainer;

isLiveCapture[tabCounter] = true;

// classic.innerHTML = "";

    // add click event listener to the tab
    tab.addEventListener('click', activateTab);
  
    // add click event listener to the close button
    closeButton.addEventListener('click', closeTab);
  
    // activate the new tab
    activateTab({ target: tab });

    // increment the tab counter
    tabCounter++;
  }