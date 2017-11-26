var window = [];
importScripts("lib/BigInteger.min.js");
importScripts("util.js");
importScripts("calc.js");

function postUpdate(progress) {
  postMessage([false, progress]);
}

function postCompleted(result) {
  postMessage([true, window.util.bigIntsToStrings(result)])
}

function bytesToPackets(packets, e, m) {
  var last = new Date().getMilliseconds();
  for (var i in packets) {
    var now = new Date().getMilliseconds();
    if (last + 500 < now) {
      last = now;
      postUpdate(i);
    }
    packets[i] = window.calc.modexp(packets[i], e, m);
  }
  postCompleted(packets);
}

onmessage = function(evt) {
  bytesToPackets(window.util.stringsToBigInts(evt.data[0]), bigInt(evt.data[1]), bigInt(evt.data[2]));
};
