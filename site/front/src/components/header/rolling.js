export function animateText() {
  let index = 0;

  function showText() {
    const texts = document.querySelectorAll('.rolling-text'); 
    if (texts.length === 0) return; 

    
    texts.forEach((text, i) => {
      text.classList.remove('active', 'left', 'right');

      if (i === (index + 1) % texts.length) {
        text.classList.add('left'); 
      } else if (i === index) {
        text.classList.add('active'); 
      } else if (i === (index + texts.length - 1) % texts.length) {
        text.classList.add('right'); 
      }
    });

    
    index = (index + 1) % texts.length;
  }

 
  const interval = setInterval(showText, 4000); 

  
  showText();

  
  return () => clearInterval(interval);
}
