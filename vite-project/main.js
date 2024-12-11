import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true,
  antialias: true,
});
scene.background = new THREE.Color("orange");
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(8);
camera.position.setX(0);
camera.position.setY(0);

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

    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;

    this.velocity = velocity;
    this.gravity = -0.005;
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
    if (this.zAcceleration) {
      this.velocity.z += 0.001;
    }

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
      this.velocity.y *= 0.5;
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }
}

function boxCollision({ box1, box2 }) {
  const xCollision = box1.right > box2.left && box1.left < box2.right;
  const yCollision =
    box1.bottom + box1.velocity.y < box2.top && box1.top > box2.bottom;
  const zCollision = box1.front > box2.back && box1.back < box2.front;

  return xCollision && zCollision && yCollision;
}

const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  color: 0x00ff00,
  velocity: {
    x: 0,
    y: 0,
    z: 0,
  },
  position: {
    x: 0,
    y: -1.5,
    z: 0,
  },
  zAcceleration: false,
});
cube.castShadow = true;
scene.add(cube);

const pivot = new THREE.Group();
pivot.add(cube);
scene.add(pivot);

const ground = new Box({
  width: 11,
  height: 0.1,
  depth: 11,
  color: "#0369a1",
  position: {
    x: 0,
    y: -2,
    z: 0,
  },
});
ground.receiveShadow = true;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.y = 3;
light.position.x = 2;
light.position.z = 1;
light.castShadow = true;
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const controls = new OrbitControls(camera, renderer.domElement);

const keys = {
  a: {
    pressed: false,
    rotate: false,
    targetPosition: 0,
    targetRotation: 0,
  },
  d: {
    pressed: false,
    rotate: false,
    targetPosition: 0,
    targetRotation: 0,
  },
  w: {
    pressed: false,
    rotate: false,
    targetPosition: 0,
    targetRotation: 0,
  },
  s: {
    pressed: false,
    rotate: false,
    targetPosition: 0,
    targetRotation: 0,
  },
};

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.a.pressed = true;
      break;
    case "KeyD":
      keys.d.pressed = true;
      break;
    case "KeyW":
      keys.w.pressed = true;
      break;
    case "KeyS":
      keys.s.pressed = true;
      break;
    case "Space":
      if (canPressSpace) {
        // Spacebar action
        cube.velocity.y = 0.15;

        // Set cooldown
        canPressSpace = false;
        setTimeout(() => {
          canPressSpace = true;
        }, 1000); // 2 seconds cooldown
      }

      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyW":
      keys.w.pressed = false;
      break;
    case "KeyS":
      keys.s.pressed = false;
      break;
  }
});

const enemies = [];
let canPressSpace = true;
let frames = 0;
let spawnRate = 0;
function animate() {
  const animationId = requestAnimationFrame(animate);
  //movement code

  cube.velocity.x = 0;
  cube.velocity.z = 0;
  // Movement code
  if (
    keys.a.pressed &&
    !keys.a.rotate &&
    !keys.d.rotate &&
    !keys.w.rotate &&
    !keys.s.rotate
  ) {
    keys.a.rotate = true;
    cube.position.set(
      cube.position.x + 0.5,
      cube.position.y + 0.5,
      cube.position.z
    );
    cube.position.set(
      cube.position.x - 0.5,
      cube.position.y - 0.5,
      cube.position.z
    );
    keys.a.targetPosition = cube.position.x - cube.width; // Set target position
    keys.a.targetRotation = cube.rotation.z + Math.PI / 2; // Set target rotation
  }
  if (keys.a.rotate) {
    if (cube.position.x > keys.a.targetPosition) {
      cube.position.x -= 0.05;
      cube.rotation.z += (0.05 * (Math.PI / 2)) / cube.width; // Increment rotation
    } else {
      cube.position.x = keys.a.targetPosition;
      cube.rotation.z = keys.a.targetRotation;
      keys.a.rotate = false;
      cube.rotation.set(0, 0, 0); // Reset orientation
    }
  }

  if (
    keys.d.pressed &&
    !keys.d.rotate &&
    !keys.a.rotate &&
    !keys.w.rotate &&
    !keys.s.rotate
  ) {
    keys.d.rotate = true;
    keys.d.targetPosition = cube.position.x + cube.width; // Set target position
    keys.d.targetRotation = cube.rotation.z - Math.PI / 2; // Set target rotation
  }
  if (keys.d.rotate) {
    if (cube.position.x < keys.d.targetPosition) {
      cube.position.x += 0.05;
      cube.rotation.z -= (0.05 * (Math.PI / 2)) / cube.width; // Increment rotation
    } else {
      cube.position.x = keys.d.targetPosition;
      cube.rotation.z = keys.d.targetRotation;
      keys.d.rotate = false;
      cube.rotation.set(0, 0, 0); // Reset orientation
    }
  }

  if (
    keys.w.pressed &&
    !keys.w.rotate &&
    !keys.a.rotate &&
    !keys.d.rotate &&
    !keys.s.rotate
  ) {
    keys.w.rotate = true;
    keys.w.targetPosition = cube.position.z - cube.depth; // Set target position
    keys.w.targetRotation = cube.rotation.x - Math.PI / 2; // Set target rotation
  }
  if (keys.w.rotate) {
    if (cube.position.z > keys.w.targetPosition) {
      cube.position.z -= 0.05;
      cube.rotation.x -= (0.05 * (Math.PI / 2)) / cube.depth; // Increment rotation
    } else {
      cube.position.z = keys.w.targetPosition;
      cube.rotation.x = keys.w.targetRotation;
      keys.w.rotate = false;
      cube.rotation.set(0, 0, 0); // Reset orientation
    }
  }

  if (
    keys.s.pressed &&
    !keys.s.rotate &&
    !keys.a.rotate &&
    !keys.d.rotate &&
    !keys.w.rotate
  ) {
    keys.s.rotate = true;
    keys.s.targetPosition = cube.position.z + cube.depth; // Set target position
    keys.s.targetRotation = cube.rotation.x + Math.PI / 2; // Set target rotation
  }
  if (keys.s.rotate) {
    if (cube.position.z < keys.s.targetPosition) {
      cube.position.z += 0.05;
      cube.rotation.x += (0.05 * (Math.PI / 2)) / cube.depth; // Increment rotation
    } else {
      cube.position.z = keys.s.targetPosition;
      cube.rotation.x = keys.s.targetRotation;
      keys.s.rotate = false;
      cube.rotation.set(0, 0, 0); // Reset orientation
    }
  }

  cube.update(ground);
  enemies.forEach((enemy) => {
    enemy.update(ground);
    if (
      boxCollision({
        box1: cube,
        box2: enemy,
      })
    ) {
      window.cancelAnimationFrame(animationId);
    }
  });

  if (frames % spawnRate === 0) {
    if (spawnRate > 20) {
      spawnRate -= 20;
    }
    const enemy = new Box({
      width: 1,
      height: 1,
      depth: 1,
      color: 0xff0000,
      velocity: {
        x: 0,
        y: 0,
        z: 0.01,
      },
      position: {
        x: (Math.random() - 0.5) * 10,
        y: 2,
        z: -20,
      },
      zAcceleration: true,
    });
    enemy.castShadow = true;
    scene.add(enemy);
    enemies.push(enemy);
    console.log(enemy.position.x);
  }
  console.log(cube.velocity.z);
  frames++;
  controls.update();
  renderer.render(scene, camera);
}

animate();
