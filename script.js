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
  currency: "",
  imgSrc: "",
};

console.log(userState);

function render() {
  if (
    userState &&
    userState.firstname &&
    userState.lastname &&
    userState.profession &&
    userState.currency
  ) {
    console.log("All fields are filled");
    mainContainer.style.display = "grid";
    signup.style.display = "none"; //
    dashboardRender();

    userName.innerText = userState.firstname;
    userLastName.innerText = userState.lastname;
    userProfession.innerText = userState.profession;

    userPhotos.forEach((userPhoto) => {
      userPhoto.src = userState.imgSrc;
    });
  } else {
    console.log("Some fields are missing");
  }
}

// ==================signUp section============

function inputsHandler(e) {
  const name = e.target.name;

  const value = e.target.value;

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

let selectedMonth = currentMonth;

function dropDown() {
  monthDropdown.innerHTML = "";

  months.forEach((month, index) => {
    const monthOption = document.createElement("p");
    monthOption.classList.add("month");
    monthOption.innerText = month;

    if (index === selectedMonth) {
      monthOption.classList.add("active-month");
    }

    monthOption.addEventListener("click", () => {
      selectedMonth = index;
      console.log("click", "selected month", selectedMonth);

      displayName.innerText = months[selectedMonth];

      document
        .querySelectorAll(".month")
        .forEach((m) => m.classList.remove("active-month"));

      monthOption.classList.add("active-month");
      monthDropdown.classList.remove("active-btn");

      finaceRender();
    });

    monthDropdown.appendChild(monthOption);
  });

  displayName.innerText = months[selectedMonth];
}

selectMonths.addEventListener("click", () => {
  monthDropdown.classList.toggle("active-btn");
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-month")) {
    monthDropdown.classList.remove("active-btn");
  }
});

dropDown();

// =================== Dashboard charts ===================

let userTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

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
        data: [0, 0, 0],
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
const charts = [];

barCharts.forEach((canvas, index) => {
  // ðŸ”¥ destroy previous chart if exists
  if (charts[index]) {
    charts[index].destroy();
  }

  let labels, incomeData, expenseData;

  if (index === 0) {
    labels = ["Jan", "Feb", "Mar", "Apr", "May"];
    incomeData = [0, 0, 0, 0, 0];
    expenseData = [0, 0, 0, 0, 0];
  } else {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    incomeData = [0, 0, 0, 0, 0];
    expenseData = [0, 0, 0, 0, 0];
  }

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Income", data: incomeData },
        { label: "Expense", data: expenseData },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  charts[index] = chart;
});

window.addEventListener("resize", () => {
  chart.options.plugins.legend.position = getLegendPosition();
  charts[0].update();
  charts[1].update();
});

const recentTrx = document.querySelector(".transactions");

function recentTransactions() {
  recentTrx.innerHTML = "";
  userTransactions.forEach((trx, index) => {
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
    trxCat.innerText = trx.trxCategory;

    const trxDate = document.createElement("p");
    trxDate.classList.add("transaction-date");
    trxDate.innerText = trx.trxDate;

    trxInfo.append(trxCat, trxDate);

    const trxType = document.createElement("p");
    trxType.classList.add("trx-type");
    trxType.innerText = trx.trxType;
    if (trx.trxType === "Income") {
      trxType.classList.add("income");
    } else {
      trxType.classList.add("expense");
    }
    const trxAmount = document.createElement("p");
    trxAmount.classList.add("transaction-amount");
    trxAmount.innerText = trx.trxAmount;

    const editBtn = document.createElement("div");
    editBtn.classList.add("icon");
    editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

    transaction.appendChild(trxSerial);

    const trxIcon = document.createElement("div");
    trxIcon.classList.add("transaction-icon");
    const trxImg = document.createElement("img");
    trxImg.src = `./assets/img/categories-icon/${trx.trxCategory.toLowerCase()}.png`;

    trxIcon.appendChild(trxImg);
    transaction.appendChild(trxIcon);

    transaction.appendChild(trxInfo);
    transaction.appendChild(trxType);

    transactionItem.appendChild(transaction);
    transactionItem.append(trxAmount, editBtn);
    recentTrx.appendChild(transactionItem);
  });
}

function dashboardRender() {
  recentTransactions();
  chart.update();
  charts.forEach((chartItem) => chartItem.update());
}

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

const today = new Date();

const formattedDate = today.toISOString().split("T")[0];

document.querySelectorAll(".trx-date").forEach((dateInput) => {
  dateInput.value = formattedDate;
});

function addTransaction() {
  const nameInput = document.querySelector(".trx-name");
  const amountInput = document.querySelector(".trx-amount");

  const categoryInput = document.querySelector(".income-trx-category");
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

  localStorage.setItem("transactions", JSON.stringify(userTransactions));

  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Salary";
  dateInput.value = formattedDate;

  finaceRender();
}

const addIncomebtn = document.querySelector(".add-income");
addIncomebtn.addEventListener("click", addTransaction);

// ------------calculations---------------

function calculator() {
  const totalBudget = budgetTrx.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalSavings = savingTrx.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalMonthlySavings = savingTrx
    .filter((trx) => {
      const date = new Date(trx.trxDate);
      return date.getMonth() === selectedMonth;
    })
    .reduce((acc, trx) => acc + Number(trx.trxAmount), 0);

  const income = userTransactions.filter((trx) => trx.trxType === "Income");
  const expense = userTransactions.filter((trx) => trx.trxType === "Expense");

  const monthlyIncomeTransactions = userTransactions.filter((trx) => {
    const date = new Date(trx.trxDate);
    return trx.trxType === "Income" && date.getMonth() === selectedMonth;
  });

  const totalMonthlyIncome = monthlyIncomeTransactions.reduce(
    (acc, trx) => acc + trx.trxAmount,
    0,
  );

  charts[0].data.datasets[0].data[selectedMonth] = totalMonthlyIncome;
  charts[1].data.datasets[0].data[selectedMonth] = totalMonthlyIncome;

  const totalExpense = expense.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalMonthlyExpense = expense
    .filter((trx) => {
      const date = new Date(trx.trxDate);
      return date.getMonth() === selectedMonth;
    })
    .reduce((acc, trx) => acc + Number(trx.trxAmount), 0);

  charts[0].data.datasets[1].data[selectedMonth] = totalMonthlyExpense;
  charts[1].data.datasets[1].data[selectedMonth] = totalMonthlyExpense;

  const totalIncome = income.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalBalance =
    totalMonthlyIncome - totalMonthlyExpense - totalMonthlySavings;

  chart.data.datasets[0].data[0] = totalMonthlyIncome;
  chart.data.datasets[0].data[1] = totalBalance;

  budgetchart.data.datasets[0].data[0] = totalExpense;
  budgetchart.data.datasets[0].data[1] = totalBalance;

  return {
    totalBudget,
    totalSavings,
    totalMonthlySavings,
    income,
    expense,
    monthlyIncomeTransactions,
    totalMonthlyIncome,
    totalExpense,
    totalMonthlyExpense,
    totalIncome,
    totalBalance,
  };
}

function monthlyTransactionRender(stats) {
  monthlyIncomeBalance.innerText = `${stats.totalMonthlyIncome}`;

  const transactionsContainer = document.querySelector(".finance-transactions");
  transactionsContainer.innerHTML = "";

  stats.monthlyIncomeTransactions.forEach((trx, index) => {
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
        data: [0, 0],
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

  document.querySelector(".budget-amount").value = "";
  document.querySelector(".budget-category").value = "";

  finaceRender();
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
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".add-saving-btn, .savings-cat-container")) {
    savingContainer.classList.remove("active-btn");
  }
});

const savingTrx = JSON.parse(localStorage.getItem("savingTransactions")) || [];

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

  document.querySelector(".saving-amount").value = "";
  document.querySelector(".saving-category").value = "";

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
  const stats = calculator();
  monthlyTransactionRender(stats);
  expenseRender(stats);
  budgetRender();
  budgetChartRender(stats);
  savingsRender();
  dashboardRender();
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
  const nameInput = document.querySelector(".exp-trx-name");
  const amountInput = document.querySelector(".exp-trx-amount");

  const categoryInput = document.querySelector(".expense-category");
  const dateInput = document.querySelector(".exp-trx-date");

  const newTransaction = {
    id: Date.now(),
    trxName: nameInput.value.trim(),
    trxAmount: Number(amountInput.value),
    trxType: "Expense",
    trxCategory: categoryInput.value,
    trxDate: dateInput.value,
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

  finaceRender();
}
function expenseRender(stats) {
  const transactionsContainer = document.querySelector(".recent-expense");
  transactionsContainer.innerHTML = "";

  stats.expense.forEach((trx) => {
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

const addExpense = document.querySelector(".add-expense");
addExpense.addEventListener("click", addExpenseTrx);

const monthlyBudgetBalanceCon = document.querySelector(
  ".monthly-budget-balance",
);
const availableBalanceCon = document.querySelector(".available-balance");
const totalExpenseCon = document.querySelector(".expense-balance");
const savingsbalanceCon = document.querySelector(".savings-balance");

function budgetChartRender(stats) {
  monthlyBudgetBalanceCon.innerText = stats.totalBudget;
  availableBalanceCon.innerText = stats.totalBalance;
  totalExpenseCon.innerText = stats.totalExpense;
  savingsbalanceCon.innerText = stats.totalSavings;

  budgetchart.update();
}

budgetchart.update();
chart.update();

render();
dashboardRender();
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
