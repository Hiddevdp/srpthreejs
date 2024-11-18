# Three.js SRP

Ik wil mijn met mijn SRP graag gaan leren over [Three.js](https://threejs.org/).

## Introductie

Doordat ik mij wil focussen op frontend development ben ik veel bezig geweest met code ben ik de verschillende technieken erg interessant gaan vinden. Daarnaast heb ik een fascinatie voor 3d modeleren en heb hier eerder een SRP over gedaan en een keuzevak gevolgd. Ik heb hier dus al wat ervaring mee. Ik wil dus bij deze SRP die twee dingen combineren en dat gaat perfect met Three.js. Dit is namelijk een JavaScript library die gebruikt wordt geanimeerde 3D-computergraphics te maken en weer te geven in een webbrowser met behulp van WebGL.

### Studieplan

Ik wil beginnen met een [tutorial](https://youtu.be/Q7AOvWpIVHU?si=e1vwXO631DTF9ql2) op Youtube volgen om de basis te leggen met het begrijpen hoe Three.js werkt. Tijdens het werken hieraan hoop ik inspiratie te krijgen over wat ik uiteindelijk wil gaan maken als SRP project. Terwijl ik hieraan werkIk heb een planning gemaakt waar ik mij aan ga houden:

| Wanneer ga wat doen? | Weeknr | Aantal uren |
| -------------------- | ------ | ----------- |
| Tutorial volgen      | 46     | 8           |
| Werken aan project   | 47     | 8           |
| Werken aan project   | 48     | 8           |
| Documentatie         | 49     | 4           |

<details>
<summary>Week 1</summary>




Deze week staat in het teken van de eerste zetten met Three.js. Ik ging aan de slag met de tutorial om een beter idee te krijgen hoe three.js werkt en wat er allemaal mogelijk is met deze tool. De tutorial neemt je mee met het maken van een paar simpele vormen en legt een aantal basisdingen uit van Three.js. 

- Het aanmaken van je canvas
- Scene, camera en renderengine instellen
- Je eerste 3d geometrie aanmaken
- Verschillende soorten lichten instellen voor je scene
- Helpers zoals grids en lichthelpers
- Functions voor het random scatteren van objecten
- Textures, backgrounds en materials instellen
- (Scroll)animaties instellen

Eerste "torus" aangemaakt.
![1](vite-project/img/readme-img/1.png)

Animatie gegeven, achtergrond voor het canvas, kubus met eigen texture en Sphere met texture van de maan.
![2](vite-project/img/readme-img/2.png)

Code na de tutorial:

```javascript
import "./style.css";
import * as THREE from "three";

// Controlls om in de browser te kunnen bewegen met de muis
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Functie om sterren random te verspreiden
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("img/space.jpg");
scene.background = spaceTexture;

// Avatar

const HiddeTexture = new THREE.TextureLoader().load("img/bold.jpg");

const hidde = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: HiddeTexture })
);

scene.add(hidde);

// Moon

const moonTexture = new THREE.TextureLoader().load("img/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("img/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
```
</details>
<details>
  <summary>Week 2</summary>
  Deze week wil ik gaan starten met het maken van mijn project. Ik ga eerst inspiratie opdoen voor een cool idee om te maken. Het moet natuurlijk ook haalbaar zijn voor mijn niveau en moet binnen de tijd dusdanig af zijn om beoordeeld te kunnen worden.
</details>
