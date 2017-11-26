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

function cipherPackets(packets, e, m) {
  for (var i = 0; i < packets.length; ++i) {
    if (0 === i % 2000) {
      postUpdate(i);
    }
    packets[i] = window.calc.modexp(packets[i], e, m);
  }
  postCompleted(packets);
}

onmessage = function(evt) {
  cipherPackets(window.util.stringsToBigInts(evt.data[0]), bigInt(evt.data[1]), bigInt(evt.data[2]));
};
