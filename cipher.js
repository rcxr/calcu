// Main function, the entry point for the engine
$(function() {
  var stats = new calc.stats();
  var cipher = new calc.rsa(stats);

  $("#statsContainer").append(stats.getRoot());
  $("#mainContainer").append(cipher.getRoot());
  $("#file").change(function(evt) {
    cipher.load(evt.target.files[0]);
  });
  $("#run").click(function() {
    var t = $("#cipherAction").is(":checked")
      ? calc.actionType.CIPHER
      : $("#decipherAction").is(":checked")
        ? calc.actionType.DECIPHER
        : cacl.actionType.NO_OP;
    cipher.run($("#p").val(), $("#q").val(), $("#e").val(), t);
  });

  $("#p").val("5915587277");
  $("#q").val("1500450271");
  $("#e").val("7");
});
