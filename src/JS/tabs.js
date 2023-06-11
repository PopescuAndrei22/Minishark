window.onload = function() {
    createHomeTab();
    initializeThemeButtons();
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
    <div id="select-file-name">Select a file</div>
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
<button onclick="liveCaptureFunction()" class="defaultbtn"> Live Capture </button>
</div>
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

    <div style="height: 10vh;">

    <div class="textbox-container">
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

    //const classic = document.querySelector('#classic');

    //classic.innerHTML = "";

    //classic.innerHTML = tableContainer;

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

// to check this function for potential bugs (if it changes the activeTabId)
function refreshCurrentTab() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
      activeTab.dispatchEvent(new Event('click'));
    }
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

    selectedTableLine[tabId] = undefined;

    const classic = document.querySelector('#classic');

    classic.innerHTML = tabContent[tabId].innerHTML;

    //   if(isLiveCapture[tabId]){
    //       if (capturedPackets.hasOwnProperty(tabId)) {
    //         classic.innerHTML = capturedPackets[tabId];
    //         }
    //       else
    //       {
    //         classic.innerHTML = tabContent[tabId].innerHTML;
    //       }
    // }

    if(tabId != 0)
    {
        if(isLiveCapture[tabId] === false)
        {
            parsePcapFile(tabId); // saving the content of the tab in data
            //parsePcapFile(tabFilePath[tabId],tabId);
        }
        else
        {
            if(dataPackets[tabId] != undefined)
            {
                myFunction(dataPackets[tabId],tabId);
            }

            if(isLiveCaptureInProgress[tabId] === true){
            startCapture(tabId,networkInterfaceTab[tabId]);
            isLiveCaptureInProgress[tabId] = true
            }
        }
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

    isLiveCaptureInProgress[activeTabId] = false;
    stopCapture(activeTabId);

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
