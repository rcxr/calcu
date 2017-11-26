(function(calc, $, undefined) {
  calc.evalCard = function(expression, id) {
    var logger = new calc.prettyLogger();
    var resultNode = $("<h1></h1>").addClass("card-title");
    var root = $("<div></div>")
      .addClass("card mt-3")
      .append($("<div></div>").addClass("card-header").text(expression))
      .append($("<div></div>")
        .addClass("card-body")
        .append(resultNode)
        .append($("<button></button>")
          .attr("type", "button")
          .attr("data-toggle", "collapse")
          .attr("data-target", "#log" + id)
          .addClass("btn")
          .text("show log")))
      .append($("<div></div>")
        .prop("id", "log" + id)
        .addClass("collapse")
        .append(logger.getRoot()));

    try {
      var actual = calc.try(expression, logger);
      resultNode.text(actual);
    } catch (ex) {
      resultNode.text(ex);
    }

    this.getRoot = function() {
      return root;
    };
  };
}(window.calc = window.calc || {}, jQuery));
