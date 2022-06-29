const redis = require("redis");
const { REDIS_URI_LOCAL } = require("../config/env");
const { promisify } = require("util");
const mongoose = require("mongoose");

const client = redis.createClient(`${REDIS_URI_LOCAL}`);
client.connect();

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashedKey = JSON.stringify(options.key || "");
  return this;
};
mongoose.Query.prototype.exec = async function () {
  //client.flushAll();
  if (!this.useCache) return exec.apply(this, arguments);
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  const cacheValue = await client.hGet(this.hashedKey, key);

  if (cacheValue) {
    // console.log(cacheValue);
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((el) => new this.model(el))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  client.hSet(this.hashedKey, key, JSON.stringify(result), "EX", 5);
  return result;
};
const clearCache = (hashedKey) => {
  client.DEL(JSON.stringify(hashedKey));
};
module.exports = {
  clearCache,
};
