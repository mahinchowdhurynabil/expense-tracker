let userState = JSON.parse(localStorage.getItem("userData")) || {
  firstname: "",
  lastname: "",
  profession: "",
  startingBalance: "",
  imgSrc: "",
};

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
