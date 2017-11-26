var window = [];
importScripts("lib/BigInteger.min.js");
importScripts("util.js");

var BIT_MASK = bigInt(255);

function postUpdate(progress) {
  postMessage([false, progress]);
}

function postCompleted(result) {
  postMessage([true, result])
}

function packetsToBytes(packets, length) {
  var bytes = new Uint8Array(packets.length * length);
  var pIndex = -1;
  for (var byte = 0; byte < bytes.length; ++byte) {
    if (0 === byte % 20000) {
      postUpdate(byte);
    }
    if (0 === byte % length) {
      ++pIndex;
    }
    bytes[byte] = packets[pIndex].and(BIT_MASK);
    packets[pIndex] = packets[pIndex].shiftRight(8);
  }
  postCompleted(bytes);
}

onmessage = function(evt) {
  packetsToBytes(window.util.stringsToBigInts(evt.data[0]), evt.data[1]);
};
