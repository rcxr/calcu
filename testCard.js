(function(calc, $, undefined) {
  function testNode() {
    return $("<div></div>").addClass("list-group-item d-flex justify-content-between align-items-center");
  }

  function header() {
    return $("<h4></h4>");
  }

  function test(expression, validator) {
    try {
      var actual = calc.try(expression);

      var expressionNode = $("<span></span>").text(expression + " => " + validator.format(actual));
      var resultNode = $("<span></span>").addClass("badge badge-pill");

      if (validator.assert(actual)) {
        resultNode.text("ok!").addClass("badge-success");
      } else {
        resultNode.text("expected: " + validator.expected()).addClass("badge-danger");
      }

      return testNode().append(expressionNode).append(header().append(resultNode));
    } catch (e) {
      var expressionNode = $("<span></span>").text(expression + " => ?");
      var resultNode = $("<span></span>").text("exception: " + e).addClass("badge badge-pill badge-danger");
      return testNode().append(expressionNode).append(header().append(resultNode));
    }
  }

  function errorTest(expression) {
    try {
      calc.try(expression);
      var expressionNode = $("<span></span>").text(expression + " should throw");
      var resultNode = $("<span></span>").text("fail!").addClass("badge badge-pill badge-danger");
      return testNode().append(expressionNode).append(header().append(resultNode));
    } catch (e) {
      var expressionNode = $("<span></span>").text(expression + " threw '" + e + "'");
      var resultNode = $("<span></span>").text("ok!").addClass("badge badge-pill badge-success");
      return testNode().append(expressionNode).append(header().append(resultNode));
    }
  }

  calc.testCard = function(id, label) {
    var tests = $("<div></div>").addClass("list-group list-group-flush");

    var root = $("<div></div>")
      .addClass("card")
      .append($("<div></div>")
        .addClass("card-body")
        .append($("<h1></h1>").addClass("card-title").text(label)))
      .append(tests);

    this.test = function(expression, validator) {
      tests.append(test(expression, validator));
    };

    this.errorTest = function(expression) {
      tests.append(errorTest(expression));
    };

    this.getRoot = function() {
      return root;
    };
  };
}(window.calc = window.calc || {}, jQuery));
