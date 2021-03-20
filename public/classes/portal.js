export default class Portal {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.glasses = [];
  }

  receiveGlass(glass) {
    this.glasses.push(glass);
  }

  isTouchingGlass() {
    for (let glass of this.glasses) {
      const distanceCP = Math.abs(glass.position.x - this.camera.position.x) +
        Math.abs(glass.position.z - this.camera.position.z);
      if (distanceCP < 1.2) {
        return true;
      }
    }
    return false;
  }
}