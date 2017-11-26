(function(calc, $, undefined) {
  calc.actionType = Object.freeze({
    CIPHER: 0,
    DECIPHER: 1,
    NO_OP: 2
  });

  calc.rsa = function(stats) {
    var logger = new calc.prettyLogger();
    var reader = null;
    var inputFile = null;
    var inputBytes = null;
    var outputBytes = null;

    var root = $("<div></div>")
      .addClass("card")
      .append($("<div></div>")
        .addClass("card-body")
        .append($("<button></button>")
          .addClass("btn btn-primary")
          .text("Clear log")
          .click(function() {
            logger.clear();
          })))
      .append(logger.getRoot());

    function parseBigInt(label, value) {
      if (!value) {
        throw "Provide a value for " + label;
      }
      value = bigInt(value);
      logger.logData(label, value, calc.dataType.BIGINT);
      return value;
    }

    function getSmallLength(m) {
      var n = bigInt.one;
      var l = -1;
      while (m.greaterOrEquals(n)) {
        n = n.shiftLeft(1);
        ++l;
      }
      return Math.floor(l / 8);
    }

    function getLargeLength(m) {
      var n = bigInt.one;
      var l = 0;
      while (n.lesser(m)) {
        n = n.shiftLeft(1);
        ++l;
      }
      return Math.ceil(l / 8);
    }

    function readerOnError(evt) {
      stats.readAbort();
      switch(evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
          logger.logError("File not found");
          break;
        case evt.target.error.NOT_READABLE_ERR:
          logger.logError("File not readable");
          break;
        case evt.target.error.ABORT_ERR:
          logger.logError("Read operation aborted");
          break;
        default:
          logger.logError();
      }
    }

    function readerOnLoadStart(evt) {
      logger.logInfo("Read started");
      if (evt.lengthComputable) {
        stats.readStart(evt.total);
      } else {
        stats.readStart(Infinity);
      }
    }

    function readerOnProgress(evt) {
      if (evt.lengthComputable) {
        stats.readUpdate(evt.loaded);
      }
    }

    function readerOnLoad(evt) {
      stats.readEnd();
      logger.logInfo("Read completed");
      inputBytes = new Uint8Array(evt.target.result);
    }

    function readerOnLoadEnd(evt) { reader = null; }

    function cipherPackets(packets, e, m) {
      return new Promise(resolve => {
        var worker = new Worker("./cipherPacketsWorker.js");
        worker.onmessage = function(evt) {
          if (evt.data[0]) {
            stats.cipherEnd();
            var packets = util.stringsToBigInts(evt.data[1]);
            resolve(packets);
          } else {
            stats.cipherUpdate(evt.data[1]);
          }
        };
        stats.cipherStart(packets.length);
        worker.postMessage([util.bigIntsToStrings(packets), e.toString(), m.toString()]);
      });
    }

    function packetsToBytes(packets, length) {
      return new Promise(resolve => {
        var worker = new Worker("./packetsToBytesWorker.js");
        worker.onmessage = function(evt) {
          if (evt.data[0]) {
            stats.bytesEnd();
            resolve(evt.data[1]);
          } else {
            stats.bytesUpdate(evt.data[1]);
          }
        };
        stats.bytesStart(packets.length * length);
        worker.postMessage([util.bigIntsToStrings(packets), length]);
      });
    }

    function bytesToPackets(bytes, length) {
      return new Promise(resolve => {
        var worker = new Worker("./bytesToPacketsWorker.js");
        worker.onmessage = function(evt) {
          if (evt.data[0]) {
            stats.packetsEnd();
            var packets = util.stringsToBigInts(evt.data[1]);
            resolve(packets);
          } else {
            stats.packetsUpdate(evt.data[1]);
          }
        };
        stats.packetsStart(bytes.length);
        worker.postMessage([bytes, length]);
      });
    }

    function trimBytes(bytes) {
      if (0 === bytes.length) {
        return bytes;
      }

      var count = 0;
      while (0 === bytes[bytes.length - 1 - count]) {
        ++count;
      }

      logger.logInfo("Trimmed " + count + " zero bytes");
      var trimmedBytes = new Uint8Array(bytes.length - count);
      for (var i = 0; i < trimmedBytes.length; ++i) {
        trimmedBytes[i] = bytes[i];
      }

      return trimmedBytes;
    }

    var downloadBytes = (function() {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      return function(data, name) {
          var blob = new Blob(data, {type: "octet/stream"});
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = name;
          a.click();
          window.URL.revokeObjectURL(url);
      };
    }());

    async function run(m, e, lRead, lWrite, t) {
      stats.clearCipherStats();
      logger.logData("bytes", inputBytes, calc.dataType.PRIMITIVES);
      var packets = await bytesToPackets(inputBytes, lRead);
      logger.logData("packets", packets, calc.dataType.BIGINTS);
      packets = await cipherPackets(packets, e, m);
      logger.logData("ciphered packets", packets, calc.dataType.BIGINTS);
      outputBytes = await packetsToBytes(packets, lWrite);
      logger.logData("ciphered bytes", outputBytes, calc.dataType.PRIMITIVES);
      if (calc.actionType.DECIPHER === t) {
        downloadBytes([trimBytes(outputBytes)], inputFile);
      } else {
        downloadBytes([outputBytes], inputFile);
      }
    }

    function dryRun(p, q, e, t) {
      if (calc.actionType.NO_OP === t) {
        throw "Select an action (cipher or decipher)";
      }
      if (null === inputBytes) {
        throw "Load file first";
      }

      p = parseBigInt("p", p);
      if (!calc.isPrime(p)) {
        throw "p is not prime";
      }

      q = parseBigInt("q", q);
      if (!calc.isPrime(q)) {
        throw "q is not prime";
      }

      if (!calc.areCoprime(p, q)) {
        throw "p and q are not coprime";
      }

      var m = p.multiply(q);
      logger.logData("m", m, calc.dataType.BIGINT);

      var phi = p.prev().multiply(q.prev());
      logger.logData("phi(m)", phi, calc.dataType.BIGINT);

      e = parseBigInt("e", e);
      if (!calc.areCoprime(e, phi)) {
        throw "e and phi(m) are not coprime";
      }

      var smallL = getSmallLength(m);
      logger.logData("packet small length", smallL);
      var largeL = getLargeLength(m);
      logger.logData("packet large length", largeL);

      if (0 === smallL) {
        throw "Largest safe word length is invalid (0), try larger primes";
      }

      if (calc.actionType.CIPHER === t) {
        run(m, e, smallL, largeL, t);
      } else if (calc.actionType.DECIPHER === t) {
        e = calc.inverse(e, phi);
        logger.logData("inverse(e, m)", e, calc.dataType.BIGINT);
        run(m, e, largeL, smallL, t);
      } else {
        throw "illegal cipher operation";
      }
    };

    this.run = function(p, q, e, t) {
      try {
        dryRun(p, q, e, t)
      } catch (ex) {
        logger.logError(ex);
      }
    };

    this.load = function(file) {
      if (!file) {
        return;
      }

      this.clear();
      inputFile = file.name;

      reader = new FileReader();
      reader.onloadstart = readerOnLoadStart;
      reader.onprogress = readerOnProgress;
      reader.onload = readerOnLoad;
      reader.onerror = readerOnError;
      reader.onloadend = readerOnLoadEnd;
      reader.readAsArrayBuffer(file);
    };

    this.getRoot = function() {
      return root;
    };

    this.clear = function() {
      if (null != reader) {
        reader.abort();
      }
      reader = null;
      inputFile = null;
      inputBytes = null;
      outputBytes = null;

      stats.clear();
    };

    this.clear();
  };
}(window.calc = window.calc || {}, jQuery));
