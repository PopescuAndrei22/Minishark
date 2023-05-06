function changeThemeCustom(event) {
    const color = event.target.value;
    document.body.style.backgroundColor = color;
  }

  function changeThemeOrange()
  {
    const bodyElement = document.body;
    bodyElement.classList.add('gradient-orange'); // Add class
    bodyElement.classList.toggle('active'); // Toggle class
  }