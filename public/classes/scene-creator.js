import * as THREE from '/build/three.module.js';
const loader = new THREE.TextureLoader();

export default class SceneCreator {
  constructor(scene, bounds, csm, glassX, glassZ) {
    this.scene = scene;
    this.bounds = bounds;
    this.glassX = glassX;
    this.glassZ = glassZ;
    this.posX = 0;
    this.loaded = false;
    // Glass for portal
    this.glass = null;
    // Light
    this.csm = csm;
    // Textures
    this.floorMaterial = null;
    this.brickMaterial = null;
    this._loadTextures();
  }

  _loadTextures() {
    this.geometry = new THREE.BoxGeometry();
    this.floorGeometry = new THREE.PlaneGeometry(
      this.bounds.x[1] * 2 + 1, this.bounds.z[1] * 2 + 1, 1
    );
    this.materialGlass = new THREE.MeshLambertMaterial({
      map: loader.load('resources/images/glass.jpeg'),
    });
  }

  loadFloor() {
    const floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.position.x = this.posX;
    floor.position.z = 0;
    floor.position.y = 0.5;
    floor.castShadow = true;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createGlass(x, z) {
    this.createBrickCube(x - 1.5, 1, z, this.brickMaterial);
    this.createBrickCube(x + 1.5, 1, z, this.brickMaterial);
    this.createBrickCube(x - 1.5, 2, z, this.brickMaterial);
    this.createBrickCube(x + 1.5, 2, z, this.brickMaterial);
    const glassGeometry = new THREE.BoxGeometry(2,2,0.1);
    this.glass = new THREE.Mesh(glassGeometry, this.materialGlass);
    this.glass.position.x = x;
    this.glass.position.z = z;
    this.glass.position.y = 1;
		this.glass.castShadow = true;
		this.glass.receiveShadow = true;
    this.scene.add(this.glass);
  }

  createBrickCube(x, y, z, material) {
    const brick = new THREE.Mesh(this.geometry, material);
    brick.position.x = x;
    brick.position.z = z;
    brick.position.y = y;
		brick.castShadow = true;
		brick.receiveShadow = true;
    this.scene.add(brick);
  }

  getGlass() {
    return this.glass;
  }
}
