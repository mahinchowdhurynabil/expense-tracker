const greating = document.querySelector(".greating");
const dateEl = document.querySelector(".date");

const userName = document.querySelector(".user-name");
const userProfession = document.querySelector(".user-profession");
const userPhoto = document.querySelector(".user-dp");

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

let userState = {
  name: "Lauren Gliteo",
  profession: "Cyber Expert",
  imgSrc: "./assets/img/user.png",
};

userName.innerText = userState.name;
userProfession.innerText = userState.profession;
userPhoto.src = userState.imgSrc;
const ctx = document.getElementById("myChart");

new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Salary", "Cash in hand", "Last Month Balance"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
          "rgb(22%, 37%, 59%)",
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
        position: "right", // 👈 moves labels to the right
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

const ctxBar = document.getElementById("myBarChart");

new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],

    datasets: [
      {
        label: "Income",
        data: [500, 600, 550, 700, 650],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "Expense",
        data: [300, 400, 350, 450, 420],
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

    scales: {
      x: {
        categoryPercentage: 0.6,
        barPercentage: 0.5,
      },
    },
  },
});
