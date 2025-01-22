const convertBtn = document.getElementById("convert-btn");
const input = document.getElementById("number");
const output = document.getElementById("output");

const showInvalidInput = (msg = "Please enter a valid number") => {
  output.innerHTML = msg;
};

const convert = (originalNum) => {
  const table = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];
  const ConvertedArr = [];
  table.forEach((arr) => {
    while (originalNum >= arr[1]) {
      ConvertedArr.push(arr[0]);
      originalNum -= arr[1];
    }
  });
  output.innerHTML = ConvertedArr.join("");
};

convertBtn.addEventListener("click", () => {
  if (input.value.includes("e")) {
    showInvalidInput();
    return;
  }
  const inputValue = parseInt(input.value);
  if (isNaN(inputValue)) {
    showInvalidInput();
    return;
  }
  if (inputValue < 0) {
    showInvalidInput("Please enter a number greater than or equal to 1");
    return;
  }
  if (inputValue >= 4000) {
    showInvalidInput("Please enter a number less than or equal to 3999");
    return;
  }
  convert(inputValue);
});
