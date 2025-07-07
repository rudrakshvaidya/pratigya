/*let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
*/
/*
  REFACTOR: The original script had design flaws:
  1. A new 'mousemove' event listener was created for EACH paper, which is very inefficient.
  2. State variables (like mouseX, mouseY) were attached to the class but were updated globally, which is confusing.
  3. Right-click for rotation is bad UX as it opens the context menu.

  This new script uses a single set of listeners on the window, making it far more efficient and cleaner.
*/

// Global state variables
let highestZ = 1;
let currentPaper = null; 
let isDragging = false;
let isRotating = false;

// Variables to store the initial state when a drag starts
let startMouseX = 0;
let startMouseY = 0;
let startPaperX = 0;
let startPaperY = 0;
let currentRotation = 0;

const papers = document.querySelectorAll('.paper');

// --- Mouse Down: Fired when you first click a paper ---
const startDrag = (e) => {
  // We only care about the left mouse button for dragging
  if (e.button !== 0) return;

  // Find the paper element, handling the case where we click the anchor link for the heart
  currentPaper = e.target.classList.contains('paper') ? e.target : e.target.closest('.paper');
  if (!currentPaper) return;

  // Prevent default browser actions, like link navigation or image dragging
  e.preventDefault();

  isDragging = true;
  isRotating = e.shiftKey; // Check if Shift is held down for rotation

  highestZ += 1;
  currentPaper.style.zIndex = highestZ;
  currentPaper.style.transition = 'none'; // Remove transition for smooth 1:1 dragging

  startMouseX = e.clientX;
  startMouseY = e.clientY;

  const transform = window.getComputedStyle(currentPaper).transform;
  if (transform !== 'none') {
    const matrix = new DOMMatrixReadOnly(transform);
    startPaperX = matrix.m41;
    startPaperY = matrix.m42;
    currentRotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);
  } else {
    startPaperX = 0;
    startPaperY = 0;
    currentRotation = 0; // Or get from an initial data attribute
  }
};

// --- Mouse Move: Fired when the mouse moves after a click ---
const doDrag = (e) => {
  if (!isDragging || !currentPaper) return;

  const deltaX = e.clientX - startMouseX;
  const deltaY = e.clientY - startMouseY;

  let newRotation = currentRotation;

  if (isRotating) {
    const rect = currentPaper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    newRotation = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  }
  
  const newPaperX = startPaperX + deltaX;
  const newPaperY = startPaperY + deltaY;

  currentPaper.style.transform = `translateX(${newPaperX}px) translateY(${newPaperY}px) rotate(${newRotation}deg)`;
};

// --- Mouse Up: Fired when you release the mouse button ---
const stopDrag = (e) => {
  if (!isDragging || !currentPaper) return;

  // FIX #4: Click vs. Drag logic for the heart link
  const deltaX = Math.abs(e.clientX - startMouseX);
  const deltaY = Math.abs(e.clientY - startMouseY);
  const moveThreshold = 5; // How many pixels the mouse can move before it's considered a drag

  // Check if it was a click (not a drag) and the element is the heart
  if (deltaX < moveThreshold && deltaY < moveThreshold && currentPaper.classList.contains('heart')) {
    const heartLink = document.getElementById('heart-link');
    if(heartLink) {
        window.location.href = heartLink.href; // Navigate to the link
        return; // Stop further execution
    }
  }

  isDragging = false;
  isRotating = false;
  if (currentPaper) {
    currentPaper.style.transition = 'transform 0.1s ease-out';
  }
  currentPaper = null;
};

// Assign initial random rotation and add event listener
papers.forEach(paper => {
  const initialRotation = Math.random() * 30 - 15;
  paper.style.transform = `rotate(${initialRotation}deg)`;
});

// Use a single set of event listeners on the window for efficiency
window.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', doDrag);
window.addEventListener('mouseup', stopDrag);

// Listen for Shift key presses during a drag to toggle rotation
window.addEventListener('keydown', (e) => {
  if (isDragging && e.key === 'Shift') {
    isRotating = true;
  }
});
window.addEventListener('keyup', (e) => {
  if (isDragging && e.key === 'Shift') {
    isRotating = false;
  }
});