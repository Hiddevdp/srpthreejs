import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true,
  antialias: true,
});
scene.background = new THREE.Color("#75b4ee");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);
camera.position.setX(25);
camera.position.setY(5);

const loader = new GLTFLoader();
let trex;

loader.load(
  "/meshes/trex/scene.gltf",
  function (gltf) {
    trex = gltf.scene;
    trex.scale.set(0.05, 0.05, 0.05);
    trex.position.set(0, -1.5, 7);
    trex.rotateY(Math.PI);
    trex.castShadow = true;
    trex.velocity = { x: 0, y: 0, z: 0 };
    trex.update = function (ground) {
      this.position.x += this.velocity.x;
      this.position.z += this.velocity.z;
      this.applyGravity(ground);
    };
    trex.applyGravity = function (ground) {
      this.velocity.y += this.gravity;

      if (boxCollision({ box1: this, box2: ground })) {
        this.velocity.y = 0;
        this.position.y = ground.top;
      } else {
        this.position.y += this.velocity.y;
      }
    };

    trex.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    trex.gravity = -0.01;
    scene.add(trex);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (trex && trex.velocity.y === 0) {
      trex.position.set(0, -1.499, 7);
      trex.velocity.y = 0.225;
    }
  }
});

class Box extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    color = "#00ff00",
    velocity = { x: 0, y: 0, z: 0 },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    zAcceleration = false,
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    );

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.receiveShadow = true;

    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;

    this.velocity = velocity;
    this.gravity = -0.01;
    this.zAcceleration = zAcceleration;
  }

  updateSides() {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  update(ground) {
    this.updateSides();

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;

    this.applyGravity(ground);
  }

  applyGravity(ground) {
    this.velocity.y += this.gravity;

    if (
      boxCollision({
        box1: this,
        box2: ground,
      })
    ) {
      this.velocity.y = 0;
      this.position.y = ground.top + this.height / 2;
    } else this.position.y += this.velocity.y;
  }
}

function boxCollision({ box1, box2 }) {
  const box1BoundingBox = new THREE.Box3().setFromObject(box1);
  const box2BoundingBox = new THREE.Box3().setFromObject(box2);

  return box1BoundingBox.intersectsBox(box2BoundingBox);
}

const ground = new Box({
  width: 5,
  height: 5,
  depth: 35,
  color: "#ffe29c",
  position: {
    x: 0,
    y: -4,
    z: 0,
  },
});
ground.receiveShadow = true;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 3, 1);
light.castShadow = true;

light.shadow.camera.left = -12;
light.shadow.camera.right = 12;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 1));

const controls = new OrbitControls(camera, renderer.domElement);

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highscore");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = `High Score: ${highScore}`;

function updateScore() {
  score += 1;
  scoreElement.textContent = `Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = `High Score: ${highScore}`;
    localStorage.setItem("highScore", highScore);
  }
}

// Cloud class
class Cloud extends THREE.Group {
  constructor() {
    super();

    // Big pill shape
    const bigPillGeometry = new THREE.CapsuleGeometry(1, 5, 4, 8);
    const bigPillMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const bigPill = new THREE.Mesh(bigPillGeometry, bigPillMaterial);
    bigPill.position.set(0, 0, 0);

    // Smaller pill shape
    const smallPillGeometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
    const smallPillMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const smallPill = new THREE.Mesh(smallPillGeometry, smallPillMaterial);
    smallPill.position.set(1, 0, 0);

    this.add(bigPill);
    this.add(smallPill);

    this.position.set(
      Math.random() * 50 - 75,
      Math.random() * 15 - 10,
      Math.random() * 100 - 50
    );
    this.rotateY(Math.PI / 2);
    this.rotateZ(Math.PI / 2);
  }

  update() {
    this.position.z += 0.05;
    if (this.position.z > 50) {
      this.position.z = -50;
    }
  }
}

// Create clouds
const clouds = [];
for (let i = 0; i < 7; i++) {
  const cloud = new Cloud();

  clouds.push(cloud);
  scene.add(cloud);
}

const rocks = [];

function createRock() {
  const geometry = new THREE.SphereGeometry(0.04, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const rock = new THREE.Mesh(geometry, material);
  rock.position.set(Math.random() * 5 - 2.5, -1.5, Math.random() * 35 - 17.5); // Random initial position
  rock.castShadow = true;
  rock.receiveShadow = true;
  rock.velocity = { x: 0, y: 0, z: 0.25 };
  rock.update = function (ground) {
    this.position.z += this.velocity.z;

    if (this.position.z > 17.5) {
      this.position.z = -17.5;
    }
  };
  scene.add(rock);
  rocks.push(rock);
}

for (let i = 0; i < 25; i++) {
  createRock();
}

const enemies = [];
let frames = 0;
let spawnRate = 70;

function createCactus() {
  loader.load(
    "/meshes/Cactus/cactus.glb",
    function (gltf) {
      const cactus = gltf.scene;
      cactus.scale.set(0.03, 0.03, 0.03);
      cactus.position.set(0, -1.5, Math.random() * -30 - 10);
      cactus.rotateY(Math.PI / 2);
      cactus.castShadow = true;
      cactus.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      cactus.velocity = { x: 0, y: 0, z: 0.25 };
      cactus.update = function (ground) {
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
        this.applyGravity(ground);
      };
      cactus.applyGravity = function (ground) {
        this.velocity.y += this.gravity;

        if (boxCollision({ box1: this, box2: ground })) {
          this.velocity.y = 0;
          this.position.y = ground.position.y + 2.4;
        } else {
          this.position.y += this.velocity.y;
        }
      };
      cactus.gravity = -0.01;
      scene.add(cactus);
      enemies.push(cactus);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function animate() {
  const animationId = requestAnimationFrame(animate);

  enemies.forEach((enemy, index) => {
    enemy.update(ground);
    if (
      boxCollision({
        box1: trex,
        box2: enemy,
      })
    ) {
      window.cancelAnimationFrame(animationId);
      alert(`Game Over! Your score was: ${score}`);
    }
    if (enemy.position.y < -10) {
      scene.remove(enemy);
      enemies.splice(index, 1);
    }
  });

  rocks.forEach((rock) => {
    rock.update(ground);
  });

  clouds.forEach((cloud) => cloud.update());

  if (trex) {
    trex.update(ground);
  }

  if (frames % spawnRate === 0) {
    createCactus();
  }

  frames++;
  controls.update();
  renderer.render(scene, camera);
  updateScore();
}

animate();
