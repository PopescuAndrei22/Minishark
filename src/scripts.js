let data
let tabCounter = 1;

let tabContent = {};
let tabFilePath = {};
let isLiveCapture = {};

let activeTabId = null;

let capturedPackets = {};

let dataPackets = {};

window.onload = function() {
    createHomeTab();
    initializeThemeButtons();
    //myFunction("text");
  };

  // async function handleInterfacenames()
  // {
  //    data = await api.getInterfaceNames();

  //    console.log(data);
  // }
  
  // async function handleLiveCapture()
  // {
  //   data = await api.OperationsLiveCapture(7);

  //   console.log(data);
  // }

  window.api.receive('save', () => {
    saveFunction();
  });
  
  function handleFileSelection(filePath) {
    console.log('Selected file path:', filePath);
  
    // Implement your saving logic here
  
    // Implement logic for tabs
  
     api.SavePCAP(dataPackets[activeTabId], filePath);
  }
  
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

  async function parsePcapFile(filePath,currentID)
  {
    data = await api.Operations(filePath);

    myFunction(data,currentID);
  }

  async function liveCaptureFunction(currentID)
  {
    data = await api.OperationsLiveCapture(7);

    myFunction(data,currentID);
  }

  async function myFunction(data, currentID) {

    dataPackets[currentID] = data; // for pcap serializer

    // data = await api.Operations(filePath);
    // process the data here
    
    const table = document.getElementById("printDataTable-"+currentID);
    const tbody = table.getElementsByTagName("tbody")[0];

    data.forEach(obj => {
      const row = tbody.insertRow();
      row.insertCell().textContent = obj.index;
      row.insertCell().textContent = obj.timeElapsed;
      row.insertCell().textContent = obj.destinationIP;
      row.insertCell().textContent = obj.sourceIP;
      row.insertCell().textContent = obj.protocol;
      row.insertCell().textContent = obj.originalPacketLength;
      row.insertCell().textContent = obj.infoData;

      // Add onclick event to each row
      row.onclick = function(event) {
        displayInfoData(obj, currentID, event);
      }
    });
  }

  function openNav(index) {
    var elementId = "mySidepanel-" + index;
    document.getElementById(elementId).style.width = "50%";
    document.getElementById(elementId).style.height = "50%";
  }
  
  function closeNav(index) {
    var elementId = "mySidepanel-" + index;
    document.getElementById(elementId).style.width = "0%";
    document.getElementById(elementId).style.height = "0%";
  }

function displayInfoData(obj,currentID, event) {
  const hexField = document.getElementById("hex-" + currentID);
  const readableField = document.getElementById("readableString-" + currentID);
  const dropdownField = document.getElementById("dropdown-" + currentID);

  // i had .textContent before
  dropdownField.innerHTML = `
  <h2 class='table-content-details-title' style='font-size: 24px; padding-bottom: 10px;text-align:center'>Packet details </h2>

  <div id="mySidepanel-1" class="sidepanel">
  <a href="javascript:void(0)" class="closebtn" onclick="closeNav(1)">×</a>
  <h2 class='table-content-details-title' style='font-size: 24px; padding-bottom: 10px;text-align:center'>Frame details </h2>
  <a>Frame number: ${obj.index}</a>
  <a>Frame length: ${obj.originalPacketLength} bytes (${obj.originalPacketLength * 8} bits) </a>
  <a>Capture length: ${obj.capturedPacketLength} bytes (${obj.capturedPacketLength * 8} bits) </a>
</div>

<div id="mySidepanel-2" class="sidepanel">
<a href="javascript:void(0)" class="closebtn" onclick="closeNav(2)">×</a>
<a href="#">About 2</a>
<a href="#">Services</a>
<a href="#">Clients</a>
<a href="#">Contact</a>
</div>

<div id="mySidepanel-3" class="sidepanel">
<a href="javascript:void(0)" class="closebtn" onclick="closeNav(3)">×</a>
<a href="#">About 3</a>
<a href="#">Services</a>
<a href="#">Clients</a>
<a href="#">Contact</a>
</div>

<div id="mySidepanel-4" class="sidepanel">
<a href="javascript:void(0)" class="closebtn" onclick="closeNav(4)">×</a>
<a href="#">About 4</a>
<a href="#">Services</a>
<a href="#">Clients</a>
<a href="#">Contact</a>
</div>

<div style="display: flex; flex-direction: column; align-items: center;">
  <button class="openbtn" onclick="openNav(1)">Frame ${obj.index}: ${obj.originalPacketLength} bytes on wire (${obj.originalPacketLength * 8} bits), ${obj.capturedPacketLength} bytes captured (${obj.capturedPacketLength * 8} bits)</button>
  <button class="openbtn" onclick="openNav(2)">Ethernet II</button>
  <button class="openbtn" onclick="openNav(3)">Internet protocol version 4</button>
  <button class="openbtn" onclick="openNav(4)">Transport layer security</button>
</div>

  `;

  hexField.innerHTML =
    "<h2 class='table-content-details-title' style='font-size: 24px; padding-bottom: 10px;text-align:center'>Hex details</h2>" +
    obj.hexValues;

  readableField.innerHTML =
    "<h2 class='table-content-details-title' style='font-size: 24px; padding-bottom: 10px;text-align:center'>Hex details in readable format</h2>" +
    obj.readableString;

  // Check if the event parameter is defined
  if (event && event.currentTarget) {
    // Remove the class from all rows
    const rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.remove("selected-row");
    }

    // Add the class to the selected row
    event.currentTarget.classList.add("selected-row");
  }
}

  function submitForm() {
    const fileInput = document.getElementById("file-upload");
    const filePath = fileInput.files[0].path;
  
    addTab(filePath);
   // myFunction(filePath);

    // create a new button element

  };

  function createHomeTab() {
    const tabList = document.querySelector('.tab-list');
  
    // create new tab and set its class and data attributes
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', 0);
  
    // create tab title and set its text
    const tabTitle = document.createElement('span');
    tabTitle.textContent = 'Home';
  
    // add the title and close button to the tab
    tab.appendChild(tabTitle);
  
    // add the tab to the tab list
    tabList.appendChild(tab);
  
    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = `
    <div style="margin-top:10px;">
    <form id="file-upload-form" class="uploader" style="text-align: center;">
    <input id="file-upload" type="file" name="fileUpload"/>
  
    <label for="file-upload" id="file-drag">
      <div id="start">
        <i class="fa fa-download" aria-hidden="true"></i>
        <div id="select-file-name">Select a file or drag here</div>
        <span id="file-upload-btn" class="btn btn-primary" onclick="getFileName()">Select a file</span>
        <input class="btn btn-primary" type="button" value="Submit" onclick="submitForm()">
      </div>
    </label>
  </form>
  </div>

  <div style="clear: both;"></div>

<div class="theme-container">
  <h1 class="custom-title">Pick the desired theme</h1>
<div class="theme-switcher">
  <button data-theme="crimson" class="theme-button gradient-crimson">Crimson Heart</button>
  <button data-theme="azure" class="theme-button gradient-azure">Crystal Azure</button>
  <button data-theme="orange" class="theme-button gradient-orange">Sunset Orange</button>
  <button data-theme="green" class="theme-button gradient-green">Jade Green</button>
</div>

<div class="theme-switcher">
<button data-theme="default" class="theme-button gradient">Default</button>
<button class="theme-button-customize gradient" onclick='openSmallWindow()'>Customize</button>
</div>

</div>

<div>
<button onclick="addTabLiveCapture()"> Live Capture </button>
</div>
`;

tabContent[0] = tableContainer;

    // add click event listener to the tab
    tab.addEventListener('click', activateTab);
  
    // activate the new tab
    activateTab({ target: tab });
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

  function addTab(filePath) {
    const tabList = document.querySelector('.tab-list');
  
    // create new tab and set its class and data attributes
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', tabCounter);
  
    // create tab title and set its text
    const tabTitle = document.createElement('span');
    tabTitle.textContent = filePath.split('\\').pop();
  
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

tabFilePath[tabCounter] = filePath;

isLiveCapture[tabCounter] = false;

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

  function activateTab(event) {
    const tab = event.target.closest('.tab');
    const tabList = tab.parentElement;
    const activeTab = tabList.querySelector('.active');
  
    if (activeTab) {
      activeTab.classList.remove('active');
    }
  
    tab.classList.add('active');

    const tabId = tab.getAttribute('data-tab');

    activeTabId = tabId;

    const classic = document.querySelector('#classic');

    classic.innerHTML = tabContent[tabId].innerHTML;

    if(isLiveCapture[tabId]){
        if (capturedPackets.hasOwnProperty(tabId)) {
          classic.innerHTML = capturedPackets[tabId];
          }
        else
        {
          classic.innerHTML = tabContent[tabId].innerHTML;
        }
  }

    if(tabId != 0)
    {
      if(isLiveCapture[tabId] === false)
      {
        parsePcapFile(tabFilePath[tabId],tabId);
        // myFunction(tabFilePath[tabId],tabId);
      }
      else
      {
        runLiveCaptureLoop(tabId);
      }
      // handleInterfacenames();
      // handleLiveCapture();
    }
    else
    {
      initializeThemeButtons();
    }
  }
  
  function closeTab(event) {
    event.stopPropagation();
  
    const tab = event.target.closest('.tab');
    const tabList = tab.parentElement;
  
    if (tab.classList.contains('active')) {
      const tabs = tabList.querySelectorAll('.tab');
      const index = Array.from(tabs).indexOf(tab);
  
      if (index === 0) {
        activateTab({ target: tabs[1] });
      } else {
        activateTab({ target: tabs[index - 1] });
      }
    }
  
    tabList.removeChild(tab);
  }