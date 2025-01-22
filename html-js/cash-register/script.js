let price = 6.42;
// let cid = [
//   ["PENNY", 1.01],
//   ["NICKEL", 2.05],
//   ["DIME", 3.1],
//   ["QUARTER", 4.25],
//   ["ONE", 90],
//   ["FIVE", 55],
//   ["TEN", 20],
//   ["TWENTY", 60],
//   ["ONE HUNDRED", 100],
// ];

let cid = [
  ["PENNY", 0.7],
  ["NICKEL", 1],
  ["DIME", 3.1],
  ["QUARTER", 1.25],
  ["ONE", 1],
  ["FIVE", 0],
  ["TEN", 0],
  ["TWENTY", 0],
  ["ONE HUNDRED", 0],
];

const outputEl = document.querySelector("#change-due");
document.getElementById("price").textContent = price;

const form = document.querySelector("form");

const recursiveCount = (moneyRemainder, outputObj = {}) => {
  if (moneyRemainder == 0) {
    return outputObj;
  }
  if (moneyRemainder >= 100 && cid[8][1] - 100 >= 0) {
    cid[8][1] -= 100;
    outputObj.hundred = outputObj.hundred + 100 || 100;
    return recursiveCount(
      Math.round((moneyRemainder - 100) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 20 && cid[7][1] - 20 >= 0) {
    cid[7][1] -= 20;
    outputObj.twenty = outputObj.twenty + 20 || 20;
    return recursiveCount(
      Math.round((moneyRemainder - 20) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 10 && cid[6][1] - 10 >= 0) {
    cid[6][1] -= 10;
    outputObj.ten = outputObj.ten + 10 || 10;
    return recursiveCount(
      Math.round((moneyRemainder - 10) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 5 && cid[5][1] - 5 >= 0) {
    cid[5][1] -= 5;
    outputObj.five = outputObj.five + 5 || 5;
    return recursiveCount(
      Math.round((moneyRemainder - 5) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 1 && cid[4][1] - 1 >= 0) {
    cid[4][1] -= 1;
    outputObj.one = outputObj.one + 1 || 1;
    return recursiveCount(
      Math.round((moneyRemainder - 1) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 0.25 && cid[3][1] - 0.25 >= 0) {
    cid[3][1] = cid[3][1] - 0.25;
    outputObj.quarter = outputObj.quarter + 0.25 || 0.25;
    return recursiveCount(
      Math.floor((moneyRemainder - 0.25) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 0.1 && cid[2][1] - 0.1 >= 0) {
    cid[2][1] = Math.round((cid[2][1] - 0.1) * 100) / 100;
    outputObj.dime = outputObj.dime + 0.1 || 0.1;
    return recursiveCount(
      Math.round((moneyRemainder - 0.1) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 0.05 && cid[1][1] - 0.05 >= 0) {
    cid[1][1] = Math.round((cid[1][1] - 0.05) * 100) / 100;
    outputObj.nickel = outputObj.nickel + 0.05 || 0.05;
    return recursiveCount(
      Math.round((moneyRemainder - 0.05) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder >= 0.01 && cid[0][1] - 0.01 >= 0) {
    cid[0][1] = Math.round((cid[0][1] - 0.01) * 100) / 100;
    outputObj.penny = outputObj.penny + 0.01 || 0.01;
    return recursiveCount(
      Math.round((moneyRemainder - 0.01) * 100) / 100,
      outputObj
    );
  }
  if (moneyRemainder > 0) {
    return false;
  }
};

const updateUI = (outputObj) => {
  const showOutputObj = () => {
    const outputArr = [];
    for (let unit in outputObj) {
      outputArr.push([unit, outputObj[unit]]);
    }
    outputArr.sort((a, b) => b[1] - a[1]);
    for (let unit of outputArr) {
      outputEl.innerHTML += ` ${unit[0].toUpperCase()}: $${
        Math.round(unit[1] * 100) / 100
      }`;
    }
  };
  if (!outputObj) {
    outputEl.innerHTML = `Status: <span class="color-red">INSUFFICIENT_FUNDS</span>`;
    return;
  }
  if (Object.values(cid).every((value) => value[1] === 0)) {
    outputEl.innerHTML = `Status: <span class="color-orange">CLOSED`;
    showOutputObj();
    return;
  }
  outputEl.innerHTML = `Status: <span class="color-green">OPEN</span>`;
  showOutputObj();
  return;
};

const showCID = () => {
  const cidEl = document.querySelector("#cid tbody");
  cidEl.innerHTML = "";
  for (let unit of cid) {
    cidEl.innerHTML += `
    <tr><td>${unit[0]}<td><td>$${unit[1]}<td></tr>
        `;
  }
};
showCID();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  const customerMoney = parseFloat(input.value);
  const moneyToGiveToCustomer = Math.round((customerMoney - price) * 100) / 100;
  if (moneyToGiveToCustomer < 0) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  if (moneyToGiveToCustomer === 0) {
    outputEl.textContent = "No change due - customer paid with exact cash";
    return;
  }
  updateUI(recursiveCount(moneyToGiveToCustomer));
  showCID();
});
