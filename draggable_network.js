// program to move image within the bounds of a container, code from Stackover flow cuz idk JS that well
const container = document.getElementById('container');
const images = document.querySelectorAll('.draggable');

let zIndexCounter = 1;

images.forEach(img => {
  let offsetX, offsetY;

  img.addEventListener('mousedown', startDrag);
  img.addEventListener('touchstart', startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();

    const rect = container.getBoundingClientRect();
    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - rect.left - img.offsetLeft;
    offsetY = clientY - rect.top - img.offsetTop;

    img.style.zIndex = ++zIndexCounter;

    function onMove(e) {
      const moveX = (isTouch ? e.touches[0].clientX : e.clientX) - rect.left - offsetX;
      const moveY = (isTouch ? e.touches[0].clientY : e.clientY) - rect.top - offsetY;

      const maxX = container.clientWidth - img.clientWidth;
      const maxY = container.clientHeight - img.clientHeight;

      img.style.left = `${Math.max(0, Math.min(moveX, maxX))}px`;
      img.style.top = `${Math.max(0, Math.min(moveY, maxY))}px`;
    }

    function endMove() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', endMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', endMove);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', endMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', endMove);
  }
});
