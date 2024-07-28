import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

function init() {
  // camera perspective:
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(1, 1, 20);

  // 3D scene:
  scene = new THREE.Scene();

  // renderer:
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xEBEBEA);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  // orbit controller:
  const controls = new OrbitControls(camera, renderer.domElement);

  // lighting:
  const ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  // glTf 2.0 loader:
  const loader = new GLTFLoader().setPath('models/gltf/pier/');
  loader.load('pier.gltf', async function (gltf) {
    const model = gltf.scene;
    // wait until the model can be added to the scene 
    // without blocking due to shader compilation
    await renderer.compileAsync(model, camera, scene);
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.x = 0; 
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0; 

    scene.add(model);
  });

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

//
// ------ entry point ------ 
//

let camera, scene, renderer;

// div container for web page:
const container = document.getElementById('model_container');

if (WebGL.isWebGL2Available()) {
  init();
  animate(); // animation loop
} else {
  // graphics card does not support WebGL 2
  // https://get.webgl.org/get-a-webgl-implementation/
  const warning = WebGL.getWebGL2ErrorMessage();
  container.appendChild(warning);
}
