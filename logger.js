(function(calc, $, undefined) {
  calc.dataType = Object.freeze({
    PRIMITIVE: 0,
    PRIMITIVES: 1,
    BIGINT: 2,
    BIGINTS: 3,
    PRIMES: 4
  });

  var MAX_ITEMS_SHOWN = 10;

  function consoleLogger() {
    this.logError = function(e) {
      console.log(e);
    };

    this.logInfo = function(info, context) {
      console.log(info + " // " + context);
    };

    this.logData = function(label, d, dt, context) {
      if ("undefined" === typeof dt || calc.dataType.PRIMITIVE === dt) {
        var message = label + " = " + d;
        if ("undefined" !== typeof context) {
          message += " // " + context;
        }
        console.log(message);
      } else if (calc.dataType.BIGINT === dt) {
        var message = label + " = " + d.toString();
        if ("undefined" !== typeof context) {
          message += " // " + context;
        }
        console.log(message);
      }
    };
  };

  calc.DEFAULT_LOGGER = new consoleLogger();

  calc.prettyLogger = function() {
    function listItem() {
      return $("<div></div>").addClass("list-group-item");
    }

    function p(label, tag) {
      return $("<p></p>").append($("<" + tag + "></" + tag + ">").text(label));
    }

    function logCollection(label, d, context, format) {
      var item = listItem()
        .append($("<h4></h4>")
          .html(label + "&nbsp;<small>(" + d.length + " items)</small>"));
      if ("undefined" === typeof context) {
        item.append(p(context, "em"))
      }
      var list = $("<div></div>").addClass("list-group");
      item.append(list);
      root.prepend(item);

      d.forEach(function(x, i) {
        if (MAX_ITEMS_SHOWN === i) {
          list.append(listItem().html("only showing first " + MAX_ITEMS_SHOWN + " elements&hellip;"));
        } else if (i < MAX_ITEMS_SHOWN) {
          list.append(listItem().text(label + " [" + i + "] = " + format(x)));
        }
      });
    }

    var root = $("<div></div>").addClass("list-group list-group-flush");

    this.getRoot = function() {
      return root;
    };

    this.logError = function(e) {
      root.prepend(listItem()
        .addClass("list-group-item-danger")
        .append($("<h4></h4>").text("undefined" === typeof e ? "unexpected" : e)));
    };

    this.logInfo = function(info, context) {
      var item = listItem().append($("<h4></h4>").text(info));
      if ("undefined" === typeof context) {
        item.append(p(context, "em"))
      }
      root.prepend(item);
    };

    this.logData = function(label, d, dt, context) {
      if ("undefined" === typeof dt || calc.dataType.PRIMITIVE === dt) {
        this.logInfo(label + " = " + d, context);
      } else if (calc.dataType.BIGINT === dt) {
        this.logInfo(label + " = " + d.toString(), context);
      } else if (calc.dataType.PRIMITIVES === dt) {
        logCollection(label, d, context, function(x) { return x; } );
      } else if (calc.dataType.BIGINTS === dt) {
        logCollection(label, d, context, function(x) { return x.toString(); });
      }
    };

    this.clear = function() {
      root.empty();
    };
  };
}(window.calc = window.calc || {}, jQuery));
