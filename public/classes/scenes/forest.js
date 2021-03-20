import SceneCreator from '../scene-creator.js';
import * as THREE from '/build/three.module.js';
import * as GLTFLoader from '/jsm/loaders/GLTFLoader.js';
const loader = new THREE.TextureLoader();

export default class SceneForest extends SceneCreator {
  constructor(scene, bounds, csm, glassX, glassZ, posX, yMap) {
    super(scene, bounds, csm, glassX, glassZ);
    this.posX = posX;
    this.yMap = yMap;
    this.loadTextures();
    super.loadFloor();
    this.createGlass(this.posX + this.glassX, this.glassZ);
  }

  changeScene() {
    this.scene.background = new THREE.Color(0x24f0ff);
  }

  loadTextures() {
    this.brickMaterial = new THREE.MeshLambertMaterial({
      map: loader.load('resources/images/wall.jpg'),
    });
    this.csm.setupMaterial( this.brickMaterial );
    const textureGrass = loader.load('resources/images/grass2.png');
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
    const loader = new GLTFLoader.GLTFLoader();
    loader.load('../../resources/tree/scene.gltf', function (data) {
      var object = data.scene;
      const factor = 1.5;
      this.addRandom(object, factor, false);
    }.bind(this));
    loader.load('../../resources/low_poly_pine/scene.gltf', function (data) {
      var object = data.scene;
      const factor = 1;
      this.addRandom(object, factor, false);
    }.bind(this));
    loader.load('../../resources/red_pine/scene.gltf', function (data) {
      var object = data.scene;
      const factor = 0.015;
      this.addRandom(object, factor, false);
    }.bind(this));
    loader.load('../../resources/birch_tree/scene.gltf', function (data) {
      var object = data.scene;
      const factor = 0.1;
      this.addRandom(object, factor, true);
    }.bind(this));
  }

  addRandom(object, factor, single) {
    for (let i = 0; i < 30; i++) {
      const x = Math.floor((Math.random() * 2 - 1) * this.bounds.x[1]);
      const z = Math.floor((Math.random() * 2 - 1) * this.bounds.z[1]);
      for (let j = 0; j < (single ? 1 : Math.floor(Math.random() * 30)); j++) {
        const deltaX = (Math.random() * 2 - 1) * 4;
        const deltaZ = (Math.random() * 2 - 1) * 4;
        const newObject = object.clone();
        const random = Math.random();
        if (random < 0.001) {
          newObject.scale.set(factor, factor, factor);
        } else if (random < 0.005) {
          newObject.scale.set(0.8 * factor, 0.8 * factor, 0.8 * factor);
        } else if (random < 0.02) {
          newObject.scale.set(0.5 * factor, 0.5 * factor, 0.5 * factor);
        } else {
          newObject.scale.set(0.3 * factor, 0.3 * factor, 0.3 * factor);
        }
        newObject.position.set(this.posX + x + deltaX, 0.5, z + deltaZ);
        this.scene.add( newObject );
      }
    }
  }
}