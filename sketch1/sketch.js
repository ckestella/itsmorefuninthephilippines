/*
  WAVY TEXT EFFECT — p5.js
  Developed and assisted with Claude (Anthropic), April 2026

  NOTES:
  - Requires opentype.js in index.html for textToPoints
  - Render text letter-by-letter using font.textBounds() to advance x
  - Wave: x = p.x + sin(p.y * freq + frameCount * 0.05) * amp
  - mouseX → frequency, mouseY → amplitude
  - All-caps strings only (font limitation)
  - stroke() not fill() for POINTS shapes
*/

let font;
let mainPoints = [];
let backg;

let W, H;
const BEZEL = 28;
const FSIZE = 100;

function preload() {
  font = loadFont('BARABARA-final.otf');
  backg = loadImage('sandback.jpg')
}

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);

  let cx = W / 2;
  mainPoints = buildText('ITS MORE FUN', cx, H / 2 - 20, true);
  let line2 = buildText('IN THE PHILIPPINES!', cx, H / 2 + FSIZE + 10, true);
  mainPoints = mainPoints.concat(line2);
}

function buildText(word, cx, y, centered = false) {
  let pts = [];

  let totalW = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === ' ') { totalW += FSIZE * 0.4; continue; }
    let bounds = font.textBounds(word[i], 0, 0, FSIZE);
    totalW += bounds.w + 10;
  }

  let x = centered ? cx - totalW / 2 : cx;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === ' ') { x += FSIZE * 0.4; continue; }
    let charPts = font.textToPoints(word[i], x, y, FSIZE, { sampleFactor: 0.5 });
    pts = pts.concat(charPts);
    let bounds = font.textBounds(word[i], 0, 0, FSIZE);
    x += bounds.w + 10;
  }

  return pts;
}

function draw() {
  
  
  if (!font || mainPoints.length === 0) {
    background(28, 28, 30);
    fill(255);
    noStroke();
    textSize(20);
    text('', W / 2 - 50, H / 2);
    return;
  }
  
  imageMode(CENTER);
  image(backg, W / 2, H / 2, W, H);


  noStroke();
  rect(BEZEL, BEZEL, W - BEZEL * 2, H - BEZEL * 2, 10);

  fill(10);
  ellipse(W / 2, BEZEL / 2, 6, 6);
  
  let alpha = map(mouseY, H, 0, 0, 145);
  fill(255, 0, 0, alpha);
  noStroke();
  rect(0, 0, W, H);

  drawWave(mainPoints);
}

function drawWave(pointsArray) {
  if (pointsArray.length === 0) return;

  // up + down cursor to enable motion
  let freq = map(mouseY, H, 0, 0.01, 0.1);
  let amp  = map(mouseY, H, 0, 0, 75);

  stroke("white");
  strokeWeight(3);
  noFill();

  // frequency of the waving motion
  beginShape(POINTS);
  for (let p of pointsArray) {
    let x = p.x + sin(p.y * freq + frameCount * 0.08) * amp;
    vertex(x, p.y);
  }
  endShape();
}


