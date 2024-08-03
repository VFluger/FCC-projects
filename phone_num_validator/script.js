const input = document.querySelector("#user-input");
const checkBtn = document.querySelector("#check-btn");
const clearBtn = document.querySelector("#clear-btn");

const output = document.querySelector("#results-div");

const appendToOutput = (isValid) => {
  if (isValid) {
    output.innerHTML += `
    <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#73c977" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
    <p>Valid US number: <strong><i>${input.value}</strong></i></p>
    </div>
    `;
    return;
  }
  output.innerHTML += `
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#eb4c3b" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
  <p>Invalid US number: <strong><i>${input.value}</strong></i></p>
  </div>
    `;
};

checkBtn.addEventListener("click", () => {
  const inputValue = input.value;
  if (!inputValue) {
    alert("Please provide a phone number");
    return;
  }
  const onlyNumRegex = /[0-9]/g;
  if (
    inputValue[0] !== "1" &&
    inputValue.match(onlyNumRegex).join("").length > 10
  ) {
    appendToOutput(false);
    return;
  }
  const regex = /^1?\s?(\(\d{3}\)|\d{3})(\s|-)?(\d{3})(\s|-)?(\d{4})$/;

  appendToOutput(regex.test(inputValue));
});

clearBtn.addEventListener("click", () => {
  output.innerHTML = "";
});
