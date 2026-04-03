const greating = document.querySelector(".greating");
const dateEl = document.querySelector(".date");

const userName = document.querySelector(".user-name");
const userProfession = document.querySelector(".user-profession");
const userPhotos = document.querySelectorAll(".user-dp");

const firstName = document.querySelector(".first-name");
const lastName = document.querySelector(".last-name");
const profession = document.querySelector(".profession");
const startingBalance = document.querySelector(".balance");
const inputPhoto = document.querySelector(".upload-photo");
const signup = document.querySelector(".sign-up");
const signIn = document.querySelector(".sign-in");

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
// -------- budget Chart --------

const budgetChart = document.querySelector(".budget-chart");

const budgetDchart = new Chart(budgetChart, {
  type: "doughnut",
  data: {
    labels: ["Expense", "Available"],
    datasets: [
      {
        label: "Balance",
        data: [300, 50],
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

window.addEventListener("resize", () => {
  chart.options.plugins.legend.position = getLegendPosition();
  chart.update();
});

// ==================Finance Section===============

const addTrxBtn = document.querySelector(".trx-btn");
const btnContent = document.querySelector(".trx-btn-content");

addTrxBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  btnContent.classList.toggle("active-btn");
});

window.addEventListener("click", (e) => {
  if (!btnContent.contains(e.target) && !addTrxBtn.contains(e.target)) {
    btnContent.classList.remove("active-btn");
  }
});

let userTransactions = [];

userTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

const today = new Date();
const formattedDate = today.toISOString().split("T")[0];

document.querySelector(".trx-date").value = formattedDate;

function addTransaction() {
  const newTransaction = {
    id: Date.now(),
    trxName: document.querySelector(".trx-name").value,
    trxAmount: document.querySelector(".trx-amount").value,
    trxType: "Income",
    trxcategory: document.querySelector("option:checked").value,
    trxDate: document.querySelector(".trx-date").value,
  };

  userTransactions.push(newTransaction);

  console.log(newTransaction);
  console.log(userTransactions);

  userTransactions = localStorage.setItem(
    "transactions",
    JSON.stringify(userTransactions) || [],
  );
}

console.log(userTransactions);

const addIncomebtn = document.querySelector(".add-income");

addIncomebtn.addEventListener("click", addTransaction);
