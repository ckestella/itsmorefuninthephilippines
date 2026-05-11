/*
  FLOWING TEXT — p5.js
  Developed and assisted with Claude (Anthropic), April 2026
  NOTES:
  - Barabara font flows like wind using sin() wave offsets per character
  - MouseX left half  → plays soundLeft
  - MouseX right half → plays soundRight
  - Canvas flexes with windowWidth / windowHeight on resize
*/
 
let bg;
let soundLeft, soundRight;
let audioUnlocked = false; // BUG FIX: browsers block audio until user interacts
 
// ── WIND / FLOW SETTINGS — tweak these ──
const TEXT_STRING = "#ITSMOREFUNINTHEPHILIPPINES";
const FONT_SIZE   = 100;
const WAVE_AMP    = 30;
const WAVE_SPEED  = 0.03;
const WAVE_SPREAD = 0.3;
const LETTER_GAP  = 62;
 
let waveOffset = 0;
 
function preload() {
  bg = loadImage('backg3.jpg');
  soundLeft  = loadSound('soundleft.mp3',
    () => console.log('✅ soundLeft loaded'),
    () => console.log('❌ soundLeft not found')
  );
  soundRight = loadSound('soundright.mp3',
    () => console.log('✅ soundRight loaded'),
    () => console.log('❌ soundRight not found')
  );
}
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}
 
function draw() {
  imageMode(CORNER);
  image(bg, 0, 0, width, height);
 
  let letters    = TEXT_STRING.split('');
  let totalWidth = letters.length * LETTER_GAP;
  let startX     = width / 2 - totalWidth / 2 + LETTER_GAP / 2;
  let baseY      = height / 2;
 
  noStroke();
  fill('rgb(230,223,100)');
  textFont('Barabara');
  textSize(FONT_SIZE);
 
  for (let i = 0; i < letters.length; i++) {
    let x = startX + i * LETTER_GAP;
    let y = baseY + sin(waveOffset + i * WAVE_SPREAD) * WAVE_AMP;
    text(letters[i], x, y);
  }
 
  waveOffset += WAVE_SPEED;

  if (overText()) cursor(HAND);
  else cursor(ARROW);

  // show prompt until audio is unlocked
  if (!audioUnlocked) {
    textFont('Barabara');
    textSize(30);
    fill('rgba(255,255,255,0.7)');
    text('CLICK ANYWHERE TO ENABLE THE SOUNDS OF PARADISE', width / 2, height - 30);
  }
}
 
function overText() {
  let halfW = (TEXT_STRING.length * LETTER_GAP) / 2;
  return abs(mouseX - width / 2) < halfW &&
         abs(mouseY - height / 2) < FONT_SIZE / 2 + WAVE_AMP;
}

function mousePressed() {
  if (!audioUnlocked) {
    userStartAudio(); // unlocks the browser audio context
    audioUnlocked = true;
    return; // first click just unlocks — play sound on next click
  }
  if (overText()) {
    document.getElementById('hashtag-link').click();
    return;
  }
  playZoneSound();
}
 
// ── mouseMoved still triggers after audio is unlocked ──
function mouseMoved() {
  if (!audioUnlocked) return; // do nothing until user has clicked once
  playZoneSound();
}
 
// ── shared sound logic ──
function playZoneSound() {
  if (mouseX < width / 2) {
    if (soundLeft && soundLeft.isLoaded() && !soundLeft.isPlaying()) {
      soundRight.stop(); // stop the other zone's sound
      soundLeft.play();
    }
  } else {
    if (soundRight && soundRight.isLoaded() && !soundRight.isPlaying()) {
      soundLeft.stop(); // stop the other zone's sound
      soundRight.play();
    }
  }
}
 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
 