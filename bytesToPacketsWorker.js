var window = [];
importScripts("lib/BigInteger.min.js");
importScripts("util.js");

function postUpdate(progress) {
  postMessage([false, progress]);
}

function postCompleted(result) {
  postMessage([true, window.util.bigIntsToStrings(result)])
}

function bytesToPackets(bytes, length) {
  var packets = [];
  for (var byte = 0; byte < bytes.length; ++byte) {
    if (0 === byte % 20000) {
      postUpdate(byte);
    }
    if (0 === byte % length) {
      packets.push(bigInt.zero);
    }
    packets[packets.length - 1] = bigInt(bytes[byte]).shiftLeft(byte % length * 8).add(packets[packets.length - 1]);
  }
  postCompleted(packets);
}

onmessage = function(evt) {
  bytesToPackets(evt.data[0], evt.data[1]);
};
