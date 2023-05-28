function retrieveTextboxValues()
{
    const indexValue = document.getElementById('textbox1').value;
    const timeValue = document.getElementById('textbox2').value;
    const destinationValue = document.getElementById('textbox3').value;
    const sourceValue = document.getElementById('textbox4').value;
    const protocolValue = document.getElementById('textbox5').value;
    const lengthValue = document.getElementById('textbox6').value;
    const infoValue = document.getElementById('textbox7').value;

    patterns[activeTabId] = {
        indexRegex: new RegExp(indexValue),
        timeRegex: new RegExp(timeValue),
        destinationRegex: new RegExp(destinationValue),
        sourceRegex: new RegExp(sourceValue),
        protocolRegex: new RegExp(protocolValue),
        lengthRegex: new RegExp(lengthValue),
        infoRegex: new RegExp(infoValue)
      };
    
    refreshCurrentTab();
}