/* Polyfill for Promise.allSettled as it is not supported until Node v12.9.0 */
exports.allSettled = function(promises) {
  var count = 0, size = promises.length, responses = new Array(size);
  return new Promise((resolve) => {
    if (size === 0) return resolve([]);
    for (let i=0;i<size;i++) {
      let onFufilled = function() {
        let res = Array.from(arguments);
        if (res.length === 0) res = undefined;
        if (res.length === 1) res = res[0];
        responses[i] = res;
        count += 1;
        if (count >= size) resolve(responses);
      }
      promises[i].then(onFufilled).catch(onFufilled);
    }
  });
}
