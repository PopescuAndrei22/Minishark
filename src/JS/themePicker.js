const handleThemeSelection = (event) => {

  const newBody = document.createElement('body');

  const target = event.target; // Access the target element
  const theme = target.getAttribute('data-theme');
  //const isPressed = target.getAttribute('aria-pressed');
  //document.documentElement.setAttribute("data-selected-theme", theme);
  //target.setAttribute('aria-pressed', 'true');

  // updating 
  
// Create a temporary element
  const tempElement = document.createElement('div');

  // Add the .theme-orange class to the temporary element
  tempElement.classList.add(`theme-${theme}`);

  // Append the temporary element to the document body (to ensure it's part of the rendered DOM)
  document.body.appendChild(tempElement);

  const computedStyles = getComputedStyle(tempElement);
  var colorBackground = computedStyles.getPropertyValue('--color-background');
  var colorText = computedStyles.getPropertyValue('--color-text');
  var colorTableHover = computedStyles.getPropertyValue('--color-table-hover');
  var colorTableHeader = computedStyles.getPropertyValue('--color-table-header');
  var colorTableSelectedRow = computedStyles.getPropertyValue('--color-table-selected-row');
  var colorTab = computedStyles.getPropertyValue('--color-tab');
  var colorTabActive = computedStyles.getPropertyValue('--color-tab-active');
  var colorTabHover = computedStyles.getPropertyValue('--color-tab-hover');
  var tableContentDetailsTitle = computedStyles.getPropertyValue('--table-content-details-title');
  var buttons = computedStyles.getPropertyValue('--buttons');
  var selectBoxBackground = computedStyles.getPropertyValue('--select-box-background');
  var selectBoxBorder = computedStyles.getPropertyValue('--select-box-border');

  // Update the global CSS variables on the document's root element
  document.documentElement.style.setProperty('--color-background-global', colorBackground);
  document.documentElement.style.setProperty('--color-text-global', colorText);
  document.documentElement.style.setProperty('--color-table-hover-global', colorTableHover);
  document.documentElement.style.setProperty('--color-table-header-global', colorTableHeader);
  document.documentElement.style.setProperty('--color-table-selected-row-global', colorTableSelectedRow);
  document.documentElement.style.setProperty('--color-tab-global', colorTab);
  document.documentElement.style.setProperty('--color-tab-active-global', colorTabActive);
  document.documentElement.style.setProperty('--color-tab-hover-global', colorTabHover);
  document.documentElement.style.setProperty('--table-content-details-title-global', tableContentDetailsTitle);
  document.documentElement.style.setProperty('--buttons-global', buttons);
  document.documentElement.style.setProperty('--select-box-background-global', selectBoxBackground);
  document.documentElement.style.setProperty('--select-box-border-global', selectBoxBorder);

  // Remove the temporary element from the document body
  document.body.removeChild(tempElement);

  // adding gradient
  const body = document.body;
  body.classList = '';
  body.classList.add('gradient-'+theme);
}

function initializeThemeButtons() {
  const buttons = document.querySelectorAll('.theme-button');

  buttons.forEach((button) => {
    button.addEventListener('click', handleThemeSelection);
  });

  // custom theme button
}

function rgbToHex(rgbColor) {
  var rgbArray = rgbColor.match(/\d+/g); // Extract RGB values
  var r = parseInt(rgbArray[0]);
  var g = parseInt(rgbArray[1]);
  var b = parseInt(rgbArray[2]);
  var hexColor = "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return hexColor;
}

function hexToRgb(hexColor) {
  // Remove the "#" symbol from the beginning of the hexadecimal color string
  hexColor = hexColor.replace("#", "");

  // Split the hexadecimal color string into three parts: red, green, and blue
  var r = parseInt(hexColor.substring(0, 2), 16);
  var g = parseInt(hexColor.substring(2, 4), 16);
  var b = parseInt(hexColor.substring(4, 6), 16);

  // Return the RGB color string in the "rgb(r, g, b)" format
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function openSmallWindow() {
  var features = "width=400,height=300,top=100,left=100"; // Specify the dimensions and position of the new window
  var newWindow = window.open("", "_blank", features); // Open the new window

  newWindow.document.title = "Theme Picker";

  // Access the computed styles of the document
  var computedStyles = getComputedStyle(document.documentElement);

  // Get the values of the CSS variables
  var colorBackground = computedStyles.getPropertyValue('--color-background-global');
  var colorText = computedStyles.getPropertyValue('--color-text-global');
  var colorTableHover = computedStyles.getPropertyValue('--color-table-hover-global');
  var colorTableHeader = computedStyles.getPropertyValue('--color-table-header-global');
  var colorTableSelectedRow = computedStyles.getPropertyValue('--color-table-selected-row-global');
  var colorTab = computedStyles.getPropertyValue('--color-tab-global');
  var colorTabActive = computedStyles.getPropertyValue('--color-tab-active-global');
  var colorTabHover = computedStyles.getPropertyValue('--color-tab-hover-global');
  var tableContentDetailsTitle = computedStyles.getPropertyValue('--table-content-details-title-global');

  // Convert RGB color values to hexadecimal format
  colorBackground = rgbToHex(colorBackground);
  colorText = rgbToHex(colorText);
  colorTableHover = rgbToHex(colorTableHover);
  colorTableHeader = rgbToHex(colorTableHeader);
  colorTableSelectedRow = rgbToHex(colorTableSelectedRow);
  colorTab = rgbToHex(colorTab);
  colorTabActive = rgbToHex(colorTabActive);
  colorTabHover = rgbToHex(colorTabHover);
  tableContentDetailsTitle = rgbToHex(tableContentDetailsTitle);

  var styleElement = newWindow.document.createElement("style");
  styleElement.innerHTML = `
    body {
      background-color: white;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    th {
      background-color: #f2f2f2;
    }
  `;

  newWindow.document.head.appendChild(styleElement);

  var scriptElement = newWindow.document.createElement("script");
  scriptElement.innerHTML = `

  function hexToRgb(hexColor) {
    // Remove the "#" symbol from the beginning of the hexadecimal color string
    hexColor = hexColor.replace("#", "");
  
    // Split the hexadecimal color string into three parts: red, green, and blue
    var r = parseInt(hexColor.substring(0, 2), 16);
    var g = parseInt(hexColor.substring(2, 4), 16);
    var b = parseInt(hexColor.substring(4, 6), 16);
  
    // Return the RGB color string in the "rgb(r, g, b)" format
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
  
  function handleColorInputChange(cssVariable, event) {
    var newColor = event.target.value;
  
    // Convert the RGB color value to hexadecimal
    var rgbColor = hexToRgb(newColor);
  
    // Update the CSS variable with the new color value in the parent window
    window.opener.document.documentElement.style.setProperty(cssVariable, rgbColor);
  
    // Update the value of the input element to reflect the new color
    event.target.value = newColor;
  }
  `;

  newWindow.document.head.appendChild(scriptElement);

  newWindow.document.body.innerHTML = `
  <table>
  <tr>
    <th>Color</th>
    <th>Element</th>
  </tr>
  <tr>
    <td><input type="color" value="${colorText}" oninput="handleColorInputChange('--color-text-global', event)"></td>
    <td>Text</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorTableHover}" oninput="handleColorInputChange('--color-table-hover-global', event)"></td>
    <td>Table Hover</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorTableHeader}" oninput="handleColorInputChange('--color-table-header-global', event)"></td>
    <td>Table Header</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorBackground}" oninput="handleColorInputChange('--color-background-global', event)"></td>
    <td>Background color</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorTableSelectedRow}" oninput="handleColorInputChange('--color-table-selected-row-global', event)"></td>
    <td>Table selected row</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorTab}" oninput="handleColorInputChange('--color-tab-global', event)"></td>
    <td>Tab color</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorTabActive}" oninput="handleColorInputChange('--color-tab-active-global', event)"></td>
    <td>Tab active color</td>
  </tr>
  <tr>
    <td><input type="color" value="${colorTabHover}" oninput="handleColorInputChange('--color-tab-hover-global', event)"></td>
    <td>Tab hover color</td>
  </tr>
  <tr>
    <td><input type="color" value="${tableContentDetailsTitle}" oninput="handleColorInputChange('--table-content-details-title-global', event)"></td>
    <td>Titles of the table content details</td>
  </tr>
</table>
  `;
}