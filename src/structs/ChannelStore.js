const { Collection } = require('discord.js');
const SaveInterface = require('./save/SaveInterface.js');
const SaveJSON = require('./save/SaveJSON.js');

class ChannelStore extends Collection {
  constructor(filename) {
    super();
    this._saveLock = false;
    this._saveLockQueue = new Array();
    this.saveInterface = new SaveInterface();
    if (filename) {
      this.saveInterface = new SaveJSON(filename);
    }
  }
  async load() {
    await this.saveLock();
    try {
      await this.saveInterface.load(this);
    } catch(e) {
      console.error(e);
    }
    await this.saveUnlock();
  }
  async save() {
    await this.saveLock();
    try {
      await this.saveInterface.save(this);
    } catch(e) {
      console.error(e);
    }
    await this.saveUnlock();
  }

  set(key, value, dontSave) {
    Collection.prototype.set.call(this, key, value);
    if (dontSave !== true) return this.save();
    console.warn(`Set ${key} without saving`);
  }

  delete(key, dontSave) {
    Collection.prototype.delete.call(this, key);
    if (!dontSave) return this.save();
    console.warn(`Deleted ${key} without saving`);
  }

  async saveLock() {
    if (this._saveLock) {
      let queue = this.saveLockQueue;
      await new Promise((resolve) => {
        queue.push(resolve);
      });
    }
    return this._saveLock = true;
  }

  async saveUnlock() {
    if (this._saveLockQueue.length > 0) {
      this._saveLock.pop(0)();
    } else {
      this._saveLock = false;
    }
  }

  // TODO: add update function

  *flatValues() {
    const values = this.values();
    let result = values.next();
    while (!result.done) {
      if (Array.isArray(result.value)) {
        for (let item of result.value) {
          yield item;
        }
      } else {
        yield result.value;
      }
      result = values.next();
    }
  }
}

module.exports = ChannelStore;
