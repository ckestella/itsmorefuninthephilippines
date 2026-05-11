/*
  FREE FALL OBJECTS — p5.js
  Developed and assisted with Claude (Anthropic), April 2026
  Assisted using Liat's coding example for this subject.
  NOTES:
  - Creating complex physics to create the free falling effect via mousePressed(), mouseDragged(), hits(o), and mouseReleased()
  - Text words are physics objects just like images — they fall, bounce, and can be grabbed
  - "Explore More" button is a draggable physics object drawn with canvas shapes
*/
 
const G = 0.55, B = 0.48, F = 0.82; // gravity, bounce, friction
const IMG_SIZE = 120;
 
let bg;
let imgs = [];
let objs, held;
let btnPressX, btnPressY, btnWasDragged;
 
const WORDS = ["ITS", "MORE", "FUN", "IN", "THE", "PHILIPPINES"];
 
function preload() {
  bg = loadImage('backg1.jpg');
  imgs[0] = loadImage('bleachbottle.png');
  imgs[1] = loadImage('plasticbag.png');
  imgs[2] = loadImage('straw.png');
  imgs[3] = loadImage('bottle.png');
}
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
 
  const TRASH = [
    '🛢️', '🛢️', '🛢️', '🛢️', '🛢️', '🛢️',
    '🛢️', '🛢️', '🛢️', '🛢️', '🛢️', '🛢️',
    imgs[0], imgs[0], imgs[1], imgs[1], imgs[2], imgs[3]
  ];
 
  objs = TRASH.map(e => ({
    type: 'trash',
    e,
    x: random(80, width-80), y: random(-height, 0),
    vx: random(-1, 1), vy: random(0, 2),
    a: random(TWO_PI), av: random(-0.08, 0.08),
    grabbed: false, hist: []
  }));
 
  for (let w of WORDS) {
    objs.push({
      type: 'word',
      e: w,
      x: random(150, width-150), y: random(-height*0.5, 0),
      vx: random(-1, 1), vy: random(0, 2),
      a: random(-0.1, 0.1),
      av: random(-0.02, 0.02),
      grabbed: false, hist: []
    });
  }
 
  // ── "Explore More" button — rendered first so it appears behind all other objects ──
  objs.unshift({
    type: 'button',
    e: 'EXPLORE MORE',
    x: width / 2,
    y: random(-300, -100),    // starts above canvas, falls in
    vx: random(-1, 1),
    vy: random(0, 2),
    a: random(-0.05, 0.05),
    av: random(-0.01, 0.01),
    grabbed: false, hist: [],
    w: 390,                   // button width
    h: 300                     // button height
  });
}
 
// ── draws a rounded rectangle (pill shape) for the button ──
function drawButton(o) {
  let bw = o.w, bh = o.h, r = bh / 2; // r = corner radius = half height = full pill
 
  // gold background
  fill('#FFD700');
  noStroke();
  drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
  drawingContext.shadowBlur = 14;
  drawingContext.shadowOffsetY = 4;
 
  // draw rounded rect centered at (0,0) using beginShape + arcs
  beginShape();
  // p5's rect() with radius support — easiest approach
  rectMode(CENTER);
  rect(0, 0, bw, bh, r);
  endShape();
 
  // white Barabara label
  drawingContext.shadowColor = 'transparent'; // no shadow on text
  textFont('Barabara');
  textSize(35);
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  text('#EXPLOREMORE', 0, 0);
}
 
function draw() {
  imageMode(CORNER);
  let scale = max(width / bg.width, height / bg.height);
  let bw = bg.width * scale, bh = bg.height * scale;
  image(bg, (width - bw) / 2, (height - bh) / 2, bw, bh);
  imageMode(CENTER);

  // center instruction text — drawn behind all physics objects
  push();
  textFont('Barabara');
  textSize(35);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(255);
  text("DIG OUT THE PARADISE'S TRASH TO FIND THE HASHTAG TO HEAD TO THE NEXT PAGE!", width / 2, height / 2);
  pop();

  for (let o of objs) {
    // physics — same for all types
    if (!o.grabbed) {
      o.vy += G;
      o.x += o.vx; o.y += o.vy;
      o.a += o.av;
 
      const floor = height - 42;
      if (o.y > floor) {
        o.y = floor;
        o.vy = abs(o.vy) > 2 ? -o.vy * B : 0;
        o.vx *= F; o.av *= 0.85;
      }
      if (o.x < 32)       { o.x = 32;       o.vx =  abs(o.vx)*B; }
      if (o.x > width-32) { o.x = width-32; o.vx = -abs(o.vx)*B; }
    }
 
    push();
    translate(o.x, o.y);
    rotate(o.a);
    drawingContext.shadowColor = 'rgba(0,0,0,0.25)';
    drawingContext.shadowBlur = 10;
 
    if (o.type === 'button') {
      drawButton(o);
 
    } else if (o.type === 'word') {
      textFont('Barabara');
      textSize(120);
      fill('white');
      noStroke();
      textAlign(CENTER, CENTER);
      text(o.e, 0, 0);
 
    } else if (typeof o.e === 'string') {
      textSize(250);
      text(o.e, 0, 0);
 
    } else {
      image(o.e, 0, 0, IMG_SIZE + 500, IMG_SIZE + 500);
    }
 
    pop();
  }
}
 
// hit detection per type
function hits(o) {
  let dx = mouseX-o.x, dy = mouseY-o.y;
  let lx = cos(-o.a)*dx - sin(-o.a)*dy;
  let ly = sin(-o.a)*dx + cos(-o.a)*dy;
 
  let hw, hh;
  if (o.type === 'button') {
    hw = o.w / 2; hh = o.h / 2;          // exact button dimensions
  } else if (o.type === 'word') {
    hw = 200; hh = 70;
  } else if (typeof o.e === 'string') {
    hw = 125; hh = 125;
  } else {
    hw = (IMG_SIZE + 500) / 2;
    hh = (IMG_SIZE + 500) / 2;
  }
 
  return abs(lx) < hw && abs(ly) < hh;
}
 
function mousePressed() {
  for (let i = objs.length-1; i >= 0; i--) {
    if (hits(objs[i])) {
      held = objs[i];
      held.grabbed = true;
      held.vx = held.vy = held.av = 0;
      held.offX = held.x - mouseX;
      held.offY = held.y - mouseY;
      held.hist = [{ x: mouseX, y: mouseY, t: millis() }];
      if (held.type === 'button') {
        btnPressX = mouseX; btnPressY = mouseY; btnWasDragged = false;
      }
      break;
    }
  }
}
 
function mouseDragged() {
  if (!held) return;
  if (held.type === 'button') {
    const dx = mouseX - btnPressX, dy = mouseY - btnPressY;
    if (sqrt(dx*dx + dy*dy) > 10) btnWasDragged = true;
  }
  held.x = mouseX + held.offX;
  held.y = mouseY + held.offY;
  held.hist.push({ x: mouseX, y: mouseY, t: millis() });
  if (held.hist.length > 6) held.hist.shift();
}
 
function mouseReleased() {
  if (!held) return;
  if (held.type === 'button' && !btnWasDragged) {
    document.getElementById('explore-more').click();
    return;
  }
  held.grabbed = false;
  const h = held.hist;
  if (h.length >= 2) {
    const dt = (h.at(-1).t - h[0].t) || 16;
    held.vx = (h.at(-1).x - h[0].x) / dt * 16;
    held.vy = (h.at(-1).y - h[0].y) / dt * 16;
    held.av = held.vx * 0.018;
  }
  held = null;
}
 
function windowResized() { resizeCanvas(windowWidth, windowHeight); }