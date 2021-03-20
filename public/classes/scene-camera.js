import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import * as THREE from '/build/three.module.js';

export default class SceneCamera {
  constructor(scene, camera, renderer, bounds, stats, csm, yMap, worlds) {
    this.scene = scene;
    this.bounds = bounds;
    this.camera = camera;
    this.renderer = renderer;
    this.stats = stats;
    this.csm = csm;
    this.yMap = yMap;
    this.worlds = worlds;
    this.actualWorld = 0;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.target = { x: 0, y: 0, z: -1 };
    this.angle = 0;
    this.setUp();
    this.listenResize();
    this.listenKeyboard();
    this.movement = {
      moving: false,
      forward: 0,
      horizontal: 0,
      lifting: 0,
      rotating: 0,
    };
    this.jumping = 0;
    setTimeout(() => {
      this.moveForward(0);
      this.update();
    }, 500);
    setTimeout(() => {
      this.csm.update(this.camera.matrix);
      this.csm.updateFrustums();
      this.moveForward(0);
      this.update();
      this.updateMovement();
    }, 600);
    this.isTouchingGlass = () => {
      return false;
    };
  }

  setUp() {
    this.worlds[this.actualWorld].createMaterials();
    this.camera.position.set(this.worlds[this.actualWorld].posX,2,12);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Disable rotation
    this.controls.enabled = false;
		this.renderer.shadowMapSoft = true;
		this.renderer.physicallyBasedShading = true;
    document.body.appendChild(this.renderer.domElement);
  }

  listenResize() {
    window.addEventListener('resize', function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    }, false);
  }
  
  onDocumentKeyDown(event) {
    event = event || window.event;
    const keycode = event.keyCode;
    this.makeMovement(keycode, true);
  }

  onDocumentKeyUp(event) {
    event = event || window.event;
    const keycode = event.keyCode;
    this.makeMovement(keycode, false);
  }

  makeMovement(keycode, active) {
    switch(keycode) {
      case 32 : //space
        this.jumping = (this.jumping === 0 && active) ? 10 : this.jumping;
        break;
      case 37 : //left arrow 
        this.movement.horizontal = active ? -1 : 0;
        break;
      case 38 : // up arrow 
        this.movement.forward = active ? 2 : 0;
        break;
      case 39 : // right arrow 
        this.movement.horizontal = active ? 1 : 0;
        break;
      case 40 : //down
        this.movement.forward = active ? -2 : 0;
        break;
      case 81 : // Q rotate left
        this.movement.rotating = active ? -5 : 0;
        break;
      case 68: // D rotate right
        this.movement.rotating = active ? 5 : 0;
        break;
      case 90 : // Z look up
        this.movement.lifting = active ? -5 : 0;
        break;
      case 83: // S look down
        this.movement.lifting = active ? 5 : 0;
        break;
      case 78: // N teleport
        if (active) {
          this.teleport();
        }
        break;
    }
    if (active) {
      this.movement.moving = true;
    } else if (
      this.movement.rotating === 0 && this.movement.lifting === 0 &&
      this.movement.forward === 0 && this.movement.horizontal === 0
    ) {
      this.movement.moving = false;
    }
  }

  listenKeyboard() {
    document.addEventListener('keydown', this.onDocumentKeyDown.bind(this));
    document.addEventListener('keyup', this.onDocumentKeyUp.bind(this));
  }

  updateMovement() {
    setInterval(() => {
      if (this.movement.moving || this.jumping > 0) {
        if (this.movement.forward !== 0) {
          this.moveForward(this.movement.forward);
        }
        if (this.movement.horizontal !== 0) {
          this.moveHorizontal(this.movement.horizontal);
        }
        if (this.movement.lifting !== 0) {
          this.liftCamera(this.movement.lifting);
        }
        if (this.movement.rotating !== 0) {
          this.rotateCamera(this.movement.rotating);
        }
        if (this.jumping > 0) {
          this.jumping--;
          const extraY = this.yMap.getYPos(Math.floor(this.camera.position.x), Math.floor(this.camera.position.z));
          this.camera.position.y = extraY + 3 - (3 / 25) * Math.pow(this.jumping - 5, 2);
        }
        this.update();
      }
    }, 50);
  }

  // Movements
  moveForward(steps) {
    this.camera.position.z += steps * this.target.z;
    this.camera.position.x += steps * this.target.x;
    this.rotateCamera(0);
  }

  moveHorizontal(steps) {
    const angle = Math.atan2(this.target.x, this.target.z);
    this.camera.position.z += steps * Math.cos(angle - Math.PI / 2);
    this.camera.position.x += steps * Math.sin(angle - Math.PI / 2);
    this.rotateCamera(0);
  }

  rotateCamera(degrees) {
    const angle = Math.atan2(this.target.x, this.target.z) - Math.PI * degrees / 180;
    this.target.z = Math.cos(angle);
    this.target.x = Math.sin(angle);
  }

  liftCamera(degrees) {
    const angle = Math.asin(this.target.y) - Math.PI * degrees / 180;
    this.target.y = Math.sin(angle);
  }

  update() {
    if (this.isTouchingGlass()) {
      this.teleport();
    }
    this.camera.position.x = Math.max(this.camera.position.x, this.worlds[this.actualWorld].posX + this.bounds.x[0]);
    this.camera.position.x = Math.min(this.camera.position.x, this.worlds[this.actualWorld].posX + this.bounds.x[1]);
    this.camera.position.z = Math.max(this.camera.position.z, this.bounds.z[0]);
    this.camera.position.z = Math.min(this.camera.position.z, this.bounds.z[1]);
    const extraY = this.yMap.getYPos(Math.floor(this.camera.position.x), Math.floor(this.camera.position.z));
    this.camera.position.y = this.jumping === 0 ? extraY : this.camera.position.y;
    this.controls.target.set(
      this.camera.position.x + this.target.x,
      this.camera.position.y + this.target.y,
      this.camera.position.z + this.target.z
    );
    this.controls.update();
    this.csm.update(this.camera.matrix);
    this.csm.updateFrustums();
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  teleport() {
    const offSet = this.camera.position.x - this.worlds[this.actualWorld].posX;
    this.actualWorld = (this.actualWorld + 1) % this.worlds.length;
    if (!this.worlds[this.actualWorld].loaded) {
      this.worlds[this.actualWorld].createMaterials();
    }
    this.worlds[this.actualWorld].changeScene();
    this.camera.position.x = this.worlds[this.actualWorld].posX + offSet;
    this.moving = false;
  }
}
