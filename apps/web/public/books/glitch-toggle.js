// Toggle overlay position for fx-glitch tokens so data-glitch floats like echo-ghost
(function(){
  function onClick(e){
    const el = e.target.closest('.fx-glitch');
    if(!el) return;
    // toggle the echo overlay
    el.classList.toggle('glitch-echo');
  }
  document.addEventListener('click', onClick, false);
})();
