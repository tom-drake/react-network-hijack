const spliceInstancedArray = array => self => {
  const index = array.map(({ instance }) => instance).indexOf(self);
  if (index > -1) array.splice(index, 1);
};

class MockState {
  mockers = [];

  whitelists = [];

  getMocks() {
    return this.mockers.reduce((acc, { mocks }) => {
      acc.push(mocks);
      return acc;
    }, []);
  }

  getWhitelist() {
    return this.whitelists.reduce((acc, list) => {
      list.whitelist.forEach(pattern => acc.add(pattern));
      return acc;
    }, new Set());
  }

  addMocks(instance, mocks) {
    this.mockers.push({ instance, mocks });
  }

  addWhitelist(instance, whitelist = []) {
    this.whitelists.push({ instance, whitelist });
  }

  removeMocks = spliceInstancedArray(this.mockers);

  removeWhitelist = spliceInstancedArray(this.whitelists);
}

const singletonInstance = new MockState();

export default singletonInstance;
