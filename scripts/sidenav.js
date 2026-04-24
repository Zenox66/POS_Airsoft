document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    openNav();
  }
});

function openNav() {
  document.getElementById("Sidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementById("main").style.filter = "blur(1px)";
}

function closeNav() {
  document.getElementById("Sidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("main").style.filter = "blur(0px)";
}