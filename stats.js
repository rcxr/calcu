(function(calc, $, undefined) {
  function progressBar() {
    return $("<div></div>").addClass("progress-bar").css("width", "0");
  }

  function percentFormatter(p, t) {
    return Math.round(100 * p / t) + "%";
  }

  function timeFormatter(delta) {
    return delta < 5000 ? delta + " ms" : Math.round(delta / 1000) + " s";
  }

  function unitFormatter(p, t, unit, action) {
    return p + " " + unit + " " + action + " (of " + t + " " + unit + ")";
  }

  function speedFormatter(delta, p, unit) {
    return Math.round(1000 * p / delta) + " " + unit + "/s";
  }

  function statCard(id, unit, action) {
    var progress = progressBar("read");
    var mainSummary = $("<h1></h1>").addClass("card-title");
    var timeSummary = $("<h4></h4>").addClass("card-text");
    var unitSummary = $("<p></p>").addClass("card-text");
    var speedSummary = $("<p></p>").addClass("card-text");
    var start = null;
    var totalUnits = null;

    var root = $("<div></div>")
      .addClass("card text-center mr-3 mb-3")
      .css("width", "256px")
      .append($("<h4></h4>").addClass("card-header").text(id))
      .append($("<div></div>")
        .addClass("card-body")
        .append(mainSummary)
        .append(timeSummary)
        .append(unitSummary)
        .append(speedSummary)
        .append($("<div></div>").addClass("progress").append(progress)));

    this.getRoot = function() {
      return root;
    };

    this.clear = function() {
      start = null;
      totalUnits = null;

      progress.css("width", "0");
      mainSummary.text("0%");
      timeSummary.text("not started");
      unitSummary.html("&nbsp;");
      speedSummary.html("&nbsp;");
    };

    this.start = function(t) {
      start = moment();
      totalUnits = t;
      progress
        .removeClass("bg-success")
        .addClass("progress-bar-striped progress-bar-animated");

      this.update(0, start);
    };

    this.update = function(p, now) {
      var delta = now.diff(start);
      var percent = percentFormatter(p, totalUnits);

      progress.css("width", percent);
      mainSummary.text(percent);
      timeSummary.text(timeFormatter(delta));
      unitSummary.text(unitFormatter(p, totalUnits, unit, action));
      speedSummary.text(speedFormatter(delta, p, unit));
    };

    this.end = function() {
      this.update(totalUnits, moment());
      progress
        .addClass("bg-success")
        .removeClass("progress-bar-striped progress-bar-animated");
    };

    this.abort = function() {
      progress
        .addClass("bg-danger")
        .removeClass("progress-bar-striped progress-bar-animated");
    };
  }

  calc.stats = function() {
    var read = new statCard("read file", "bytes", "read");
    var packets = new statCard("bytes to packets", "bytes", "converted to packets");
    var cipher = new statCard("cipher packets", "packets", "ciphered");
    var bytes = new statCard("packets to bytes", "bytes", "converted from packets");

    var root = $("<div></div>")
      .addClass("d-flex flex-wrap")
      .append(read.getRoot())
      .append(packets.getRoot())
      .append(cipher.getRoot())
      .append(bytes.getRoot());

    this.getRoot = function() {
      return root;
    };

    this.clear = function() {
      read.clear();
      packets.clear();
      cipher.clear();
      bytes.clear();
    };

    this.readStart = function(t) { read.start(t); };
    this.packetsStart = function(t) { packets.start(t); };
    this.cipherStart = function(t) { cipher.start(t); };
    this.bytesStart = function(t) { bytes.start(t); };

    this.readUpdate = function(p) { read.update(p, moment()); };
    this.packetsUpdate = function(p) { packets.update(p, moment()); };
    this.cipherUpdate = function(p) { cipher.update(p, moment()); };
    this.bytesUpdate = function(p) { bytes.update(p, moment()); };

    this.readEnd = function() { read.end(); };
    this.packetsEnd = function() { packets.end(); };
    this.cipherEnd = function() { cipher.end(); };
    this.bytesEnd = function() { bytes.end(); };

    this.readAbort = function() { read.abort(); };
    this.packetsAbort = function() { packets.abort(); };
    this.cipherAbort = function() { cipher.abort(); };
    this.bytesAbort = function() { bytes.abort(); };
  };
}(window.calc = window.calc || {}, jQuery));
