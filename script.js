import {
  MazeGrid,
  RecursiveBacktracker
} from "https://unpkg.com/legendary-mazes@1.2.0/legendary-mazes.js";

kaboom({
  width: 500,
  height: 500,
  root: document.getElementById(`content`),
  background: [14, 21, 37]
})

// Sounds
loadSound("finish", "sounds/finish.wav")
loadSound("death", "sounds/death.wav")
loadSound("hit", "sounds/hit.wav")
loadSound("heal", "sounds/heal.wav")
loadSound("maxHealth", "sounds/maxHealth.wav")
loadSound("wall", "sounds/wall.wav")
loadSound("loop1", "sounds/treadcarefully.wav")

// Sprites
loadSprite("player", "sprites/player.png")

loadSprite("overlay", "sprites/overlay.png")

loadSprite("enemy1", "sprites/enemy1.png")
loadSprite("enemy2", "sprites/block.png")

loadSprite("heart", "sprites/heart.png")
loadSprite("heart2", "sprites/heart2.png")
loadSprite("heart3", "sprites/heart3.png")
loadSprite("heart4", "sprites/heart4.png")

const roundOffTo = (num, factor = 1) => {
  const quotient = num / factor;
  const res = Math.round(quotient) * factor;
  return res;
};

let g = {}

function addWall(x, y) {
  add([
    offscreen({ destroy: true }),
    pos(x, y),
    rect(50, 50),
    area(),
    Math.random() > 0.5 ? color(43, 50, 69) : color(46, 53, 71),
    body(),
    "wall",
    `${x}:${y}`,
    fadeIn(Math.random() * 2)
  ])
}

function addEnemy(spr, type, x, y) {
  add([
    pos(x, y),
    sprite(spr),
    scale(4),
    area(),
    anchor("center"),
    body(),
    type == "blind" ? {
      update() {
        let dp = vec2(player.pos.x, player.pos.y)
        dp.x += (Math.random() * 500) - 250
        dp.y += (Math.random() * 500) - 250
        this.moveTo(dp, 200)
      },
    } :
      type == "slow" ? {
        update() {
          let dp = vec2(player.pos.x, player.pos.y)
          dp.x
          dp.y
          this.moveTo(dp, 50)
        },
      } : "",
    "enemy",
    `enemy${type}`
  ])
}

function generateMaze() {
  const maze = new MazeGrid(100, 100);
  const builder = new RecursiveBacktracker(maze);

  builder.build()

  for (let x = 1; x < 200; x++) {
    for (let y = 1; y < 200; y++) {
      let t = maze.get(x, y);
      g[`${(x * 50) - 5050}:${(y * 50) - 5050}`] = t

      if (t === 0 && Math.random() > 0.9975) {
        add([
          offscreen({ hide: true }),
          pos((x * 50) - 5075, (y * 50) - 5075),
          sprite(`heart`),
          scale(2),
          area(),
          anchor("center"),
          z(-1),
          "heart",
          "nowall"
        ])
      } else if (t === 0 && Math.random() > 0.9975) {
        add([
          offscreen({ hide: true }),
          pos((x * 50) - 5075, (y * 50) - 5075),
          sprite(`enemy2`),
          scale(2.5),
          area(),
          anchor("center"),
          "enemy",
          "nowall"
        ])
      }
    }
  }

  add([
    pos(5000, -5500),
    rect(500, 11000),
    area(),
    color(129, 247, 129),
    "end",
  ])
  add([
    pos(-5500, -5500),
    rect(500, 11000),
    area(),
    color(129, 247, 129),
    "end",
  ])
  add([
    pos(-5500, -5500),
    rect(11000, 500),
    area(),
    color(129, 247, 129),
    "end",
  ])
  add([
    pos(-5500, 5000),
    rect(11000, 500),
    area(),
    color(129, 247, 129),
    "end",
  ])
}

let player = add([
  pos(0, 0),
  sprite("player"),
  scale(4),
  area(),
  anchor("center"),
  body(),
  "player",
  health(3)
])

let hp = add([
  pos(60, 450),
  sprite("heart"),
  scale(4),
  anchor("center"),
  fixed(),
  z(3)
])

add([
  pos(0, 0),
  sprite("overlay"),
  fixed(),
  z(2)
])

const SPEED = 300
const BUTTONSPEED = 400

onKeyDown("right", () => {
  player.move(SPEED, 0)
})
onKeyDown("down", () => {
  player.move(0, SPEED)
})
onKeyDown("up", () => {
  player.move(0, -SPEED)
})
onKeyDown("left", () => {
  player.move(-SPEED, 0)
})

document.getElementById(`up`).addEventListener("click", () => {
  player.move(0, -BUTTONSPEED)
})
document.getElementById(`down`).addEventListener("click", () => {
  player.move(0, BUTTONSPEED)
})
document.getElementById(`left`).addEventListener("click", () => {
  player.move(-BUTTONSPEED, 0)
})
document.getElementById(`right`).addEventListener("click", () => {
  player.move(BUTTONSPEED, 0)
})

onCollide("wall", "player", () => {
  play("wall")
})

onCollide("wall", "nowall", (w, h) => {
  h.destroy()
})

onCollide("enemy", "player", (e, p) => {
  p.hurt(1)
  e.destroy()
  shake(50)
})

onCollide("enemy", "enemy", (e, p) => {
  p.destroy()
  e.destroy()
})

let sd = Date.now() / 1000
onCollide("player", "end", (p, e) => {
  play("finish")
  window.location.href = `/end.html?t=${((Date.now() / 1000) - sd).toFixed(2)}`
})

onCollide("player", "heart", (p, h) => {
  if (p.hp() !== 3) {
    p.heal(1)
    play("heal")
    shake(10)
    h.destroy()
  } else {
    play("maxHealth")
  }
})

player.on("hurt", () => {
  play("hit")
  switch (player.hp()) {
    case 1:
      hp.use(sprite("heart3"))
      music.speed(1.3)
      break;
    case 2:
      hp.use(sprite("heart2"))
      music.speed(1.1)
      break;
  }
})

player.on("heal", () => {
  switch (player.hp()) {
    case 2:
      hp.use(sprite("heart2"))
      music.speed(1.1)
      break;
    case 3:
      hp.use(sprite("heart"))
      music.speed(1)
      break;
  }
})

player.on("death", () => {
  hp.use(sprite("heart4"))
  play("death")
  player.paused = true
  player.hidden = true
  window.location.reload()
})

let antiClipLast = vec2(0, 0)
let antiClip = false

let canHurtFromAntiClip = true

  ; (() => { // Anti anti anti clip
    let ac = false
    setInterval(() => {
      if (antiClip) {
        ac = true
      } else if (ac == true) {
        player.hurt(999)
      }
    }, 100)
  })();

onUpdate(() => {
  let x = roundOffTo(player.pos.x, 50)
  let y = roundOffTo(player.pos.y, 50)
  for (let xo = -400; xo < 400; xo += 50) {
    for (let yo = -400; yo < 400; yo += 50) { // xo, yo (;
      let hx = x + xo
      let hy = y + yo

      if (get(`${hx}:${hy}`).length < 1) {
        if (!isNaN(g[`${hx}:${hy}`]) && g[`${hx}:${hy}`] == 0) {
          addWall(hx, hy)
        }
      }
    }
  }
  camPos(player.pos)

  if (antiClip) {
    if (antiClipLast.dist(player.pos) > 55 && canHurtFromAntiClip) {
      player.hurt(1)
      canHurtFromAntiClip = false
      setTimeout(() => {
        canHurtFromAntiClip = true
      }, 100)
    }
    antiClipLast = player.pos
  }
})

// STARTING FUNCTIONS

// Zoom on player
let s = 20
let out = setInterval(() => {
  if (s <= 1) {
    camScale(1)
    clearInterval(out)
  } else {
    s -= s / 50
    camScale(s)
  }
}, 10)

// Music
let music = play("loop1", {
  volume: 0.8,
  loop: true
});

// Load maze
generateMaze()

// Spawn enemies
setInterval(() => {
  addEnemy(`enemy1`, Math.random() > 0.5 ? `blind` : `slow`, (Math.random() * 10000 - 5000), Math.random() > 0.5 ? -5500 : 5500)
}, 15000)

// Wait for antiClip
setTimeout(() => {
  antiClip = true
}, 500)