const submitButton = document.querySelector("#check-btn");
const userInput = document.querySelector("#text-input");

const answerParagraph = document.querySelector("#result");
const divider = document.querySelector(".divider");

const hintText = document.querySelector("#hint-text");

const check = () => {
  if (!userInput.value) {
    alert("Please input a value");
    return null;
  }
  const inputArray = userInput.value.toUpperCase().split("");
  const filteredInputArray = inputArray.filter((el) => el.match(/[A-Z0-9]/));
  const reversedInput = filteredInputArray.reverse().join("");
  if (
    inputArray.filter((el) => el.match(/[A-Z0-9]/)).join("") === reversedInput
  ) {
    return true;
  }
  return false;
};

const displayAnswer = () => {
  const checkOutput = check();
  if (checkOutput === null) {
    return;
  }
  divider.classList.remove("hidden");

  if (checkOutput) {
    answerParagraph.innerHTML = `${userInput.value} is a palindrome`;
    return;
  }
  answerParagraph.innerHTML = `${userInput.value} is not a palindrome`;
};

const showHint = () => {
  hintText.classList.remove("no-display");
};

submitButton.addEventListener("click", displayAnswer);
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    displayAnswer();
  }
});
