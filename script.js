const greating = document.querySelector(".greating");
const dateEl = document.querySelector(".date");

const userName = document.querySelector(".user-name");
const userLastName = document.querySelector(".user-last-name");
const userProfession = document.querySelector(".user-profession");
const userPhotos = document.querySelectorAll(".user-dp");

const firstName = document.querySelector(".first-name");
const lastName = document.querySelector(".last-name");
const profession = document.querySelector(".profession");
const startingBalance = document.querySelector(".balance");
const inputPhoto = document.querySelector(".upload-photo");
const signup = document.querySelector(".sign-up");
const signIn = document.querySelector(".sign-in");

const selectMonths = document.querySelector(".select-month");
const monthDropdown = document.querySelector(".month-dropdown");

const mainContainer = document.querySelector(".main-container");

let userState = JSON.parse(localStorage.getItem("userData")) || {
  firstname: "",
  lastname: "",
  profession: "",
  startingBalance: "",
  imgSrc: "",
};

console.log(userState);

function render() {
  if (
    userState &&
    userState.firstname &&
    userState.lastname &&
    userState.profession
  ) {
    console.log("All fields are filled");
    mainContainer.style.display = "grid";
    signup.style.display = "none"; //
  } else {
    console.log("Some fields are missing");
  }
}

render();

// ==================signUp section============

function inputsHandler(e) {
  const name = e.target.name;
  console.log(name);

  const value = e.target.value;
  console.log(value);

  userState[name] = value;

  userState;
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", inputsHandler);
});

inputPhoto.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    userState.imgSrc = reader.result;
  };

  reader.readAsDataURL(file);
});

signIn.addEventListener("click", () => {
  localStorage.setItem("userData", JSON.stringify(userState));

  userState = JSON.parse(localStorage.getItem("userData"));
  render();
  console.log(userState);
});

userName.innerText = userState.firstname;
userLastName.innerText = userState.lastname;
userProfession.innerText = userState.profession;

userPhotos.forEach((userPhoto) => {
  userPhoto.src = userState.imgSrc;
});

dateEl.innerText = new Date().toLocaleString("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

let hour = new Date().getHours();

if (hour < 12) {
  greating.innerText = "Good Morning";
} else if (hour >= 12 && hour < 16) {
  greating.innerText = "Good Afternoon";
} else if (hour >= 16 && hour < 20) {
  greating.innerText = "Good Evening";
} else {
  greating.innerText = "Good Night";
}

const currentMonth = new Date().getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const displayName = document.querySelector(".display-month");

function dropDown(selectedMonth) {
  months.forEach((month, index) => {
    const monthOption = document.createElement("p");
    monthOption.classList.add("month");
    monthOption.innerText = month;
    monthOption.tabIndex = index;
    monthDropdown.appendChild(monthOption);
  });
  const monthName = document.querySelectorAll(".month");

  let selectedMonth = currentMonth;

  displayName.innerText = months[selectedMonth];
  console.log(selectedMonth);

  monthName[selectedMonth].classList.add("active-month");

  selectMonths.addEventListener("click", () => {
    monthDropdown.classList.toggle("active-btn");
  });
}

monthName.forEach((month, index) => {
  month.addEventListener("click", () => {
    month.classList.remove("active-month");
    selectedMonth = monthName[index];
    monthName[index].classList.add("active-month");
  });

  dropDown();
});

dropDown();

// =================== Dashboard charts ===================

function getLegendPosition() {
  return window.innerWidth < 1070 ? "bottom" : "right";
}

// -------- Doughnut Chart --------

const ctx = document.getElementById("myChart");

const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Salary", "Cash in hand", "Last Month Balance"],
    datasets: [
      {
        label: "Balance",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
          "rgb(56, 95, 150)",
        ],
        borderRadius: 10,
        hoverOffset: 4,
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: getLegendPosition(),
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 12,
          padding: 20,
        },
      },
    },
  },
});

window.addEventListener("resize", () => {
  chart.options.plugins.legend.position = getLegendPosition();
  chart.update();
});

// -------- Bar Chart --------

const barCharts = document.querySelectorAll(".myBarChart");

barCharts.forEach((canvas, index) => {
  let labels;
  let incomeData;
  let expenseData;

  // First chart → 5 months
  if (index === 0) {
    labels = ["Jan", "Feb", "Mar", "Apr", "May"];
    incomeData = [500, 600, 550, 700, 650];
    expenseData = [300, 400, 350, 450, 420];
  }

  // Second chart → 9 months
  else {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    incomeData = [500, 600, 550, 700, 650, 720, 680, 750, 800];
    expenseData = [300, 400, 350, 450, 420, 460, 430, 470, 500];
  }

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "rgb(54, 162, 235)",
        },
        {
          label: "Expense",
          data: expenseData,
          backgroundColor: "rgb(255, 99, 132)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
});

window.addEventListener("resize", () => {
  chart.options.plugins.legend.position = getLegendPosition();
  chart.update();
});

// ==================Finance Section===============

const addTrxBtn = document.querySelector(".add-trx-btn");
const btnContent = document.querySelector(".trx-btn-content");
const monthlyIncomeBalance = document.querySelector(".monthly-income-amount");

addTrxBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  btnContent.classList.toggle("active-btn");
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".trx-btn, .trx-btn-content")) {
    btnContent.classList.remove("active-btn");
  }
});

let userTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

const today = new Date();

console.log(currentMonth);

const formattedDate = today.toISOString().split("T")[0];

document.querySelectorAll(".trx-date").forEach((dateInput) => {
  dateInput.value = formattedDate;
});

function addTransaction() {
  const nameInput = document.querySelector(".trx-name");
  const amountInput = document.querySelector(".trx-amount");

  const categoryInput = document.querySelector("option:checked");
  const dateInput = document.querySelector(".trx-date");

  const newTransaction = {
    id: Date.now(),
    trxName: nameInput.value.trim(),
    trxAmount: Number(amountInput.value),
    trxType: "Income",
    trxCategory: categoryInput.value,
    trxDate: dateInput.value,
  };
  userTransactions.push(newTransaction);

  console.log(newTransaction);
  console.log(userTransactions);

  localStorage.setItem("transactions", JSON.stringify(userTransactions));

  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Salary";
  dateInput.value = formattedDate;

  finaceRender();
}

const addIncomebtn = document.querySelector(".add-income");
addIncomebtn.addEventListener("click", addTransaction);

const income = userTransactions.filter((trx) => trx.trxType === "Income");
const totalIncome = income.reduce((acc, trx) => acc + Number(trx.trxAmount), 0);

function monthlyTransaction() {
  monthlyIncomeBalance.innerText = `${totalIncome}`;

  const transactionsContainer = document.querySelector(".finance-transactions");
  transactionsContainer.innerHTML = "";

  income.forEach((trx, index) => {
    const transactionItem = document.createElement("div");
    transactionItem.classList.add("transaction-card");

    const transaction = document.createElement("div");
    transaction.classList.add("transaction");

    const trxSerial = document.createElement("p");
    trxSerial.classList.add("transaction-no");
    trxSerial.innerText = index + 1;

    const trxIcon = document.createElement("div");
    trxIcon.classList.add("transaction-icon");

    const trxImg = document.createElement("img");
    trxImg.src = `./assets/img/categories-icon/${trx.trxCategory.toLowerCase()}.png`;

    trxIcon.appendChild(trxImg);

    const trxInfo = document.createElement("div");
    trxInfo.classList.add("transaction-info");

    const trxCat = document.createElement("p");
    trxCat.classList.add("transaction-category");
    trxCat.innerText = trx.trxCategory;

    const trxDate = document.createElement("p");
    trxDate.classList.add("transaction-date");
    trxDate.innerText = trx.trxDate;

    trxInfo.append(trxCat, trxDate);

    const trxAmount = document.createElement("p");
    trxAmount.classList.add("transaction-amount");
    trxAmount.innerText = trx.trxAmount;

    const editBtn = document.createElement("div");
    editBtn.classList.add("icon");
    editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

    transaction.append(trxSerial, trxIcon, trxInfo);

    transactionItem.appendChild(transaction);
    transactionItem.append(trxAmount, editBtn);
    transactionsContainer.appendChild(transactionItem);
  });
}

console.log(userTransactions);

// -------- Chart --------

const budgetChart = document.querySelector(".budget-chart");

const budgetchart = new Chart(budgetChart, {
  type: "doughnut",
  data: {
    labels: ["Expense", "Available"],
    datasets: [
      {
        label: "Balance",
        data: [300, 560],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(56, 95, 150)"],
        borderRadius: 10,
        hoverOffset: 4,
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: getLegendPosition(),
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 12,
          padding: 20,
        },
      },
    },
  },
});

//--------budget-categories

const inputBudgetBtn = document.querySelector(".add-budget-btn");
const budgetContent = document.querySelector(".budget-cat-content");

inputBudgetBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  budgetContent.classList.toggle("active-btn");
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".add-budget-btn, .budget-cat-content")) {
    budgetContent.classList.remove("active-btn");
  }
});

const budgetTrx = JSON.parse(localStorage.getItem("budgetTransactions")) || [];

const totalBudget = budgetTrx.reduce(
  (acc, trx) => acc + Number(trx.trxAmount),
  0,
);

function addBudget() {
  let amountInput = document.querySelector(".budget-amount").value;
  let categoryInput = document.querySelector(".budget-category").value;

  if (!amountInput || !categoryInput) {
    alert("Please enter amount and category");
    return;
  }

  const newBudgetTrx = {
    id: Date.now(),
    trxAmount: amountInput,
    trxCategory: categoryInput,
  };

  budgetTrx.push(newBudgetTrx);
  localStorage.setItem("budgetTransactions", JSON.stringify(budgetTrx));

  // clear inputs
  amountInput = "";
  categoryInput = "";

  budgetRender();
  budgetChartRender();
  console.log(budgetTrx);
}

const addBudgetbtn = document.querySelector(".add-budget");
addBudgetbtn.addEventListener("click", addBudget);

function budgetRender() {
  const categoriesContainer = document.querySelector(".categories");
  categoriesContainer.innerHTML = "";
  budgetTrx.forEach((budgetTrx) => {
    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category-item");

    const catIconDiv = document.createElement("div");
    catIconDiv.classList.add("category-icon");

    const catIcon = document.createElement("img");
    catIcon.src = `./assets/img/categories-icon/${budgetTrx.trxCategory}.png`;
    catIconDiv.appendChild(catIcon);

    const catDetails = document.createElement("div");
    catDetails.classList.add("category-details");

    const categoryName = document.createElement("p");
    categoryName.classList.add("category");
    categoryName.innerText = budgetTrx.trxCategory;

    const catAmount = document.createElement("span");
    catAmount.classList.add("budget-money");
    catAmount.innerText = `$${budgetTrx.trxAmount}`;

    const editBtn = document.createElement("div");
    editBtn.classList.add("edit");
    editBtn.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;

    catDetails.append(categoryName, catAmount);
    categoryItem.append(catIconDiv, catDetails, editBtn);

    categoriesContainer.appendChild(categoryItem);
  });
}

//-----------saving Category
const inputSavingBtn = document.querySelector(".add-saving-btn");
const savingContainer = document.querySelector(".savings-cat-container");

inputSavingBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  savingContainer.classList.toggle("active-btn");
  console.log("ckl");
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".add-saving-btn, .savings-cat-container")) {
    savingContainer.classList.remove("active-btn");
  }
});

const savingTrx = JSON.parse(localStorage.getItem("savingTransactions")) || [];
const totalSavings = savingTrx.reduce(
  (acc, trx) => acc + Number(trx.trxAmount),
  0,
);
const addSavingBtn = document.querySelector(".add-saving");

function addSaving() {
  let amountInput = document.querySelector(".saving-amount").value;
  let categoryInput = document.querySelector(".saving-category").value;

  if (!amountInput || !categoryInput) {
    alert("Please enter amount and category");
    return;
  }

  const newSavingTrx = {
    id: Date.now(),
    trxAmount: amountInput,
    trxCategory: categoryInput,
    trxDate: formattedDate,
  };
  savingTrx.push(newSavingTrx);
  localStorage.setItem("savingTransactions", JSON.stringify(savingTrx));

  amountInput = "";
  categoryInput = "";
  console.log(amountInput, categoryInput, savingTrx);

  finaceRender();
}

addSavingBtn.addEventListener("click", addSaving);

const savingTrxContainer = document.querySelectorAll(".saving-transactions");

function savingsRender() {
  savingTrxContainer.forEach((container, containerIndex) => {
    container.innerHTML = "";

    savingTrx.forEach((savingTrx, index) => {
      const transactionItem = document.createElement("div");
      transactionItem.classList.add("transaction-card");

      const transaction = document.createElement("div");
      transaction.classList.add("transaction");

      const trxSerial = document.createElement("p");
      trxSerial.classList.add("transaction-no");
      trxSerial.innerText = index + 1;

      const trxInfo = document.createElement("div");
      trxInfo.classList.add("transaction-info");

      const trxCat = document.createElement("p");
      trxCat.classList.add("transaction-category");
      trxCat.innerText = savingTrx.trxCategory;

      const trxDate = document.createElement("p");
      trxDate.classList.add("transaction-date");
      trxDate.innerText = savingTrx.trxDate;

      trxInfo.append(trxCat, trxDate);

      const trxAmount = document.createElement("p");
      trxAmount.classList.add("transaction-amount");
      trxAmount.innerText = savingTrx.trxAmount;

      const editBtn = document.createElement("div");
      editBtn.classList.add("icon");
      editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

      transaction.appendChild(trxSerial);

      if (containerIndex === 0) {
        const trxIcon = document.createElement("div");
        trxIcon.classList.add("transaction-icon");
        const trxImg = document.createElement("img");
        trxImg.src = `./assets/img/categories-icon/${savingTrx.trxCategory.toLowerCase()}.png`;

        trxIcon.appendChild(trxImg);
        transaction.appendChild(trxIcon);
      }
      transaction.appendChild(trxInfo);

      transactionItem.appendChild(transaction);
      transactionItem.append(trxAmount, editBtn);
      container.appendChild(transactionItem);
    });
  });
}

function finaceRender() {
  monthlyTransaction();
  budgetRender();
  budgetChartRender();
  savingsRender();
}

// ----------------------------expense Section-----------------------------

const expTrxBtn = document.querySelector(".exp-trx-btn");
const expBtnContent = document.querySelector(".exp-content");

expTrxBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  expBtnContent.classList.toggle("active-btn");

  console.log("click");
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".exp-trx-btn, .exp-content")) {
    expBtnContent.classList.remove("active-btn");
  }
});

document.querySelector(".exp-trx-date").value = formattedDate;

function addExpenseTrx() {
  const nameInput = document.querySelector(".exp-trx-name").value.trim();
  const amountInput = document.querySelector(".exp-trx-amount").value;

  const categoryInput = document.querySelector(".expense-category").value;
  const dateInput = document.querySelector(".exp-trx-date").value;

  const newTransaction = {
    id: Date.now(),
    trxName: nameInput,
    trxAmount: Number(amountInput),
    trxType: "Expense",
    trxCategory: categoryInput,
    trxDate: dateInput,
  };
  userTransactions.push(newTransaction);

  console.log(newTransaction);
  console.log(userTransactions);

  localStorage.setItem("transactions", JSON.stringify(userTransactions));

  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  // categoryInput.value = "Salary";
  dateInput.value = formattedDate;

  expenseRender();
}
const expense = userTransactions.filter((trx) => trx.trxType === "Expense");
const totalExpense = expense.reduce(
  (acc, trx) => acc + Number(trx.trxAmount),
  0,
);

function expenseRender() {
  const transactionsContainer = document.querySelector(".recent-expense");
  transactionsContainer.innerHTML = "";

  expense.forEach((trx) => {
    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category-item");

    const catIconDiv = document.createElement("div");
    catIconDiv.classList.add("category-icon");

    const catIcon = document.createElement("img");
    catIcon.src = `./assets/img/categories-icon/${trx.trxCategory.toLowerCase()}.png`;
    catIconDiv.appendChild(catIcon);

    const catDetails = document.createElement("div");
    catDetails.classList.add("category-details");

    const categoryName = document.createElement("p");
    categoryName.classList.add("category");
    categoryName.innerText = trx.trxCategory;

    const catAmount = document.createElement("span");
    catAmount.classList.add("budget-money");
    catAmount.innerText = `$${trx.trxAmount}`;

    const editBtn = document.createElement("div");
    editBtn.classList.add("edit");
    editBtn.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;

    catDetails.append(categoryName, catAmount);
    categoryItem.append(catIconDiv, catDetails, editBtn);

    transactionsContainer.appendChild(categoryItem);
  });
}

expenseRender();

const addExpense = document.querySelector(".add-expense");
addExpense.addEventListener("click", addExpenseTrx);

const totalBalance = totalIncome - totalExpense - totalSavings;

console.log(totalBalance);

console.log(budgetchart.data.datasets[0].data);

// JSON.parse(totalBalance.push(budgetchart.data.datasets[0].data[0]));
budgetchart.data.datasets[0].data[0] = [totalExpense];
budgetchart.data.datasets[0].data[1] = [totalBalance];
console.log(totalBalance);
console.log(totalExpense);
console.log(totalIncome);
console.log(totalBudget);

const monthlyBudgetBalanceCon = document.querySelector(
  ".monthly-budget-balance",
);
const availableBalanceCon = document.querySelector(".available-balance");
const totalExpenseCon = document.querySelector(".expense-balance");
const savingsbalanceCon = document.querySelector(".savings-balance");

function budgetChartRender() {
  monthlyBudgetBalanceCon.innerText = totalBudget;
  availableBalanceCon.innerText = totalBalance;
  totalExpenseCon.innerText = totalExpense;
  savingsbalanceCon.innerText = totalSavings;

  budgetchart.update();
}

finaceRender();
// monthlyBudgetBalanceCon.innerText = "0";
// availableBalanceCon.innerText = "0";
// totalExpenseCon.innerText = "0";
// savingsbalanceCon.innerText = "0";

// function chartData() {
//   if (
//     income === 0 ||
//     totalBalance === 0 ||
//     totalExpense === 0 ||
//     totalSavings === 0
//   ) {
//     monthlyBudgetBalanceCon.innerText = "0";
//     availableBalanceCon.innerText = "0";
//     totalExpenseCon.innerText = "0";
//     savingsbalanceCon.innerText = "0";
//   } else {

//   }
// }
// chartData();
