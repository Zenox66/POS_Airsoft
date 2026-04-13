document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    openNav();
  }
});

function openNav() {
  document.getElementById("Sidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("Sidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}