function retrieveTextboxValues()
{
    let indexValue = document.getElementById('textbox1').value;
    let timeValue = document.getElementById('textbox2').value;
    let destinationValue = document.getElementById('textbox3').value;
    let sourceValue = document.getElementById('textbox4').value;
    let protocolValue = document.getElementById('textbox5').value;
    let lengthValue = document.getElementById('textbox6').value;
    let infoValue = document.getElementById('textbox7').value;

    patterns[activeTabId] = {
        indexRegex: new RegExp(indexValue),
        timeRegex: new RegExp(timeValue),
        destinationRegex: new RegExp(destinationValue),
        sourceRegex: new RegExp(sourceValue),
        protocolRegex: new RegExp(protocolValue),
        lengthRegex: new RegExp(lengthValue),
        infoRegex: new RegExp(infoValue)
      };
    
      textBoxValues[activeTabId] = {
        index: indexValue,
        time: timeValue,
        destination: destinationValue,
        source: sourceValue,
        protocol: protocolValue,
        length: lengthValue,
        info: infoValue
      };
    
    refreshCurrentTab();
}

function clearFilters()
{
  let indexValue = document.getElementById('textbox1');
  let timeValue = document.getElementById('textbox2');
  let destinationValue = document.getElementById('textbox3');
  let sourceValue = document.getElementById('textbox4');
  let protocolValue = document.getElementById('textbox5');
  let lengthValue = document.getElementById('textbox6');
  let infoValue = document.getElementById('textbox7');

  indexValue.value = '';
  timeValue.value = '';
  destinationValue.value = '';
  sourceValue.value = '';
  protocolValue.value = '';
  lengthValue.value = '';
  infoValue.value = '';

  patterns[activeTabId] = {
      indexRegex: new RegExp(''),
      timeRegex: new RegExp(''),
      destinationRegex: new RegExp(''),
      sourceRegex: new RegExp(''),
      protocolRegex: new RegExp(''),
      lengthRegex: new RegExp(''),
      infoRegex: new RegExp('')
    };
  
    textBoxValues[activeTabId] = {
      index: '',
      time: '',
      destination: '',
      source: '',
      protocol: '',
      length: '',
      info: ''
    };
  
  refreshCurrentTab();
}