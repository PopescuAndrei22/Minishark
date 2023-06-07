function runLiveCaptureLoop(tabId) {
    setTimeout(function () {
        if(tabId != activeTabId)
        {
        return;
        }

        if(isLiveCaptureInProgress[tabId] == false)
        {
          return;
        }

        
        // const classic = document.querySelector('#classic');
        // capturedPackets[tabId] = classic.innerHTML;

        getLiveCapturePacket(tabId);

        runLiveCaptureLoop(tabId); // Recursive call to continue the loop
    }, 4000);
}

async function getLiveCapturePacket(tabId)
{
  dataPackets[tabId] = await api.OperationsLiveCapture(parseInt(networkInterfaceTab[tabId]));

  myFunction(dataPackets[tabId],tabId);
}

async function interfaceForLiveCapture(interfaceIndex)
{
  console.log(interfaceIndex);

  addTabLiveCapture(interfaceIndex);
  // live capture
  // data = await api.OperationsLiveCapture(parseInt(interfaceIndex));

  // dataPackets[currentID] = data;
  // myFunction(dataPackets[currentID],currentID);

  // runLiveCaptureLoop(currentID);
}

async function interfaceMenu(interfaces) {
  var features = "width=800,height=600,top=100,left=100";
  var newWindow = window.open("", "_blank", features);

  newWindow.document.title = "Network Interfaces";
  newWindow.document.body.style.background = "#000";

  var buttonContainer = newWindow.document.createElement("div");

  interfaces.forEach(function(interface) {
    var button = newWindow.document.createElement("button");
    button.style.display = "block";
    button.style.margin = "10px auto";
    button.style.backgroundColor = "#ff0000";
    button.style.color = "#fff";
    button.style.padding = "10px 20px";
    button.style.fontSize = "18px";
    button.textContent = interface;

    button.addEventListener("click", function() {
      interfaceForLiveCapture(interfaces.indexOf(interface));
      newWindow.close();
    });

    // Add hover effect
    button.addEventListener("mouseover", function() {
      button.style.backgroundColor = "#666";
    });

    button.addEventListener("mouseout", function() {
      button.style.backgroundColor = "#ff0000";
    });

    buttonContainer.appendChild(button);
  });

  newWindow.document.body.appendChild(buttonContainer);
}

async function startFunction()
{
    console.log("Start function!");
    //await api.StartLiveCapture(parseInt(activeTabId));
    isLiveCaptureInProgress[activeTabId] = true;

    if(isLiveCapture[activeTabId] == true)
    {
      runLiveCaptureLoop(activateTab);
    }
}

async function stopFunction()
{
    console.log("Stop function!");
    //await api.StopLiveCapture(parseInt(activeTabId));
    isLiveCaptureInProgress[activeTabId] = false;
}

function restartFunction()
{
    //console.log("Restart function!");
}

function addTabLiveCapture(interfaceIndex){
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

    <div>
    <input type="text" id="textbox1" class="textbox" style="width: 200px;" placeholder="Search by index">
    <input type="text" id="textbox2" class="textbox" style="width: 200px;" placeholder="Search by time">
    <input type="text" id="textbox3" class="textbox" style="width: 200px;" placeholder="Search by destination IP">
    <input type="text" id="textbox4" class="textbox" style="width: 200px;" placeholder="Search by source IP">
    <input type="text" id="textbox5" class="textbox" style="width: 200px;" placeholder="Search by protocol">
    <input type="text" id="textbox6" class="textbox" style="width: 200px;" placeholder="Search by length">
    <input type="text" id="textbox7" class="textbox" style="width: 200px;" placeholder="Search by info">
    </div>

    <div>
    <button onclick="retrieveTextboxValues()" class="defaultbtn"> Apply filters </button>
    <button onclick="clearFilters()" class="defaultbtn"> Clear filters </button>
    </div>

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

    <div id="mySidepanel-0" class="sidepanel-packets">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNavPackets(0)">×</a>
    <ul>
    </ul>

    <button onclick="movePacketsToAnotherTab()" class="defaultbtn"> Send packets </button>

    </div>

    <div id="movingPacketsOptions">
    <button onclick="openNavPackets(0)" class="defaultbtn"> Move to </button>
    <button onclick="movePacketsFunction()" class="defaultbtn"> Cancel </button>
    </div>

    </tbody>

    </table>

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

isLiveCaptureInProgress[tabCounter] = false;

networkInterfaceTab[tabCounter] = interfaceIndex;

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