const menuButtons = document.querySelectorAll(".menu-button");

menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".menu-button i")
      .forEach((icon) => icon.classList.remove("active"));

    btn.querySelector("i").classList.add("active");

    const page = btn.dataset.page;
    console.log(page);
    console.log(btn.dataset);

    document.querySelectorAll("section").forEach((sec) => {
      sec.style.display = "none";
    });

    document.querySelector(`.${page}`).style.display = "grid";
  });
});
