const scenes = document.querySelectorAll('.scene');
let current = 0;
let locked = false;
let filmMode = true;

const targetDate = new Date("April 18, 2026 00:00:00").getTime();

const ids = ["months","days","hours","minutes","seconds"];
const els = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));

function updateCountdown(){
  let diff = Math.max(0, targetDate - Date.now());
  let s = Math.floor(diff/1000);

  els.seconds.textContent = String(s%60).padStart(2,"0");
  s=Math.floor(s/60);
  els.minutes.textContent = String(s%60).padStart(2,"0");
  s=Math.floor(s/60);
  els.hours.textContent = String(s%24).padStart(2,"0");
  s=Math.floor(s/24);
  els.months.textContent = String(Math.floor(s/30)).padStart(2,"0");
  els.days.textContent = String(s%30).padStart(2,"0");
}
setInterval(updateCountdown,1000);
updateCountdown();

function showScene(i){
  scenes.forEach(s=>s.classList.remove('active'));
  scenes[i].classList.add('active');
}

function exitFilmMode(){
  filmMode=false;
  document.body.style.overflow='auto';
  scenes.forEach(s=>{
    s.classList.add('static');
    s.classList.remove('active');
  });
  document.getElementById('scrollHint')?.classList.add('hide');
}

function nextScene(){
  if(!filmMode||locked) return;
  if(current>=scenes.length-1){ exitFilmMode(); return; }
  locked=true;
  showScene(++current);
  setTimeout(()=>locked=false,1200);
}

function prevScene(){
  if(!filmMode||locked||current<=0) return;
  locked=true;
  showScene(--current);
  setTimeout(()=>locked=false,1200);
}

window.addEventListener('wheel',e=>{
  if(!filmMode) return;
  e.preventDefault();
  e.deltaY>0?nextScene():prevScene();
},{passive:false});

let startY=0;
window.addEventListener('touchstart',e=>startY=e.touches[0].clientY);
window.addEventListener('touchend',e=>{
  if(!filmMode) return;
  const endY=e.changedTouches[0].clientY;
  if(startY-endY>50) nextScene();
  if(endY-startY>50) prevScene();
});

showScene(0);
