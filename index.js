// Main function, the entry point for the engine
$(function() {
  var count = 0;

  $("#clearResults").click(function() {
    $("#results").empty();
  });

  $("#expression").keypress(function(evt) {
    if (13 === evt.which) {
      var expression = $("#expression").val();
      var evalCard = new calc.evalCard(expression, ++count);
      $("#results").prepend(evalCard.getRoot());
    }
  });
});
