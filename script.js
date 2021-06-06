const meter = document.getElementById("password-meter");
const passwordInput = document.getElementById("password-input");
const suggestions = document.getElementById("suggestions");
const randGenerator = document.getElementById("rand-generator-button");

passwordInput.addEventListener("input", () => updateStrengthMeter());
randGenerator.addEventListener("click", () => generateRandom());

const updateStrengthMeter = () => {
  const weaknesses = calcPasswordWeaknesses(passwordInput.value);
  suggestions.innerHTML = "Suggestions: ";
  let strength = 100;
  weaknesses.forEach((weakness) => {
    if (weakness == null) return;
    strength -= weakness.deduction;
    const messageElement = document.createElement("div");
    messageElement.innerHTML = "&bull; " + weakness.message;
    suggestions.appendChild(messageElement);
  });

  meter.style.setProperty("--strength", strength);
};

function calcPasswordWeaknesses(password) {
  let weaknesses = [];
  weaknesses.push(lengthChecker(password));
  weaknesses.push(characterTypeWeakness(password, /[a-z]/g, "lowercase")); //lowercase check
  weaknesses.push(characterTypeWeakness(password, /[A-Z]/g, "uppercase")); //uppercase check
  weaknesses.push(characterTypeWeakness(password, /[0-9]/g, "numerical")); //digits/numbers check
  weaknesses.push(
    characterTypeWeakness(password, /[^0-9A-Za-z\s]/g, "special")
  ); //special case check
  weaknesses.push(repeatCharWeakness(password)); //repeated numbers check
  weaknesses.push(checkForSpaces(password)); //repeated numbers check
  return weaknesses;
}

const lengthChecker = (password) => {
  let length = password.length;
  if (length < 5) {
    return {
      message: "Password is too short",
      deduction: 40,
    };
  }
  if (length <= 10) {
    return {
      message: "Password could be longer",
      deduction: 15,
    };
  }
};

function characterTypeWeakness(password, regex, type) {
  const matches = password.match(regex) || [];

  if (matches.length < 1) {
    return {
      message: `Password must contain some ${type} characters`,
      deduction: 20,
    };
  }
  if (matches.length <= 2) {
    return {
      message: `Password could have some more ${type} characters`,
      deduction: 5,
    };
  }
}

function repeatCharWeakness(password) {
  let matches = password.match(/(.)\1/g) || [];
  if (matches.length > 0) {
    return {
      message: "Your password has repeated characters",
      deduction: matches.length * 10,
    };
  }
}

function checkForSpaces(password) {
  const matches = password.match(/\s/g) || [];
  if (matches.length > 0) {
    return {
      message: "Your password contains spaces, no spaces allowed",
      deduction: 100,
    };
  }
}

function generateRandom() {
  const words = [
    "CONCAVE",
    "ANYTHING",
    "POISONER",
    "DONATION",
    "APOLOGY",
    "DEMON",
    "CONSULTANT",
    "FORM",
    "PRESIDENT",
    "FILTER",
  ];
  const specialChars = ["!", "@", "#", "$", "%", "^", "<", "&", "*", "/", ","];
  const uppercase = words[Math.floor(Math.random() * words.length)];
  const lowercase =
    words[Math.floor(Math.random() * words.length)].toLowerCase();
  var number = "";
  var special = "";
  for (i = 0; i < 3; i++) {
    special =
      special + specialChars[Math.floor(Math.random() * specialChars.length)];
    number = number + Math.floor(Math.random() * 10);
  }
  const password = uppercase + lowercase + number + special;
  passwordInput.value = password;
  passwordInput.focus();
  updateStrengthMeter();
}
