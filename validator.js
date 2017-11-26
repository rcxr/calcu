(function(calc, $, undefined) {
  function strongComparer(actual, expected) {
    return actual === expected;
  }

  function bigIntComparer(actual, expected) {
    return actual.equals(expected);
  }

  function arrayComparer(actual, expected) {
    if (actual.length !== expected.length) {
      return false;
    }

    for (var i = 0; i < actual.length; ++i) {
      if (actual[i].notEquals(expected[i])) {
        return false;
      }
    }

    return true;
  }

  function primesComparer(actual, expected) {
    if (Object.keys(actual).length !== Object.keys(expected).length) {
      return false;
    }

    for (var key in actual) {
      if (!(key in expected) || actual[key] !== expected[key]) {
        return false;
      }
    }

    return true;
  }

  var bigIntFormatter = function() {
    this.format = function(value) {
      return value.toString();
    };
  };

  var bigIntArrayFormatter = function() {
    this.format = function(value) {
      var line = "[";
      value.forEach(function(x, i) {
        line += i ? ", " + x.toString() : x.toString();
      });
      return line + "]";
    };
  };

  var primesFormatter = function(a) {
    this.format = function(value) {
      var decomposition = a + " = 1";
      for (var key in value) {
        decomposition += " * " + key + '^' + value[key];
      }
      return decomposition;
    };
  };

  var linearCongruenceFormatter = function(a, b, m) {
    this.format = function(value) {
      var formattedValues = "";
      value.forEach(function(x, i) {
        formattedValues += i ? ", " + x.toString() : x.toString();
      });
      return a.toString() + " * x = " + b.toString() + " (mod " + m.toString() + ") for x in { " + formattedValues + " }";
    };
  };

  var euclideanFormatter = function(a, b) {
    this.format = function(value) {
      return a.toString() + " * (" + value[0].toString() + ") + " + b.toString() + " * (" + value[1].toString() + ") = " +  value[2].toString();
    };
  };

  var chineseRemainderFormatter = function(as, ms) {
    this.format = function(value) {
      var constraints = "";
      for (var i = 0; i < as.length; ++i) {
        if (i) {
          constraints += ", "
        }

        constraints += "x = " + as[i].toString() + " (mod " + ms[i].toString() + ")";
      }
      return constraints + " are satisfied for x = " + value[0].toString() + " (mod " + value[1].toString() + ")";
    };
  };

  calc.validator = function(expected, comparer, formatter) {
    this.format = function(value) {
      return "undefined" === typeof formatter ? value : formatter.format(value);
    };

    this.expected = function() {
      return this.format(expected);
    };

    this.assert = function(actual) {
      return comparer(actual, expected);
    };
  };

  calc.strongValidator = function(expected) {
    return new calc.validator(expected, strongComparer);
  };

  calc.bigIntValidator = function(expected) {
    return new calc.validator(bigInt(expected), bigIntComparer, new bigIntFormatter());
  };

  calc.bigIntsValidator = function(expected) {
    return new calc.validator(util.stringsToBigInts(expected), arrayComparer, new bigIntArrayFormatter());
  };

  calc.euclideanValidator = function(expected, a, b) {
    return new calc.validator(bigInt(expected), arrayComparer, new euclideanFormatter(bigInt(a), bigInt(b)));
  };

  calc.linearCongruenceValidator = function(expected, a, b, m) {
    return new calc.validator(bigInt(expected), arrayComparer, new linearCongruenceFormatter(bigInt(a), bigInt(b), bigInt(m)));
  };

  calc.chineseRemainderValidator = function(expected, as, ms) {
    return new calc.validator(bigInt(expected), arrayComparer, new chineseRemainderFormatter(util.stringsToBigInts(as), util.stringsToBigInts(ms)));
  };

  calc.primesValidator = function(expected, a) {
    var primes = {};
    for (var key in expected) {
      primes[bigInt(key)] = expected[key];
    }
    return new calc.validator(primes, primesComparer, new primesFormatter(bigInt(a)));
  };
}(window.calc = window.calc || {}, jQuery));
