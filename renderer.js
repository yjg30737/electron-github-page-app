document.getElementsByClassName('theme-toggler').addEventListener('click', async () => {
    await window.darkMode.toggle()
});