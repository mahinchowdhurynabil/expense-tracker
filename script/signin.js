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

const mainContainer = document.querySelector(".main-container");

const settingsFirstName = document.querySelector(".settings-first-name");
const settingsLastName = document.querySelector(".settings-last-name");
const settingsProfession = document.querySelector(".settings-profession");
const settingsBalance = document.querySelector(".settings-balance");
const settingsCurrency = document.querySelector(".settings-currency");
const settingsPhotoInput = document.querySelector(".settings-photo-input");
const saveProfileBtn = document.querySelector(".save-profile");
const logoutBtn = document.querySelector(".logout-btn");

let userState = JSON.parse(localStorage.getItem("userData")) || {
  firstname: "",
  lastname: "",
  profession: "",
  startingBalance: "",
  currency: "",
  imgSrc: "",
};

function getCurrencySymbol(currency = userState.currency) {
  const selectedCurrency = currency || "";
  const match = selectedCurrency.match(/\(([^)]+)\)/);

  if (!match) return selectedCurrency || "$";

  return match[1].split("/")[0].trim();
}

function formatAmount(amount) {
  return `${getCurrencySymbol()}${Number(amount).toLocaleString()}`;
}

function render() {
  if (
    userState &&
    userState.firstname &&
    userState.lastname &&
    userState.profession &&
    userState.currency
  ) {
    mainContainer.style.display = "grid";
    signup.style.display = "none"; //

    if (typeof dashboardRender === "function") {
      dashboardRender();
    }

    userName.innerText = userState.firstname;
    userLastName.innerText = userState.lastname;
    userProfession.innerText = userState.profession;

    userPhotos.forEach((userPhoto) => {
      userPhoto.src = userState.imgSrc;
    });

    fillSettingsForm();
  }
}

function fillSettingsForm() {
  settingsFirstName.value = userState.firstname;
  settingsLastName.value = userState.lastname;
  settingsProfession.value = userState.profession;
  settingsBalance.value = userState.startingBalance;
  settingsCurrency.value = userState.currency;
}

// ==================signUp section============

function inputsHandler(e) {
  const name = e.target.name;

  const value = e.target.value;

  userState[name] = value;

  userState;
}

document.querySelectorAll(".sign-up input").forEach((input) => {
  input.addEventListener("input", inputsHandler);
});

inputPhoto.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    userState.imgSrc = reader.result;
  };

  reader.readAsDataURL(file);
});

settingsPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    userState.imgSrc = reader.result;

    userPhotos.forEach((userPhoto) => {
      userPhoto.src = userState.imgSrc;
    });
  };

  reader.readAsDataURL(file);
});

signIn.addEventListener("click", () => {
  localStorage.setItem("userData", JSON.stringify(userState));

  userState = JSON.parse(localStorage.getItem("userData"));
  render();
});

saveProfileBtn.addEventListener("click", () => {
  userState.firstname = settingsFirstName.value;
  userState.lastname = settingsLastName.value;
  userState.profession = settingsProfession.value;
  userState.startingBalance = settingsBalance.value;
  userState.currency = settingsCurrency.value;

  localStorage.setItem("userData", JSON.stringify(userState));

  render();

  if (typeof finaceRender === "function") {
    finaceRender();
  }

  alert("Profile updated");
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userData");
  location.reload();
});
