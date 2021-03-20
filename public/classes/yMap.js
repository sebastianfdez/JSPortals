export default class SceneYMap {
  constructor() {
    this.yMap = new Map();
  }

  setYPos(x, z, y) {
    if (!this.yMap.has(x)) {
      this.yMap.set(x, new Map());
    }
    if (!this.yMap.get(x).has(z)) {
      this.yMap.get(x).set(z, 2 + y);
    }
    if (this.yMap.get(x).get(z) < 2 + y) {
      this.yMap.get(x).set(z, 2 + y);
    }
  }

  getYPos(x, z) {
    if (!this.yMap.has(x)) {
      return 2; // Default
    }
    if (!this.yMap.get(x).has(z)) {
      return 2; // Default
    }
    return this.yMap.get(x).get(z);
  }
}
