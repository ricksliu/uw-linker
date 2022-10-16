let mouseX;
let mouseY;

function getMousePos(e) {
  mouseX = e.clientX + window.scrollX;
  mouseY = e.clientY + window.scrollY;
}

document.addEventListener('mousemove', getMousePos);
