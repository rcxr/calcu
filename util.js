(function(util, undefined) {
  util.stringsToBigInts = function(strings) {
    return strings.map(x => bigInt(x));
  };

  util.bigIntsToStrings = function(bigInts) {
    return bigInts.map(x => x.toString());
  };
}(window.util = window.util || {}));
