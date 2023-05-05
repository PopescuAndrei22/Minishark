let data
let tabCounter = 1;

let tabContent = {};
let tabFilePath = {};

window.onload = function() {
    createHomeTab();
    //myFunction("text");
  };
  
  async function myFunction(filePath, currentID) {
    data = await api.getPcapData(filePath);
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
        displayInfoData(obj.hexValues, obj.readableString, currentID, event);
      }

    });
  }

function displayInfoData(hexValues, readableString, currentID, event) {
  const hexField = document.getElementById("hex-" + currentID);
  const readableField = document.getElementById("readableString-" + currentID);

  // i had .textContent before
  hexField.innerHTML =
    "<h2 style='color: #800040;font-size: 24px; padding-bottom: 10px;text-align:center'>Hex details</h2>" +
    hexValues;
  readableField.innerHTML =
    "<h2 style='color: #800040; font-size: 24px; padding-bottom: 10px;text-align:center'>Hex details in readable format</h2>" +
    readableString;

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

function check()
{
  const fileInput = document.getElementById("file-upload");
    const filePath = fileInput.files[0].path;

    console.log(filePath);
}
  function submitForm() {
    const fileInput = document.getElementById("myfile");
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
    <form>
    <label for="myfile">Select a file:</label>
    <input type="file" id="myfile" name="myfile"><br><br>
    <input class="add-tab-btn" type="button" value="Submit" onclick="submitForm()">
  </form>
`;

tabContent[0] = tableContainer;

    // add click event listener to the tab
    tab.addEventListener('click', activateTab);
  
    // activate the new tab
    activateTab({ target: tab });
  }

  function addTab(filePath) {
    const tabList = document.querySelector('.tab-list');
  
    // create new tab and set its class and data attributes
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', tabCounter);
  
    // create tab title and set its text
    const tabTitle = document.createElement('span');
    tabTitle.textContent = `Tab ${tabCounter}`;
  
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

  <div class="table-details"></div>

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

    const classic = document.querySelector('#classic');

    classic.innerHTML = tabContent[tabId].innerHTML;

    if(tabId != 0)
    {
      myFunction(tabFilePath[tabId],tabId);
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