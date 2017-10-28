(function(name, definition) {
  if (typeof define === "function") {
    // AMD
    define(definition);
  } else if (typeof module !== "undefined" && module.exports) {
    // Node.js
    module.exports = definition();
  } else {
    // Browser
    var theModule = definition(),
      global = this,
      old = global[name];

    theModule.noConflict = function() {
      global[name] = old;
      return theModule;
    };
    global[name] = theModule;
  }
})("wakeful", function() {
  /**
   * 
   * @param {number} timeMs 
   * @param {{ interval: number, predicate: () => boolean, errMsg: string, okMsg: string }} options 
   */
  var wakeful = function(timeMs, options) {
    var opt = options || {};
    var interval = opt.interval || 1000;
    var errMsg = opt.errMsg || "err";
    var okMsg = opt.okMsg || "ok";
    var predicate = opt.predicate
      ? opt.predicate
      : function() {
          return true;
        };

    return new Promise(function(resolve, reject) {
      var countdown = Math.max(0, timeMs || 0);
      var sleep = function() {
        if (countdown === 0) {
          resolve(okMsg);
        } else if (predicate()) {
          countdown = Math.max(0, countdown - interval);
          setTimeout(sleep, interval);
        } else {
          reject(errMsg);
        }
      };
      sleep();
    });
  };

  return wakeful;
});
