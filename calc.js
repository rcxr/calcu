(function(calc, undefined) {
  // This file uses only bigInt numbers
  // Find out more at: https://www.npmjs.com/package/big-integer
  calc.RSA_DEFAULT_LENGTH = 12;
  calc.RSA_BOOK_DICTIONARY = {
    1: 'A', 2: 'B', 3: 'C', 4: 'D',
    5: 'E', 6: 'F', 7: 'G', 8: 'H',
    9: 'I', 10: 'J', 11: 'K', 12: 'L',
    13: 'M', 14: 'N', 15: 'O', 16: 'P',
    17: 'Q', 18: 'R', 19: 'S', 20: 'T',
    21: 'U', 22: 'V', 23: 'W', 24: 'X',
    25: 'Y', 26: 'Z'
  };
  calc.RSA_DEFAULT_DICTIONARY = {
    11: 'a', 12: 'b', 13: 'c', 14: 'd',
    15: 'e', 16: 'f', 17: 'g', 18: 'h',
    19: 'i', 20: 'j', 21: 'k', 22: 'l',
    23: 'm', 24: 'n', 25: 'o', 26: 'p',
    27: 'q', 28: 'r', 29: 's', 30: 't',
    31: 'u', 32: 'v', 33: 'w', 34: 'x',
    35: 'y', 36: 'z', 37: 'A', 38: 'B',
    39: 'C', 40: 'D', 41: 'E', 42: 'F',
    43: 'G', 44: 'H', 45: 'I', 46: 'J',
    47: 'K', 48: 'L', 49: 'M', 50: 'N',
    51: 'O', 52: 'P', 53: 'Q', 54: 'R',
    55: 'S', 56: 'T', 57: 'U', 58: 'V',
    59: 'W', 60: 'X', 61: 'Y', 62: 'Z',
    63: '0', 64: '1', 65: '2', 66: '3',
    67: '4', 68: '5', 69: '6', 70: '7',
    71: '8', 72: '9', 73: '.', 74: ',',
    75: '!', 76: '?', 77: ':', 78: ';',
    79: '=', 80: '+', 81: '-', 82: '*',
    83: '/', 84: '^', 85: '\\', 86: '@',
    87: '#', 88: '&', 89: '(', 90: ')',
    91: '[', 92: ']', 93: '{', 94: '}',
    95: '$', 96: '%', 97: '_', 98: '\'',
    99: ' '
  };
  var logger = calc.DEFAULT_LOGGER;

  calc.unsetLogger = function() {
    calc.setLogger(calc.DEFAULT_LOGGER);
  };

  calc.setLogger = function(customLogger) {
    logger = "undefined" === typeof customLogger ? calc.DEFAULT_LOGGER : customLogger;
  };

  // TODO: support nested evaluations
  // TODO: support variables (clear them)
  // TODO: show any answer

  // Tries to run an expression
  calc.try = function(expression, customLogger) {
    expression = expression.replace(/([\d-]+)([,)\]])/g, "bigInt(\"$1\")$2");
    calc.setLogger(customLogger);
    try {
      return eval("calc." + expression);
    } catch (ex) {
      logger.logError(ex);
      throw ex;
    } finally {
      calc.unsetLogger();
    }
  };

  // TODO: add logging
  // Returns whether g is a primitive root of p
  calc.isRoot = function(g, p) {
    if (!calc.isPrime(p)) {
      throw "p is not prime";
    }

    var phi = p.prev();
    logger.logData("phi(p)", phi, calc.dataType.BIGINT, "phi of a prime p is p - 1");
    var decomposition = calc.decompose(phi);
    for (var factor in decomposition) {
      if (calc.modexp(g, phi.divide(factor), p).isUnit()) {
        logger.logInfo(g.toString() + " ^ (phi(p) / " + factor.toString() + ") = 1(mod p)", "g is not primitive root");
        return false;
      }
    }

    logger.logInfo("For every prime divisor of phi(p), d, we verified that 'g ^ (phi(p) / d)' was not 1(mod p)", "g is primitive root");
    return true;
  };

  // TODO: add logging
  // Returns x in a ^ x = h(mod b)
  calc.index = function(a, h, b) {
    var d = calc.gcd(a, b);
    if (!h.isDivisibleBy(d)) {
      throw "h cannot be generated with a";
    }

    a = calc.mod(a, b);
    h = calc.mod(h, b);

    var exp = bigInt.one;
    var curr = a;
    do {
      if (curr.equals(h)) {
        return exp;
      }
      exp = exp.next();
      curr = calc.mod(curr.multiply(a), b);
    } while(curr.notEquals(a));

    throw "h cannot be generated with a";
  };

  // TODO: add logging
  // Solves the Discrete Log Problem using Baby Step-Giant Step method
  // Returns x in g ^ x = h(mod p)
  calc.babyGiant= function(g, h, p) {
    if (!calc.isRoot(g, p)) {
      throw "g is not a primitive root of p";
    }

    var n = bigInt.zero;
    while (n.square().lesser(p)) {
      n = n.next();
    }
    console.log("n: " + n.toString());

    var babies = [];
    var giants = [];

    var baby = bigInt.one;
    var giant = h;
    var giantStep = calc.modexp(calc.inverse(g, p), n, p);
    console.log("giant step: " + giantStep.toString());

    for (var i = 0; i < n; ++i) {
      babies.push([i, calc.mod(baby, p)]);
      giants.push([i, calc.mod(giant, p)]);

      giant = giant.multiply(giantStep);
      baby = baby.multiply(g);
    }

    babies.sort(function(a, b) {
      return a[1].compare(b[1]);
    });
    giants.sort(function(a, b) {
      return a[1].compare(b[1]);
    });

    while (0 < babies.length && 0 < giants.length) {
      switch (babies[0][1].compare(giants[0][1]).valueOf()) {
        case 0:
          console.log("i: " + babies[0][0]);
          console.log("j: " + giants[0][0]);
          return n.multiply(giants[0][0]).add(babies[0][0]);
        case 1:
          giants.shift();
          break;
        case -1:
          babies.shift();
          break;
      }
    }

    throw "unexpected"
  };

  // TODO: add logging
  // Returns the first primitive root of a prime
  calc.firstRoot = function(p) {
    if (!calc.isPrime(p)) {
      throw "p is not prime and, hence, has no primitive roots";
    }

    var ds = calc.divisors(p.prev());

    for (var root = bigInt[2]; root.lesser(p); root = root.next()) {
      for (var i in ds) {
        if (ds.length - 1 == i) {
          return root;
        }
        if (calc.modexp(root, ds[i], p).isUnit()) {
          break;
        }
      }
    }

    throw "unexpected";
  };

  // TODO: add logging
  // Returns the list of divisors of a
  calc.divisors = function(a) {
    var ds = [];
    var primes = [];
    var elevatedPrimes = [];
    var currExp = [];
    var maxExp = []
    var decomposition = calc.decompose(a);
    for (var p in decomposition) {
      primes.push(p);
      elevatedPrimes.push(bigInt.one);
      currExp.push(0);
      maxExp.push(decomposition[p]);
    }

    var expIndex;
    do {
      var d = bigInt.one;
      for (var i = 0; i < currExp.length; ++i) {
        d = d.multiply(elevatedPrimes[i]);
      }
      ds.push(d);

      for (expIndex = 0; expIndex < currExp.length && currExp[expIndex] === maxExp[expIndex]; ++expIndex) {
        currExp[expIndex] = 0;
        elevatedPrimes[expIndex] = bigInt.one;
      }

      if (expIndex < currExp.length) {
        ++currExp[expIndex];
        elevatedPrimes[expIndex] = elevatedPrimes[expIndex].multiply(primes[expIndex]);
      }
    } while(expIndex < currExp.length);

    ds.sort(function(a, b) {
      return a.compare(b);
    });
    logger.logData("divisors(" + a.toString() + ")", ds, calc.dataType.BIGINTS);
    return ds;
  };

  // TODO: add logging
  // Returns x in a ^ x = 1(mod m)
  calc.order = function(a, m) {
    logger.logInfo("order(a, m) | a = " + a.toString() + ", m = " + m.toString());

    if (!calc.areCoprime(a, m)) {
      throw "order does not exist, numbers are not coprime";
    }

    var candidates = calc.divisors(calc.phi(m));
    for (var key in candidates) {
      var candidate = candidates[key];
      if (calc.modexp(a, candidate, m).isUnit()) {
        logger.logInfo(a.toString() + " ^ " + candidate.toString() + " = 1(mod " + m.toString() + ")");
        return candidate;
      }
    }

    throw "unexpected";
  };

  // TODO: add logging
  // Returns the canonical decomposition of a, as an associative array
  calc.decompose = function(a) {
    if (!a.isPositive()) {
      throw "n must be positive";
    }

    var primes = {};
    var aCopy = bigInt(a);

    while (a.isDivisibleBy(2)) {
      if (!(bigInt[2] in primes)) {
        primes[bigInt[2]] = 0;
      }
      ++primes[bigInt[2]];
      a = a.divide(2);
    }

    while (a.isDivisibleBy(3)) {
      if (!(bigInt[3] in primes)) {
        primes[bigInt[3]] = 0;
      }
      ++primes[bigInt[3]];
      a = a.divide(3);
    }

    var bigPrime1 = bigInt("12121212121");
    while (a.isDivisibleBy(bigPrime1)) {
      if (!(bigPrime1 in primes)) {
        primes[bigPrime1] = 0;
      }
      ++primes[bigPrime1];
      a = a.divide(bigPrime1);
    }

    var bigPrime2 = bigInt("14141414141");
    while (a.isDivisibleBy(bigPrime2)) {
      if (!(bigPrime2 in primes)) {
        primes[bigPrime2] = 0;
      }
      ++primes[bigPrime2];
      a = a.divide(bigPrime2);
    }

    var bigPrime3 = bigInt("1000008000001");
    while (a.isDivisibleBy(bigPrime3)) {
      if (!(bigPrime3 in primes)) {
        primes[bigPrime3] = 0;
      }
      ++primes[bigPrime3];
      a = a.divide(bigPrime3);
    }

    var bigPrime4 = bigInt("7000009000007");
    while (a.isDivisibleBy(bigPrime4)) {
      if (!(bigPrime4 in primes)) {
        primes[bigPrime4] = 0;
      }
      ++primes[bigPrime4];
      a = a.divide(bigPrime4);
    }

    var d = bigInt[5];
    while (a.greaterOrEquals(d.square())) {
      while (a.isDivisibleBy(d)) {
        if (!(d in primes)) {
          primes[d] = 0;
        }
        ++primes[d];
        a = a.divide(d);
      }
      d = d.add(2);
      while (a.isDivisibleBy(d)) {
        if (!(d in primes)) {
          primes[d] = 0;
        }
        ++primes[d];
        a = a.divide(d);
      }
      d = d.add(4);
    }

    if (!a.isUnit()) {
      if (!(a in primes)) {
        primes[a] = 0;
      }
      ++primes[a];
    }

    logger.logData("primes", primes, calc.dataType.PRIMES, "prime factors of " + aCopy.toString());
    return primes;
  };

  // TODO: add logging
  // Returns x in phi(a) = x
  calc.phi = function(a) {
    var primes = calc.decompose(a);
    for (var key in primes) {
      a = a.subtract(a.divide(key));
    }
    return a;
  };

  // TODO: add logging
  // Returns x in a ^ exp = x(mod m)
  calc.modexp = function(a, exp, m) {
    if (exp.isNegative()) {
      throw "exp must be non-negative";
    }

    var x = bigInt.one;
    while (exp.isPositive()) {
      if (exp.isOdd()) {
        x = calc.mod(x.multiply(a), m);
      }
      a = calc.mod(a.multiply(a), m);
      exp = exp.shiftRight(1);
    }
    return x;
  };

  // TODO: add logging
  // Returns true if gcd(a, b) = 1
  calc.areCoprime = function(a, b) {
    return bigInt.one.equals(calc.gcd(a, b));
  };

  // TODO: add logging
  // Returns x in a = x(mod m), x is in [0, m)
  calc.mod = function(a, m) {
    if (!m.isPositive()) {
      throw "m must be positive";
    }

    a = a.mod(m);
    return a.isNegative() ? a.add(m) : a;
  };

  // TODO: add logging
  // TODO: test
  // Returns x and y in a * x + b * y = c
  calc.postage = function() {
    throw "not implemented";
  };

  // TODO: add logging
  // TODO: test
  // Returns x and y in a * x + b * y = c
  calc.diophantine = function(a, b, c) {
    throw "not implemented";
  };

  // TODO: add logging
  // Returns x, y and d in a * x + b * y = d
  calc.euclidean = function(a, b) {
    var qs = [];
    while (!a.mod(b).isZero()) {
      var qr = a.divmod(b);
      qs.push(qr.quotient);
      a = b;
      b = qr.remainder;
    }

    var m = [bigInt.one, bigInt.zero];
    var n = [bigInt.zero, bigInt.one];
    for (var i = 0; i < qs.length; ++i) {
      var t1 = m[0].subtract(n[0].multiply(qs[i]));
      var t2 = m[1].subtract(n[1].multiply(qs[i]));
      m = n;
      n = [t1, t2];
    }

    return b.isNegative() ? [bigInt.zero.subtract(n[0]), bigInt.zero.subtract(n[1]), bigInt.zero.subtract(b)] : [n[0], n[1], b];
  };

  // Returns x in a * x = b(mod m)
  // Rerequisite: gcd(a, m) = 1
  function linearCongruenceInternal(a, b, m) {
    var euclidean = calc.euclidean(a, m);
    return calc.mod(b.multiply(euclidean[0]), m);
  }

  // TODO: add logging
  // Returns values for x in a * x = b(mod m)
  calc.linearCongruence = function(a, b, m) {
    var d = calc.gcd(a, m);
    if (!b.mod(d).isZero()) {
      throw "there are no solutions";
    }

    var x = linearCongruenceInternal(a.divide(d), b.divide(d), m.divide(d));

    var xs = [];
    for (var i = 0; i < d; ++i) {
      xs.push(x.add(m.multiply(i).divide(d)));
    }

    return xs;
  };

  function chineseRemainderInternal(a, m, b, n) {
    var t = linearCongruenceInternal(m, b.subtract(a), n);
    var mn = m.multiply(n);
    return [calc.mod(a.add(m.multiply(t)), mn), mn];
  }

  // TODO: add logging
  // Returns x in x = a1(mod m1), x = a2(mod m2), ...
  calc.chineseRemainder = function(as, ms) {
    for (var i = 0; i < ms.length; ++i) {
      for (var j = i + 1; j < ms.length; ++j) {
        if (!calc.areCoprime(ms[i], ms[j])) {
          throw "bases are not pairwise coprime";
        }
      }
    }

    var x = [bigInt.zero, bigInt.one];
    for (var i = 0; i < ms.length; ++i) {
      console.log("step: " + x[0] + ", " + x[1]);
      x = chineseRemainderInternal(x[0], x[1], as[i], ms[i]);
    }

    return x;
  };

  // TODO: add logging
  // Returns x in a * x = 1(mod m), x is in [0, m)
  calc.inverse = function(a, m) {
    if (!calc.areCoprime(a, m)) {
      throw "inverse does not exist, numbers are not coprime";
    }

    return linearCongruenceInternal(a, bigInt.one, m);
  };

  // TODO: add logging
  // Returns lcm(a, b)
  calc.lcm = function(a, b) {
    if (a.isZero() || b.isZero()) {
      return bigInt.zero;
    }

    return a.multiply(b).divide(calc.gcd(a, b)).abs();
  };

  // TODO: add logging
  // Returns gcd(a, b)
  calc.gcd = function(a, b) {
    var aCopy = bigInt(a);
    var bCopy = bigInt(b);
    while (!b.isZero()) {
      var t = a.mod(b);
      a = b;
      b = t;
    }
    a = a.abs();

    logger.logData("gcd(" + aCopy.toString() + ", " + bCopy.toString() + ")", a, calc.dataType.BIGINT);
    return a;
  };

  // TODO: add logging
  // Returns true if a is prime
  calc.isPrime = function(a) {
    if (a.lesser(2)) {
      throw "values must be greater than 1";
    }

    var primes = calc.decompose(a);

    if (1 < Object.keys(primes).length) {
      return false;
    }

    return primes[Object.keys(primes)[0]] === 1;
  };

  function findIndex(c, dictionary) {
    return Object.keys(dictionary).find(key => dictionary[key] === c);
  }

  function packetToWord(packet, dictionary) {
    var word = "";
    while (!packet.isZero()) {
      word = dictionary[packet.mod(100).valueOf()] + word;
      packet = packet.divide(bigInt[100]);
    }
    return word;
  }

  function wordToPacket(word, dictionary) {
    var digits = [];
    for (var i = 0; i < word.length; ++i) {
      digits.push(findIndex(word[i], dictionary));
    }
    return bigInt.fromArray(digits, 100);
  }

  // TODO: add logging
  // Turns a sentence into data packets
  calc.sentenceToPackets = function(sentence, dictionary, wordLength) {
    dictionary = "undefined" === typeof dictionary ? calc.RSA_DEFAULT_DICTIONARY : dictionary;
    wordLength = "undefined" === typeof wordLength ? calc.RSA_DEFAULT_LENGTH : wordLength;

    var words = [];
    for (var i = 0; wordLength * i < sentence.length; ++i) {
      var end = i * wordLength + wordLength < sentence.length ? sentence.length : i * wordLength + wordLength;
      words.push(sentence.substring(i * wordLength, end));
    }

    return words.map(function(word) {
      return wordToPacket(word, dictionary);
    });
  };

  // TODO: add logging
  // Turns a set of packets into a sentence
  calc.packetsToSentence = function(packets, dictionary) {
    dictionary = "undefined" === typeof dictionary ? calc.RSA_DEFAULT_DICTIONARY : dictionary;

    var words = packets.map(function(packet) {
      return packetToWord(packet, dictionary);
    });

    var sentence = "";
    words.forEach(function(word) {
      sentence += word;
    });
    return sentence;
  };

  // TODO: add logging
  // Encrypts a set of packets using RSA
  calc.rsaCrypt = function(n, e, packets) {
    return packets.map(function(packet) { return calc.modexp(packet, e, n); });
  };

  // TODO: add logging
  // Decrypts a set of packets using RSA
  calc.rsaDecrypt = function(n, e, packets) {
    var d = calc.inverse(e, calc.phi(n));
    console.log("e': " + d.toString());
    return calc.rsaCrypt(n, d, packets);
  };

  // TODO: add logging
  // Encrypts a sentence using the Affine Cipher
  calc.affineCrypt = function(plain, a, b) {
    if (!calc.areCoprime(a, bigInt[26])) {
      throw "a is not coprime with 26";
    }

    var cipher = [];
    for (var i in plain) {
      cipher.push(bigInt(plain.charCodeAt(i)).subtract(65).multiply(a).add(b).mod(26).add(26).mod(26).add(65).valueOf());
    }

    return String.fromCharCode.apply(null, cipher);
  };

  // TODO: add logging
  // Decrypts a set of packets using the Affine Cipher
  calc.affineDecrypt = function(cipher, a, b) {
    if (!calc.areCoprime(a, bigInt[26])) {
      throw "a is not coprime with 26";
    }

    a = calc.inverse(a, bigInt[26]);
    console.log("a': " + a);

    var plain = [];
    for (var i in cipher) {
      plain.push(bigInt(cipher.charCodeAt(i)).subtract(65).subtract(b).multiply(a).mod(26).add(26).mod(26).add(65).valueOf());
    }

    return String.fromCharCode.apply(null, plain);
  };
  // TODO: pollard rho
  // TODO: rabin miller
  // TODO: lehmer check
  // TODO: trialdivision
  // TODO: elgamo
  // TODO: quadratic and lagrange
}(window.calc = window.calc || {}));
