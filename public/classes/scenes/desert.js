import SceneCreator from '../scene-creator.js';
import * as THREE from '/build/three.module.js';
const loader = new THREE.TextureLoader();

export default class SceneDesert extends SceneCreator {
  constructor(scene, bounds, csm, glassX, glassZ, posX, yMap) {
    super(scene, bounds, csm, glassX, glassZ);
    this.posX = posX;
    this.yMap = yMap;
    this.loadTextures();
    super.loadFloor();
    this.createGlass(this.posX + this.glassX, this.glassZ);
  }

  changeScene() {
    this.scene.background = new THREE.Color(0x06007d);
  }

  loadTextures() {
    this.brickMaterial = new THREE.MeshPhongMaterial({
      map: loader.load('resources/images/sand.jpg'),
    });
    this.csm.setupMaterial(this.brickMaterial);
    const textureSand = loader.load('resources/images/sand.jpg');
    textureSand.wrapS = THREE.RepeatWrapping;
    textureSand.wrapT = THREE.RepeatWrapping;
    textureSand.repeat.set( 50, 50 );
    this.floorMaterial = new THREE.MeshPhongMaterial({
      map: textureSand,
    });
    this.csm.setupMaterial(this.floorMaterial);
  }

  createMaterials() {
    this.loaded = true;
    for (let x = this.bounds.x[0]; x < this.bounds.x[1]; x++) {
      for (let z = this.bounds.z[0]; z < this.bounds.z[1]; z++) {
        if (Math.random() < 0.001 && Math.abs(x) < this.bounds.x[1] - 10 && Math.abs(z) < this.bounds.z[1] - 10) {
          this.createMountain(this.posX + x, z);
        }
      }
    }
  }

  createMountain(x, z) {
    const height = Math.floor(Math.random() * Math.random() * 25);
    let rest = 2 * height;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j <= rest; j++) {
        for (let k = 0; k <= rest; k++) {
          if (j === 0 || k === 0 || j === rest || k === rest) {
            this.createBrickCube(x + j - rest / 2, i + 1, z + k - rest / 2, this.brickMaterial);
            this.yMap.setYPos(x + j - rest / 2, z + k - rest / 2, i + 1);
          }
        }
      }
      rest = rest - 2;
      if (rest === 0) {
        this.createBrickCube(x, i + 2, z, this.brickMaterial);
        this.yMap.setYPos(x, z, i + 2);
      }
    }
  }
}