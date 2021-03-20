import SceneCamera from './classes/scene-camera.js';
import * as THREE from '/build/three.module.js';
import Stats from '/jsm/libs/stats.module.js';
import { CSM } from '/jsm/csm/CSM.js';
import Portal from './classes/portal.js';
import SceneDesert from './classes/scenes/desert.js';
import SceneMinecraft from './classes/scenes/minecraft.js';
import SceneForest from './classes/scenes/forest.js';
import SceneYMap from './classes/yMap.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
const csm = new CSM({
	maxFar: 800,
	cascades: 4,
	shadowMapSize: 1024,
	lightDirection: new THREE.Vector3(1, -1, 1).normalize(),
	camera: camera,
  parent: scene,
  lightIntensity: 0.5,
});

const bounds = {
  x: [-100, 100],
  z: [-100, 100],
};

const stats = Stats();
document.body.appendChild(stats.dom);
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
scene.add(ambientLight);
scene.background = new THREE.Color(0x67c4d5);
scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
setTimeout(() => {
  const glassx = (Math.random() * 2 - 1) * bounds.x[1];
  const glassz = (Math.random() * 2 - 1) * bounds.z[1];
  const yMap = new SceneYMap();
  const worlds = [
    new SceneDesert(scene, bounds, csm, glassx, glassz, 0, yMap),
    new SceneMinecraft(scene, bounds, csm, glassx, glassz, 2000, yMap),
    new SceneForest(scene, bounds, csm, glassx, glassz, 1000, yMap),
  ];
  worlds.sort((a, b) => Math.random() - 0.5);
  const sceneCamera = new SceneCamera(scene, camera, renderer, bounds, stats, csm, yMap, worlds);
  const portal = new Portal(scene, camera, renderer);
  worlds.forEach((world) => portal.receiveGlass(world.getGlass()));
  sceneCamera.isTouchingGlass = portal.isTouchingGlass.bind(portal);
});
