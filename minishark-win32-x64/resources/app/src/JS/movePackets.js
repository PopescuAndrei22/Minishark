function movePacketsFunction()
{
  const movePacketsOptions = document.getElementById('movingPacketsOptions');
  //movePacketsOptions.style.display = movePacketsOptions.style.display === 'none' ? 'block' : 'none';

  // hotfix, to solve later
  if (movePacketsOptions.style.display === 'none' || movePacketsOptions.style.display === '') {
    movePacketsOptions.style.display = 'block';

    const table = document.getElementById(`printDataTable-${activeTabId}`);

    // Get the table body
    const tbody = table.querySelector('tbody');

    // Get all the table rows
    const rows = tbody.querySelectorAll('tr');

    // Iterate over the rows
    rows.forEach((row, index) => {
      // Create a new checkbox element
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      // Insert the checkbox as the first child of the first td element
      const firstCell = row.querySelector('td:first-child');
      firstCell.insertBefore(checkbox, firstCell.firstChild);
    });

  } else {
    movePacketsOptions.style.display = 'none';

    const table = document.getElementById(`printDataTable-${activeTabId}`);

    // Get all the checkboxes in the table
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');

    // Iterate over the checkboxes
    checkboxes.forEach((checkbox) => {
      // Remove the checkbox
      checkbox.parentNode.removeChild(checkbox);
    });
  }
}

// it retrieves the index of the checkboxes instead of the index of the packets, but it works as expected, to modify later if is necessary
function getCheckedRowIndexesPackets() {
    const table = document.getElementById(`printDataTable-${activeTabId}`);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    const checkedIndexes = [];
  
    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        checkedIndexes.push(index);
      }
    });

    return checkedIndexes;
  }

  function getCheckedSidePanelIndexes() {
    const sidePanel = document.getElementById('mySidepanel-0');
    const checkboxes = sidePanel.querySelectorAll('input[type="checkbox"]');
    const checkedIndexes = [];
  
    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        const tabIndex = checkbox.getAttribute('data-tab-index'); // Retrieve tab index from data attribute
        checkedIndexes.push(parseInt(tabIndex));
      }
    });
  
    return checkedIndexes;
  }

  function transferRowsToTabs(rowIndexes, tabIndexes) {

    tabIndexes.forEach((indexTab) => {
      let newDataContent = [];
      let indexPacketInTable = 1;
      let j = 0;

      // the interclassing of packages because we have to update the indexes on the frontend anyway
      for(let i = 0; i< dataPackets[indexTab].length; i++)
      {
        while(j < rowIndexes.length)
        {
            const indexPacket = rowIndexes[j];
            if(dataPackets[activeTabId][indexPacket].timeElapsed < dataPackets[indexTab][i].timeElapsed)
            {
                newDataContent.push({...dataPackets[activeTabId][indexPacket]});

                j++;
            }
            else
            {
                break;
            }
        }
        newDataContent.push({...dataPackets[indexTab][i]});
      }

      // if remaining packets
      while(j < rowIndexes.length)
      {
        const indexPacket = rowIndexes[j];

        newDataContent.push({...dataPackets[activeTabId][indexPacket]});

        j++;
      }

        // updating frontend
        dataPackets[indexTab] = newDataContent;

        // updating indexes
        dataPackets[indexTab].forEach((obj) => {
            obj.index = indexPacketInTable;
            indexPacketInTable++;
        });

    });

  }

  function movePacketsToAnotherTab()
  {
    let checkedIndexesPackets = getCheckedRowIndexesPackets();
    let checkedIndexesTabs = getCheckedSidePanelIndexes();

    let movedPacketsToSameTab = false;
    checkedIndexesTabs.forEach((index) => {
      // Perform actions with the index
      if(index == activeTabId)
      {
        movedPacketsToSameTab = true;
      }
    });

    transferRowsToTabs(checkedIndexesPackets, checkedIndexesTabs);

    closeNavPackets(0);

    // to refresh tab if i moved packets to the same tab, but it won't show the animation of the panel slide anymore
    if(movedPacketsToSameTab == true){
    refreshCurrentTab();}

  }

  function updateSidePanelContent() {
    const sidePanel = document.getElementById('mySidepanel-0');
    const tabList = document.querySelector('.tab-list');

  
    if (!sidePanel || !tabList) {
      return; // Exit if elements not found
    }
  
    const tabs = tabList.querySelectorAll('.tab');
    const sidePanelContent = sidePanel.querySelector('ul');
  
    // Clear previous content
    sidePanelContent.innerHTML = '';

    tabs.forEach((tab) => {
      const tabId = tab.getAttribute('data-tab');
      const tabName = tab.querySelector('span:not(.close-tab)').textContent;
    
      if(tabId!=0){ // if is not home tab
      const li = document.createElement('li');
    
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('data-tab-index', tabId); 
    
      const label = document.createElement('label');
      // label.textContent = `${tabName} - ID: ${tabId}`;
      label.textContent = `${tabName}`;

      // Add event listener to label
      label.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
      });
    
      li.appendChild(checkbox);
      li.appendChild(label);
    
      sidePanelContent.appendChild(li);
      }
    });
  }

  function openNavPackets(index) {
    var elementId = "mySidepanel-" + index;
    document.getElementById(elementId).style.width = "100%";
    document.getElementById(elementId).style.height = "45vh";

    // Clear side panel content
    const sidePanel = document.getElementById('mySidepanel-0');
    const sidePanelContent = sidePanel.querySelector('ul');
    sidePanelContent.innerHTML = '';

    // Update side panel content
    updateSidePanelContent();
  }
  
  function closeNavPackets(index) {
    var elementId = "mySidepanel-" + index;
    document.getElementById(elementId).style.width = "0%";
    document.getElementById(elementId).style.height = "0vh";
  }

