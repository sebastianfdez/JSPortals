import SceneCreator from '../scene-creator.js';
import * as THREE from '/build/three.module.js';
const loader = new THREE.TextureLoader();

export default class SceneMinecraft extends SceneCreator {
  constructor(scene, bounds, csm, glassX, glassZ, posX, yMap) {
    super(scene, bounds, csm, glassX, glassZ);
    this.posX = posX;
    this.yMap = yMap;
    this.loadTextures();
    super.loadFloor();
    this.createGlass(this.posX + this.glassX, this.glassZ);
  }

  changeScene() {
    this.scene.background = new THREE.Color(0x48e4ff);
  }

  loadTextures() {
    this.brickMaterial = new THREE.MeshLambertMaterial({
      map: loader.load('resources/images/wall.jpg'),
    });
    this.csm.setupMaterial( this.brickMaterial );
    const textureGrass = loader.load('resources/images/grass.jpeg');
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set( 50, 50 );
    this.floorMaterial = new THREE.MeshPhongMaterial({
      map: textureGrass,
    });
    this.csm.setupMaterial(this.floorMaterial);
  }

  createMaterials() {
    this.loaded = true;
    for (let x = this.bounds.x[0]; x < this.bounds.x[1]; x++) {
      for (let z = this.bounds.z[0]; z < this.bounds.z[1]; z++) {
        if (Math.random() < 0.05 && (Math.abs(x - this.glassX) > 5 || Math.abs(z - this.glassX) > 5)) {
          this.putCubeOverRec(this.posX + x, 1, z);
        }
      }
    }
  }

  putCubeOverRec(x, y, z) {
    this.createBrickCube(x, y, z, this.brickMaterial);
    if (Math.random() < 0.2) {
      this.putCubeOverRec(x, y + 1, z);
    }
  }
}