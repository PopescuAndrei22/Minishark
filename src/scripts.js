let data

window.onload = function() {
    myFunction();
  };
  
  async function myFunction() {
    data = await api.getPcapData();
    // process the data here
    
    const table = document.getElementById("printDataTable");
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
        displayInfoData(obj.hexValues,obj.readableString,event);
      }

    });
  }

  function displayInfoData(hexValues,readableString) {
    const hexField = document.getElementById("hex");
    const readableField = document.getElementById("readableString");

    // i had .textContent before
    hexField.innerHTML = "<h2 style='color: #800040;font-size: 24px; padding-bottom: 10px;text-align:center'>Hex details</h2>" + hexValues;
    readableField.innerHTML = "<h2 style='color: #800040; font-size: 24px; padding-bottom: 10px;text-align:center'>Hex details in readable format</h2>" + readableString;

    // Remove the class from all rows
    const rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.remove("selected-row");
    }
  
    // Add the class to the selected row
    event.currentTarget.classList.add("selected-row");
  }