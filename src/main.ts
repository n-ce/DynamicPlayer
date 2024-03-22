import './style.css';
import 'beercss';

// Eruda
if (import.meta.env.DEV)
  import('eruda').then(eruda => eruda.default.init());

// DOM nodes
const audio = document.querySelector('audio') as HTMLAudioElement;
const audBtn = document.getElementById('actionBtn') as HTMLButtonElement;
const inputContainer = document.getElementById('input') as HTMLDivElement;
const input = inputContainer.firstElementChild as HTMLInputElement;
const dashSwitch = document.querySelector('input[type="checkbox"]') as HTMLInputElement;

// Variables 
const api = 'https://invidious.fdn.fr';
const getManifest = (id: string) => api + '/api/manifest/dash/id/' + id;
const mpd = getManifest('tCDvOQI3pco');
const playStates = ['stop', 'play_arrow', 'pause'];
let isPlaying = false;

function setAudIcon(state: number = 0) {
  // paragraph has same functionality as italic in js context
  (audBtn.firstElementChild as HTMLParagraphElement).textContent = playStates[state];
  isPlaying = state === 2;
}


audBtn.addEventListener('click', () => {
  isPlaying ?
    audio.pause() :
    audio.play();
})
audio.addEventListener('playing', () => {
  setAudIcon(2);
  inputContainer.removeChild(inputContainer.lastElementChild as HTMLProgressElement);
})
audio.addEventListener('pause', () => {
  setAudIcon(1);
})


input.addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;
  audio.src = input.value;
  const spinner = document.createElement('progress');
  spinner.className = 'circle';
  inputContainer.appendChild(spinner);
})


let dash = false;

dashSwitch.addEventListener('click', async () => {
  dash = !dash;
  if (!dash) return;


  const dashjs = await import('dashjs').then(dash => dash.default.MediaPlayer);

  dashjs()
    .create()
    .initialize(audio, mpd)
})


