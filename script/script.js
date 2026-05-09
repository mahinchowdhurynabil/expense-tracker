const greating = document.querySelector(".greating");
const dateEl = document.querySelector(".date");

const selectMonths = document.querySelector(".select-month");
const monthDropdown = document.querySelector(".month-dropdown");

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

const shortMonths = months.map((month) => month.slice(0, 3));
const recentChartMonthCount = 6;

function groupTransactionsByMonth(transactions) {
  return transactions.reduce((monthlyTransactions, trx) => {
    const date = new Date(trx.trxDate);
    const monthName = months[date.getMonth()];

    if (!monthName) return monthlyTransactions;

    if (!monthlyTransactions[monthName]) {
      monthlyTransactions[monthName] = [];
    }

    monthlyTransactions[monthName].push(trx);
    return monthlyTransactions;
  }, {});
}

function getMonthlyTotals(transactions) {
  return months.map((month, index) => {
    return transactions
      .filter((trx) => new Date(trx.trxDate).getMonth() === index)
      .reduce((acc, trx) => acc + Number(trx.trxAmount), 0);
  });
}

function getRecentMonthIndexes(
  monthCount = recentChartMonthCount,
  baseMonth = currentMonth,
) {
  return Array.from({ length: monthCount }, (_, index) => {
    return (baseMonth - monthCount + 1 + index + months.length) % months.length;
  });
}

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

  const labels =
    index === 0
      ? getRecentMonthIndexes().map((monthIndex) => shortMonths[monthIndex])
      : shortMonths;
  const dataLength = labels.length;

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Income", data: Array(dataLength).fill(0) },
        { label: "Expense", data: Array(dataLength).fill(0) },
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
    trxAmount.innerText = formatAmount(trx.trxAmount);

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

function renderStaticCurrencyAmounts() {
  const staticAmountElements = document.querySelectorAll(
    ".amount span, .savings-amount, .savings-target",
  );

  staticAmountElements.forEach((amountEl) => {
    if (!amountEl.dataset.amount) {
      amountEl.dataset.amount = amountEl.innerText.replace(/[^0-9.-]/g, "");
    }

    amountEl.innerText = formatAmount(amountEl.dataset.amount);
  });
}

function dashboardRender() {
  recentTransactions();
  renderStaticCurrencyAmounts();
  chart.update();
  charts.forEach((chartItem) => chartItem.update());
}

// ==================Finance Section===============

const addTrxBtn = document.querySelector(".add-trx-btn");
const btnContent = document.querySelector(".trx-btn-content");
const monthlyIncomeBalance = document.querySelector(".monthly-income-amount");

function closeAllPopupForms() {
  document.querySelectorAll(".trx-btn-content.active-btn").forEach((form) => {
    form.classList.remove("active-btn");
  });

  document.body.classList.remove("popup-open");
}

function openPopupForm(form) {
  if (!form) return;

  closeAllPopupForms();
  document.body.appendChild(form);
  form.classList.add("active-btn");
  document.body.classList.add("popup-open");
}

function togglePopupForm(form) {
  if (!form) return;

  if (form.classList.contains("active-btn")) {
    closeAllPopupForms();
  } else {
    openPopupForm(form);
  }
}

addTrxBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePopupForm(btnContent);
});

document.querySelectorAll(".form-close").forEach((closeButton) => {
  closeButton.addEventListener("click", closeAllPopupForms);
});

window.addEventListener("click", (e) => {
  if (
    !e.target.closest(
      ".trx-btn-content, .add-trx-btn, .add-budget-btn, .add-saving-btn, .exp-trx-btn",
    )
  ) {
    closeAllPopupForms();
  }
});

const today = new Date();

const formattedDate = today.toISOString().split("T")[0];

document.querySelectorAll(".trx-date").forEach((dateInput) => {
  dateInput.value = formattedDate;
});

function addTransaction() {
  const amountInput = document.querySelector(".trx-amount");

  const categoryInput = document.querySelector(".income-trx-category");
  const dateInput = document.querySelector(".trx-date");

  const newTransaction = {
    id: Date.now(),
    trxAmount: Number(amountInput.value),
    trxType: "Income",
    trxCategory: categoryInput.value,
    trxDate: dateInput.value,
  };
  userTransactions.push(newTransaction);

  localStorage.setItem("transactions", JSON.stringify(userTransactions));

  amountInput.value = "";
  categoryInput.value = "Salary";
  dateInput.value = formattedDate;

  finaceRender();
  closeAllPopupForms();
}

const addIncomebtn = document.querySelector(".add-income");
addIncomebtn.addEventListener("click", addTransaction);

// ------------calculations---------------

function calculator() {
  const startingBalanceAmount =
    Number(String(userState.startingBalance).replace(/[^0-9.-]/g, "")) || 0;

  const totalBudget = budgetTrx.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalMonthlyBudget = budgetTrx
    .filter((trx) => {
      const date = new Date(trx.trxDate || formattedDate);
      return date.getMonth() === selectedMonth;
    })
    .reduce((acc, trx) => acc + Number(trx.trxAmount), 0);

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

  const monthlyIncomeTransactions = groupTransactionsByMonth(income);
  const selectedMonthName = months[selectedMonth];
  const selectedMonthlyIncomeTransactions =
    monthlyIncomeTransactions[selectedMonthName] || [];
  const monthlyIncomeTotals = getMonthlyTotals(income);
  const monthlyExpenseTotals = getMonthlyTotals(expense);
  const monthlySavingsTotals = getMonthlyTotals(savingTrx);
  const lastMonthIndex = (selectedMonth - 1 + months.length) % months.length;
  const lastMonthBalance =
    monthlyIncomeTotals[lastMonthIndex] -
    monthlyExpenseTotals[lastMonthIndex] -
    monthlySavingsTotals[lastMonthIndex];
  const recentMonthIndexes = getRecentMonthIndexes();
  const recentMonthLabels = recentMonthIndexes.map(
    (monthIndex) => shortMonths[monthIndex],
  );
  const recentIncomeTotals = recentMonthIndexes.map(
    (monthIndex) => monthlyIncomeTotals[monthIndex],
  );
  const recentExpenseTotals = recentMonthIndexes.map(
    (monthIndex) => monthlyExpenseTotals[monthIndex],
  );

  const totalMonthlyIncome = selectedMonthlyIncomeTransactions.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  if (charts[0]) {
    charts[0].data.labels = recentMonthLabels;
    charts[0].data.datasets[0].data = recentIncomeTotals;
    charts[0].data.datasets[1].data = recentExpenseTotals;
  }

  if (charts[1]) {
    charts[1].data.labels = shortMonths;
    charts[1].data.datasets[0].data = monthlyIncomeTotals;
    charts[1].data.datasets[1].data = monthlyExpenseTotals;
  }

  const totalExpense = expense.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalMonthlyExpense = monthlyExpenseTotals[selectedMonth];

  const totalIncome = income.reduce(
    (acc, trx) => acc + Number(trx.trxAmount),
    0,
  );

  const totalBalance =
    startingBalanceAmount + totalIncome - totalExpense - totalSavings;

  chart.data.datasets[0].data[0] = totalMonthlyIncome;
  chart.data.datasets[0].data[1] = totalBalance;
  chart.data.datasets[0].data[2] = lastMonthBalance;

  budgetchart.data.datasets[0].data[0] = totalExpense;
  budgetchart.data.datasets[0].data[1] = totalBalance;

  return {
    totalBudget,
    totalMonthlyBudget,
    totalSavings,
    totalMonthlySavings,
    income,
    expense,
    monthlyIncomeTransactions,
    selectedMonthlyIncomeTransactions,
    monthlyIncomeTotals,
    monthlyExpenseTotals,
    monthlySavingsTotals,
    lastMonthBalance,
    totalMonthlyIncome,
    totalExpense,
    totalMonthlyExpense,
    totalIncome,
    startingBalanceAmount,
    totalBalance,
  };
}

function monthlyTransactionRender(stats) {
  monthlyIncomeBalance.innerText = formatAmount(stats.totalMonthlyIncome);

  const transactionsContainer = document.querySelector(".finance-transactions");
  transactionsContainer.innerHTML = "";

  stats.selectedMonthlyIncomeTransactions.forEach((trx, index) => {
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
    trxAmount.innerText = formatAmount(trx.trxAmount);

    const editBtn = document.createElement("div");
    editBtn.classList.add("icon");
    editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

    transaction.append(trxSerial, trxIcon, trxInfo);

    transactionItem.appendChild(transaction);
    transactionItem.append(trxAmount, editBtn);
    transactionsContainer.appendChild(transactionItem);
  });
}

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
  togglePopupForm(budgetContent);
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
    trxDate: formattedDate,
  };

  budgetTrx.push(newBudgetTrx);
  localStorage.setItem("budgetTransactions", JSON.stringify(budgetTrx));

  document.querySelector(".budget-amount").value = "";
  document.querySelector(".budget-category").value = "";

  finaceRender();
  closeAllPopupForms();
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
    catAmount.innerText = formatAmount(budgetTrx.trxAmount);

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
  togglePopupForm(savingContainer);
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
  document.querySelector(".saving-category").value = "Emergency";

  finaceRender();
  closeAllPopupForms();
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
      trxAmount.innerText = formatAmount(savingTrx.trxAmount);

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
  togglePopupForm(expBtnContent);
});

document.querySelector(".exp-trx-date").value = formattedDate;

function addExpenseTrx() {
  const amountInput = document.querySelector(".exp-trx-amount");

  const categoryInput = document.querySelector(".expense-category");
  const dateInput = document.querySelector(".exp-trx-date");

  const newTransaction = {
    id: Date.now(),
    trxAmount: Number(amountInput.value),
    trxType: "Expense",
    trxCategory: categoryInput.value,
    trxDate: dateInput.value,
  };
  userTransactions.push(newTransaction);

  localStorage.setItem("transactions", JSON.stringify(userTransactions));

  amountInput.value = "";
  categoryInput.value = "Salary";
  dateInput.value = formattedDate;

  finaceRender();
  closeAllPopupForms();
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
    catAmount.innerText = formatAmount(trx.trxAmount);

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
  monthlyBudgetBalanceCon.innerText = formatAmount(stats.totalMonthlyBudget);
  availableBalanceCon.innerText = formatAmount(stats.totalBalance);
  totalExpenseCon.innerText = formatAmount(stats.totalExpense);
  savingsbalanceCon.innerText = formatAmount(stats.totalSavings);

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
