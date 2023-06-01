let data
let tabCounter = 1;

let textBoxValues = {};

let tabContent = {};
let tabFilePath = {};
let isLiveCapture = {};

let activeTabId = null;

let capturedPackets = {};

let dataPackets = {};

let patterns = {};

window.onload = function() {
  createHomeTab();
  initializeThemeButtons();
};

function submitForm() {
  const fileInput = document.getElementById("file-upload");
  const filePath = fileInput.files[0].path;

  addTab(filePath);
 // myFunction(filePath);

  // create a new button element
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

async function liveCaptureFunction(currentID)
{
  data = await api.OperationsLiveCapture(7,parseInt(currentID));
  
  //dataPackets[currentID] = data;

  //myFunction(dataPackets[currentID],currentID);
}
  
async function parsePcapFile(currentID)
{
  if(dataPackets[currentID] === undefined) {
  data = await api.Operations(tabFilePath[currentID]);

  dataPackets[currentID] = data;
  }

  myFunction(dataPackets[currentID],currentID);
}

  // async function myFunction(data, currentID) {

  //   // data = await api.Operations(filePath);
  //   //dataPackets[currentID] = data;
  //   // process the data here
    
  //   const table = document.getElementById("printDataTable-"+currentID);
  //   const tbody = table.getElementsByTagName("tbody")[0];



  //   data.forEach(obj => {
  //     const row = tbody.insertRow();
  //     row.insertCell().textContent = obj.index;
  //     row.insertCell().textContent = obj.timeElapsed;
  //     row.insertCell().textContent = obj.destinationIP;
  //     row.insertCell().textContent = obj.sourceIP;
  //     row.insertCell().textContent = obj.protocol;
  //     row.insertCell().textContent = obj.originalPacketLength;
  //     row.insertCell().textContent = obj.infoData;

  //     // Add onclick event to each row
  //     row.onclick = function(event) {
  //       displayInfoData(obj, currentID, event);
  //     }
  //   });
  // }

async function myFunction(data, currentID) {
  const table = document.getElementById("printDataTable-" + currentID);
  const tbody = table.getElementsByTagName("tbody")[0];

  let indexValue = document.getElementById('textbox1');
  let timeValue = document.getElementById('textbox2');
  let destinationValue = document.getElementById('textbox3');
  let sourceValue = document.getElementById('textbox4');
  let protocolValue = document.getElementById('textbox5');
  let lengthValue = document.getElementById('textbox6');
  let infoValue = document.getElementById('textbox7');
  
  if(textBoxValues[currentID] != undefined)
  {
    indexValue.value = textBoxValues[currentID].index;
    timeValue.value = textBoxValues[currentID].time;
    destinationValue.value = textBoxValues[currentID].destination;
    sourceValue.value = textBoxValues[currentID].source;
    protocolValue.value = textBoxValues[currentID].protocol;
    lengthValue.value = textBoxValues[currentID].length;
    infoValue.value = textBoxValues[currentID].info;
  }
  
  // Retrieve the patterns for the currentID
  const currentPatterns = patterns[currentID];

  filteredData = data;

  if (currentPatterns) {
    // Filter the data using the patterns
    filteredData = data.filter(obj => {
      return (
        currentPatterns.indexRegex.test(obj.index) &&
        currentPatterns.timeRegex.test(obj.timeElapsed) &&
        currentPatterns.destinationRegex.test(obj.destinationIP) &&
        currentPatterns.sourceRegex.test(obj.sourceIP) &&
        currentPatterns.protocolRegex.test(obj.protocol) &&
        currentPatterns.lengthRegex.test(obj.originalPacketLength) &&
        currentPatterns.infoRegex.test(obj.infoData)
      );
    });
  }

  filteredData.forEach(obj => {
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

  if(tbody.getElementsByTagName('tr')[0] != undefined){
    tbody.getElementsByTagName('tr')[0].classList.add("selected-row");
    displayInfoData(filteredData[0], currentID);
  }
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

    /*this might slow down the application*/

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

