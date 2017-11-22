// Main function, the entry point for the engine
$(function() {
  var main = $("#main");

  var indeaffineDecryptCard = new calc.testCard("index", "index(a, h, b)");
  indeaffineDecryptCard.errorTest("index(3, 4, 9)");
  indeaffineDecryptCard.errorTest("index(7, 2, 9)");
  indeaffineDecryptCard.test("index(7, 4, 9)", calc.bigIntValidator("2"));
  main.append(indeaffineDecryptCard.getRoot());

  var babyGiantCard = new calc.testCard("babyGiant", "babyGiant(g, h, p)");
  babyGiantCard.test("babyGiant(3, 4, 7)", calc.bigIntValidator("4"));
  babyGiantCard.test("babyGiant(7, 11, 101)", calc.bigIntValidator("57"));
  babyGiantCard.test("babyGiant(2, 11, 101)", calc.bigIntValidator("13"));
  main.append(babyGiantCard.getRoot());

  var isRootCard = new calc.testCard("isRoot", "isRoot(g, p)");
  isRootCard.test("isRoot(2, 3)", calc.strongValidator(true));
  isRootCard.test("isRoot(2, 31)", calc.strongValidator(false));
  isRootCard.test("isRoot(3, 31)", calc.strongValidator(true));
  isRootCard.test("isRoot(2, 101)", calc.strongValidator(true));
  main.append(isRootCard.getRoot());

  var firstRootCard = new calc.testCard("firstRoot", "firstRoot(p)");
  firstRootCard.test("firstRoot(3)", calc.bigIntValidator("2"));
  firstRootCard.test("firstRoot(31)", calc.bigIntValidator("3"));
  firstRootCard.test("firstRoot(101)", calc.bigIntValidator("2"));
  firstRootCard.errorTest("firstRoot(4)");
  main.append(firstRootCard.getRoot());

  var orderCard = new calc.testCard("order", "order(a, m)");
  orderCard.test("order(2, 9)", calc.bigIntValidator("6"));
  orderCard.test("order(4, 11)", calc.bigIntValidator("5"));
  orderCard.test("order(3, 10)", calc.bigIntValidator("4"));
  main.append(orderCard.getRoot());

  var divirorsCard = new calc.testCard("divisors", "divisors(a)");
  divirorsCard.test("divisors(6)", calc.bigIntsValidator(["1", "2", "3", "6"]));
  divirorsCard.test("divisors(8)", calc.bigIntsValidator(["1", "2", "4", "8"]));
  divirorsCard.test("divisors(171411080493970003061)", calc.bigIntsValidator(["1", "12121212121", "14141414141", "171411080493970003061"]));
  main.append(divirorsCard.getRoot());

  var decomposeCard = new calc.testCard("decompose", "decompose(a)");
  decomposeCard.errorTest("decompose(-1)");
  decomposeCard.errorTest("decompose(0)");
  decomposeCard.test("decompose(1)", calc.primesValidator({}, "1"));
  decomposeCard.test("decompose(2)", calc.primesValidator({ "2": 1 }, "2"));
  decomposeCard.test("decompose(20)", calc.primesValidator({ "2": 2, "5": 1 }, "20"));
  decomposeCard.test("decompose(1024)", calc.primesValidator({ "2": 10 }, "1024"));
  decomposeCard.test("decompose(197)", calc.primesValidator({ "197": 1 }, "197"));
  decomposeCard.test("decompose(21631)", calc.primesValidator({ "97": 1, "223": 1 }, "21631"));
  decomposeCard.test("decompose(3628800)", calc.primesValidator({
    "2": 8,
    "3": 4,
    "5": 2,
    "7": 1
  }, "3628800"));
  decomposeCard.test("decompose(171411080493970003061)", calc.primesValidator({
    "12121212121": 1,
    "14141414141": 1
  }, "171411080493970003061"));
  main.append(decomposeCard.getRoot());

  var isPrimeCard = new calc.testCard("isPrime", "isPrime(a)");
  isPrimeCard.errorTest("isPrime(-1)");
  isPrimeCard.errorTest("isPrime(1)");
  isPrimeCard.test("isPrime(2)", calc.strongValidator(true));
  isPrimeCard.test("isPrime(3)", calc.strongValidator(true));
  isPrimeCard.test("isPrime(4)", calc.strongValidator(false));
  isPrimeCard.test("isPrime(101)", calc.strongValidator(true));
  main.append(isPrimeCard.getRoot());

  var phiCard = new calc.testCard("phi(a)");
  phiCard.errorTest("phi(-1)");
  phiCard.errorTest("phi(0)");
  phiCard.test("phi(1)", calc.bigIntValidator("1"));
  phiCard.test("phi(2)", calc.bigIntValidator("1"));
  phiCard.test("phi(5)", calc.bigIntValidator("4"));
  phiCard.test("phi(10)", calc.bigIntValidator("4"));
  phiCard.test("phi(21631)", calc.bigIntValidator("21312"));
  phiCard.test("phi(30)", calc.bigIntValidator("8"));
  phiCard.test("phi(5352499)", calc.bigIntValidator("" + (1236 * 4326)));
  phiCard.test("phi(171411080493970003061)", calc.bigIntValidator("171411080467707376800"));
  phiCard.test("phi(28692529)", calc.bigIntValidator("28680820"));
  main.append(phiCard.getRoot());

  var lcmCard = new calc.testCard("lcm", "lcm(a, b)");
  lcmCard.test("lcm(0, 0)", calc.bigIntValidator("0"));
  lcmCard.test("lcm(0, 11)", calc.bigIntValidator("0"));
  lcmCard.test("lcm(11, 0)", calc.bigIntValidator("0"));
  lcmCard.test("lcm(-7, 14)", calc.bigIntValidator("14"));
  lcmCard.test("lcm(-3, -7)", calc.bigIntValidator("21"));
  lcmCard.test("lcm(12, 18)", calc.bigIntValidator("36"));
  main.append(lcmCard.getRoot());

  var gcdCard = new calc.testCard("gcd", "gcd(a, b)");
  gcdCard.test("gcd(0, 0)", calc.bigIntValidator("0"));
  gcdCard.test("gcd(0, 11)", calc.bigIntValidator("11"));
  gcdCard.test("gcd(11, 0)", calc.bigIntValidator("11"));
  gcdCard.test("gcd(-7, 14)", calc.bigIntValidator("7"));
  gcdCard.test("gcd(-3, -7)", calc.bigIntValidator("1"));
  gcdCard.test("gcd(12, 18)", calc.bigIntValidator("6"));
  main.append(gcdCard.getRoot());

  var areCoprimeCard = new calc.testCard("areCoprime", "areCoprime(a, b)");
  areCoprimeCard.test("areCoprime(0, 0)", calc.strongValidator(false));
  areCoprimeCard.test("areCoprime(0, 11)", calc.strongValidator(false));
  areCoprimeCard.test("areCoprime(1, 11)", calc.strongValidator(true));
  areCoprimeCard.test("areCoprime(-7, 14)", calc.strongValidator(false));
  areCoprimeCard.test("areCoprime(3, 70)", calc.strongValidator(true));
  main.append(areCoprimeCard.getRoot());

  var modCard = new calc.testCard("mod", "mod(a, b)");
  modCard.test("mod(-11, 10)", calc.bigIntValidator("9"));
  modCard.test("mod(-1, 10)", calc.bigIntValidator("9"));
  modCard.test("mod(0, 10)", calc.bigIntValidator("0"));
  modCard.test("mod(1, 10)", calc.bigIntValidator("1"));
  modCard.test("mod(11, 10)", calc.bigIntValidator("1"));
  modCard.test("mod(1, 1)", calc.bigIntValidator("0"));
  modCard.errorTest("mod(5, -1)");
  modCard.errorTest("mod(5, 0)");
  main.append(modCard.getRoot());

  var inverseCard = new calc.testCard("inverse", "inverse(a, b)");
  inverseCard.test("inverse(1, 3)", calc.bigIntValidator("1"));
  inverseCard.test("inverse(2, 11)", calc.bigIntValidator("6"));
  inverseCard.test("inverse(-1, 37)", calc.bigIntValidator("36"));
  inverseCard.test("inverse(97, 28680820)", calc.bigIntValidator("26019713"));
  inverseCard.test("inverse(3, 41500)", calc.bigIntValidator("27667"));
  inverseCard.test("inverse(5, 5346936)", calc.bigIntValidator("4277549"));
  inverseCard.errorTest("inverse(1, 0)");
  main.append(inverseCard.getRoot());

  var euclideanCard = new calc.testCard("euclidean", "euclidean(a, b)");
  euclideanCard.test("euclidean(2, 3)", calc.euclideanValidator(["-1", "1", "1"], "2", "3"));
  euclideanCard.test("euclidean(3, 2)", calc.euclideanValidator(["1", "-1", "1"], "3", "2"));
  euclideanCard.test("euclidean(0, 3)", calc.euclideanValidator(["0", "1", "3"], "0", "3"));
  euclideanCard.test("euclidean(5, 5)", calc.euclideanValidator(["0", "1", "5"], "5", "5"));
  euclideanCard.test("euclidean(-5, 31)", calc.euclideanValidator(["6", "1", "1"], "-5", "31"));
  euclideanCard.test("euclidean(5, -31)", calc.euclideanValidator(["-6", "-1", "1"], "5", "-31"));
  euclideanCard.test("euclidean(-5, -31)", calc.euclideanValidator(["6", "-1", "1"], "-5", "-31"));
  main.append(euclideanCard.getRoot());

  var linearCongruenceCard = new calc.testCard("linearCongruence", "linearCongruence(a, b, m)");
  linearCongruenceCard.test("linearCongruence(2, 3, 9)", calc.linearCongruenceValidator(["6"], "2", "3", "9"));
  linearCongruenceCard.test("linearCongruence(2, 12, 9)", calc.linearCongruenceValidator(["6"], "2", "12", "9"));
  linearCongruenceCard.test("linearCongruence(3, 5, 7)", calc.linearCongruenceValidator(["4"], "3", "5", "7"));
  linearCongruenceCard.test("linearCongruence(-2, 3, 5)", calc.linearCongruenceValidator(["1"], "-2", "3", "5"));
  linearCongruenceCard.test("linearCongruence(2, 2, 4)", calc.linearCongruenceValidator(["1", "3"], "2", "2", "4"));
  linearCongruenceCard.errorTest("linearCongruence(3, 2, 9)");
  main.append(linearCongruenceCard.getRoot());

  var chineseRemainderCard = new calc.testCard("chineseRemainder", "chineseRemainder([a, b, ...], [m, n, ...])");
  chineseRemainderCard.test("chineseRemainder([1, 1], [2, 3])", calc.chineseRemainderValidator(["1", "6"], ["1", "1"], ["2", "3"]));
  chineseRemainderCard.test("chineseRemainder([9, 1], [10, 9])", calc.chineseRemainderValidator(["19", "90"], ["9", "1"], ["10", "9"]));
  chineseRemainderCard.test("chineseRemainder([4, 2, 17], [11, 13, 25])", calc.chineseRemainderValidator(["2017", "3575"], ["4", "2", "17"], ["11", "13", "25"]));
  chineseRemainderCard.test("chineseRemainder([15, 63, 247], [11, 13, 25])", calc.chineseRemainderValidator(["2897", "3575"], ["4", "2", "17"], ["11", "13", "25"]));
  main.append(chineseRemainderCard.getRoot());

  var modexpCard = new calc.testCard("modexp", "modexp(a, exp, m)");
  modexpCard.test("modexp(5, 0, 5)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(2, 1, 2)", calc.bigIntValidator("0"));
  modexpCard.test("modexp(2, 4, 8)", calc.bigIntValidator("0"));
  modexpCard.test("modexp(2, 4, 16)", calc.bigIntValidator("0"));
  modexpCard.test("modexp(2, 4, 32)", calc.bigIntValidator("16"));
  modexpCard.test("modexp(5, 1, 2)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(5, 1000000, 2)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(7, 1000001, 8)", calc.bigIntValidator("7"));
  modexpCard.test("modexp(2, 100, 97)", calc.bigIntValidator("16"));
  modexpCard.test("modexp(2, 1234, 11)", calc.bigIntValidator("5"));
  modexpCard.test("modexp(111, 222, 13)", calc.bigIntValidator("12"));
  modexpCard.test("modexp(222, 111, 13)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(5, 60, 21)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(3, 240, 385)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(123, 403, 100)", calc.bigIntValidator("67"));
  modexpCard.test("modexp(13, 13, 4)", calc.bigIntValidator("1"));
  modexpCard.test("modexp(13, 13, 10)", calc.bigIntValidator("3"));
  modexpCard.test("modexp(3, 13, 10)", calc.bigIntValidator("3"));
  modexpCard.test("modexp(2017, 4442, 100)", calc.bigIntValidator("89"));
  main.append(modexpCard.getRoot());

  var sentenceToPacketsCard = new calc.testCard("sentenceToPackets", "sentenceToPackets(sentence)");
  sentenceToPacketsCard.test("sentenceToPackets(\"HELP\", calc.RSA_BOOK_DICTIONARY)", calc.bigIntsValidator(["8051216"]));
  sentenceToPacketsCard.test("sentenceToPackets(\"GOODLUCK\", calc.RSA_BOOK_DICTIONARY)", calc.bigIntsValidator(["715150412210311"]));
  sentenceToPacketsCard.test("sentenceToPackets(\"My RSA progr\")", calc.bigIntsValidator(["493599545537992628251728"]));
  sentenceToPacketsCard.test("sentenceToPackets(\"am in MAT 00\")", calc.bigIntsValidator(["112399192499493756996363"]));
  sentenceToPacketsCard.test("sentenceToPackets(\"a works beau\")", calc.bigIntsValidator(["119933252821299912151131"]));
  sentenceToPacketsCard.test("sentenceToPackets(\"tifully!\")", calc.bigIntsValidator(["3019163122223575"]));
  main.append(sentenceToPacketsCard.getRoot());

  var rsaCryptCard = new calc.testCard("rsaCrypt", "rsaCrypt(n, e, packets)");
  rsaCryptCard.test("rsaCrypt(3813030197, 6043, [8051216])", calc.bigIntsValidator(["3469604637"]));
  rsaCryptCard.test("rsaCrypt(21631, 5, [715150412210311])", calc.bigIntsValidator(["10718"]));
  rsaCryptCard.test("rsaCrypt(21631, 5, [715, 1504, 1221, 311])", calc.bigIntsValidator(["16455", "3198", "11727", "16363"]));
  rsaCryptCard.test("rsaCrypt(21631, 8525, [16455, 3198, 11727, 16363])", calc.bigIntsValidator(["715", "1504", "1221", "311"]));
  rsaCryptCard.test("rsaCrypt(5352499, 4277549, [4784648, 1933497, 4437506])", calc.bigIntsValidator(["120", "1415", "1514"]));
  rsaCryptCard.test("rsaCrypt(41917, 3, [20114, 20120, 20125])", calc.bigIntsValidator(["8933", "33378", "27120"]));
  rsaCryptCard.test("rsaCrypt(41917, 27667, [8933, 33378, 27120])", calc.bigIntsValidator(["20114", "20120", "20125"]));
  rsaCryptCard.test("rsaCrypt(41917, 27667, [27120, 27121])", calc.bigIntsValidator(["20125", "34994"]));
  rsaCryptCard.test("rsaCrypt(7000065000086000065000007, 111191111, [493599545537992628251728, 112399192499493756996669, 649933252821299912151131, 3019163122223575])", calc.bigIntsValidator(["4516025171265301821132826", "1079359338438247905394033", "4988976264162078348012923", "828669140310317220332386"]));
  main.append(rsaCryptCard.getRoot());

  var rsaDecryptCard = new calc.testCard("rsaDecrypt", "rsaDecrypt(n, e, packets)");
  rsaDecryptCard.test("rsaDecrypt(3813030197, 6043, [3469604637])", calc.bigIntsValidator(["8051216"]));
  rsaDecryptCard.test("rsaDecrypt(21631, 5, [16455, 3198, 11727, 16363])", calc.bigIntsValidator(["715", "1504", "1221", "311"]));
  rsaDecryptCard.test("rsaDecrypt(21631, 5, [10718])", calc.bigIntsValidator(["3004"]));
  rsaDecryptCard.test("rsaDecrypt(7000065000086000065000007, 111191111, [4516025171265301821132826, 1079359338438247905394033, 4988976264162078348012923, 828669140310317220332386])", calc.bigIntsValidator([
      "493599545537992628251728",
      "112399192499493756996669",
      "649933252821299912151131",
      "3019163122223575"]));
  rsaDecryptCard.test("rsaDecrypt(7000065000086000065000007, 111191111, [4471783577974924047947728, 946837304201669529612698, 4084187492734677881996538, 1256241392267655834696489])", calc.bigIntsValidator([
      "591811309916312477994124",
      "132835263019252499312919",
      "241799545537991929991728",
      "15113075"]));
  rsaDecryptCard.test("rsaDecrypt(171411080493970003061, 131, ["
    + "71001342150873795667, "
    + "153143246353915161974, "
    + "127088740819931104427, "
    + "141679157873565510812, "
    + "142362211654179237783, "
    + "72329286858268702293, "
    + "48737123969205173378, "
    + "161969131432367017757, "
    + "43506158994499516038, "
    + "149578979123495067505"
    + "])", calc.bigIntsValidator([
      "44599969998940311599",
      "56189964637364727365",
      "63647090779999687369",
      "73647799998799996573",
      "99677399697399646373",
      "99646573996467739964",
      "69739964717399656578",
      "99991124149999687369",
      "73667799998799647399",
      "6573"]));
  main.append(rsaDecryptCard.getRoot());

  var packetsToSentenceCard = new calc.testCard("packetsToSentence", "packetsToSentence(packets)");
  packetsToSentenceCard.test("packetsToSentence([8051216], calc.RSA_BOOK_DICTIONARY)", calc.strongValidator("HELP"));
  packetsToSentenceCard.test("packetsToSentence([120, 1415, 1514], calc.RSA_BOOK_DICTIONARY)", calc.strongValidator("ATNOON"));
  packetsToSentenceCard.test("packetsToSentence(["
    + "591811309916312477994124, "
    + "132835263019252499312919, "
    + "241799545537991929991728, "
    + "15113075])",
    calc.strongValidator("What fun: Encryption using RSA is great!"));
  packetsToSentenceCard.test("packetsToSentence(["
    + "44599969998940311599, "
    + "56189964637364727365, "
    + "63647090779999687369, "
    + "73647799998799996573, "
    + "99677399697399646373, "
    + "99646573996467739964, "
    + "69739964717399656578, "
    + "99991124149999687369, "
    + "73667799998799647399, "
    + "6573"
    + "])",
    calc.strongValidator("HW 6 (Due Th 10.19.2017):  5.6.1:  #  2. 4. 6. 10. 12. 14. 16. 18. 22;  and  5.6.3:  # 1. 2."));
  main.append(packetsToSentenceCard.getRoot());

  var affineCryptCard = new calc.testCard("affineCrypt", "affineCrypt(text, a, b)");
  affineCryptCard.errorTest("affineCrypt(\"CCC\", 13, 7)");
  affineCryptCard.test("affineCrypt(\"LFICJBOPS\", 7, 5)", calc.strongValidator("EOJTQMZGB"));
  affineCryptCard.test("affineCrypt(\"SPARKY\", 3, 5)", calc.strongValidator("HYFEJZ"));
  affineCryptCard.test("affineCrypt(\"SPARKY\", -23, 5)", calc.strongValidator("HYFEJZ"));
  affineCryptCard.test("affineCrypt(\"SPARKY\", -23, -21)", calc.strongValidator("HYFEJZ"));
  affineCryptCard.test("affineCrypt(\"THEBEACH\", 7, 23)", calc.strongValidator("AUZEZXLU"));
  affineCryptCard.test("affineCrypt(\"QPMZ\", 17, 9)", calc.strongValidator("VEFS"));
  main.append(affineCryptCard.getRoot());

  var affineDecryptCard = new calc.testCard("affineDecrypt", "affineDecrypt(text, a, b)");
  affineDecryptCard.errorTest("affineDecrypt(\"CCC\", 13, 7)");
  affineDecryptCard.test("affineDecrypt(\"YOPPZITO\", 15, 6)", calc.strongValidator("WELLDONE"));
  affineDecryptCard.test("affineDecrypt(\"EOJTQMZGB\", 7, 5)", calc.strongValidator("LFICJBOPS"));
  affineDecryptCard.test("affineDecrypt(\"HYFEJZ\", 3, 5)", calc.strongValidator("SPARKY"));
  affineDecryptCard.test("affineDecrypt(\"HYFEJZ\", -23, 5)", calc.strongValidator("SPARKY"));
  affineDecryptCard.test("affineDecrypt(\"HYFEJZ\", -23, -21)", calc.strongValidator("SPARKY"));
  affineDecryptCard.test("affineDecrypt(\"AUZEZXLU\", 7, 23)", calc.strongValidator("THEBEACH"));
  affineDecryptCard.test("affineDecrypt(\"VEFS\", 17, 9)", calc.strongValidator("QPMZ"));
  main.append(affineDecryptCard.getRoot());
});
