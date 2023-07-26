const opacityDialog = new FramelessWindow({
    parent: win, // Set the main window as the parent
    modal: true, // Make the dialog modal to block interactions with the main window
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
  });
  opacityDialog.loadFile('windowOption.html');
  const opacitySlider = document.getElementById('opacity-slider');
  opacitySlider.addEventListener('range', (value) => {
    console.log(value);
  });