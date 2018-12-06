class SessionStorage {
  constructor() {
    this.data = {};
  }
  setItem(name, value) {
    this.data = { ...this.data, [name]: value };
  }
  getItem(name) {
    return this.data[name];
  }
  removeItem(name) {
    delete this.data[name];
  }
}

export default () => {
  global.sessionStorage = new SessionStorage();
};
