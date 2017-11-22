// Main function, the entry point for the engine
$(function() {
  var count = 0;

  $("#clearResults").click(function() {
    $("#results").empty();
  });

  $("#expression").keypress(function(e) {
    if (13 === e.which) {
      var expression = $("#expression").val();
      var evalCard = new calc.evalCard(expression, ++count);
      $("#results").prepend(evalCard.getRoot());
    }
  });
});
