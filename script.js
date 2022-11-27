let allFilters = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid");
let plus = document.querySelector(".add");
let delBtn = document.querySelector(".delete");
let body = document.querySelector("body");
let deleteState = false;

let colors = {
  pink: "pink",
  blue: "blue",
  green: "green",
  black: "black",
};

let colorClasses = ["pink", "blue", "green", "black"];

if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

delBtn.addEventListener("click", function (e) {
  if (deleteState) {
    deleteState = false;
    e.currentTarget.classList.remove("delete-state");
  } else {
    deleteState = true;
    e.currentTarget.classList.add("delete-state");
  }
});

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    let color = e.currentTarget.classList[0].split("-")[0];
    grid.style.backgroundColor = colors[color];
  });
}

let modalVisible = false;
plus.addEventListener("click", function () {
  if (!modalVisible) {
    if (delBtn.classList.contains("delete-state")) {
      deleteState = false;
      delBtn.classList.remove("delete-state");
    }
    let modal = document.createElement("div");
    modal.classList.add("modal-container");
    modal.setAttribute("click-first", true);
    modal.innerHTML = ` <div class="text-area" contenteditable>Enter your task</div>
  <div class="color-area">
    <div class="pink-color-modal"></div>
    <div class="blue-color-modal"></div>
    <div class="green-color-modal"></div>
    <div class="black-color-modal active-modal-color"></div>
  </div>`;

    let wa = modal.querySelector(".text-area");
    wa.addEventListener("click", function (e) {
      if (modal.getAttribute("click-first") == "true") {
        wa.innerHTML = "";
        modal.setAttribute("click-first", false);
      }
    });

    wa.addEventListener("keypress", function (e) {
      if (e.key == "Enter") {
        let task = e.currentTarget.innerText;
        let selectedColor = document.querySelector(".active-modal-color");
        let color = selectedColor.classList[0].split("-")[0];
        let colorCode = colors[color];
        let id = generateRandomString(6);
        let ticket = document.createElement("div");
        ticket.classList.add("card");
        ticket.innerHTML = `<div class="card-color ${color}"></div>
        <div class="card-id">${"#" + id}</div>
        <div class="query-container" contenteditable>${task}</div>`;

        saveTicketInLocalStorage(id, color, task);

        let ticketWrittenArea = ticket.querySelector(".query-container");
        ticketWrittenArea.addEventListener("input", ticketWritingAreaHandler);
        ticket.addEventListener("click", function (e) {
          if (deleteState) {
            let id = e.currentTarget
              .querySelector(".card-id")
              .innerText.split("#")[1];

            let taskArr = JSON.parse(localStorage.getItem("tasks"));

            taskArr = taskArr.filter(function (el) {
              return el.id != id;
            });
            localStorage.setItem("tasks", JSON.stringify(taskArr));
            e.currentTarget.remove();
          }
        });

        let ticketColorDiv = ticket.querySelector(".card-color");
        ticketColorDiv.addEventListener("click", ticketColorHandler);

        grid.appendChild(ticket);
        modal.remove();
        modalVisible = false;
      }
    });

    let colorChosen = modal.querySelectorAll(".color-area div");
    for (let i = 0; i < colorChosen.length; i++) {
      colorChosen[i].addEventListener("click", function (e) {
        for (let j = 0; j < colorChosen.length; j++) {
          colorChosen[j].classList.remove("active-modal-color");
        }
        e.currentTarget.classList.add("active-modal-color");
      });
    }

    body.appendChild(modal);
    modalVisible = true;

    // cross.addEventListener("click", function () {
    //   modal.remove();
    //   modalVisible = false;
    // });
  } else {
    return;
  }
});

function generateRandomString(length) {
  let result = "";
  let characters = "abcdefghijklmnopqrstABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < length; i++) {
    result =
      result +
      "" +
      characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function saveTicketInLocalStorage(id, color, task) {
  let requireObj = { id, color, task };
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  taskArr.push(requireObj);
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketColorHandler(e) {
  let currColor = e.currentTarget.classList[1];
  let index = colorClasses.indexOf(currColor);
  index++;
  index = index % 4;
  e.currentTarget.classList.remove(currColor);
  e.currentTarget.classList.add(colorClasses[index]);

  let id = e.currentTarget.parentElement
    .querySelector(".card-id")
    .innerText.split("#")[1];
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  Reqindex = -1;
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id == id) {
      Reqindex = i;
      break;
    }
  }
  taskArr[Reqindex].color = colorClasses[index];
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketWritingAreaHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".card-id")
    .innerText.split("#")[1];
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  index = -1;
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id == id) {
      index = i;
      break;
    }
  }
  taskArr[index].task = e.currentTarget.innerText;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < tasks.length; i++) {
    let id = tasks[i].id;
    let color = tasks[i].color;
    let taskValue = tasks[i].task;

    let ticket = document.createElement("div");
    ticket.classList.add("card");
    ticket.innerHTML = `<div class="card-color ${color}"></div>
  <div class="card-id">${"#" + id}</div>
  <div class="query-container" contenteditable>${taskValue}</div>`;

    let ticketWrittenArea = ticket.querySelector(".query-container");
    ticketWrittenArea.addEventListener("input", ticketWritingAreaHandler);

    let ticketColorDiv = ticket.querySelector(".card-color");
    ticketColorDiv.addEventListener("click", ticketColorHandler);

    ticket.addEventListener("click", function (e) {
      if (deleteState) {
        let id = e.currentTarget
          .querySelector(".card-id")
          .innerText.split("#")[1];

        let taskArr = JSON.parse(localStorage.getItem("tasks"));

        taskArr = taskArr.filter(function (el) {
          return el.id != id;
        });
        localStorage.setItem("tasks", JSON.stringify(taskArr));
        e.currentTarget.remove();
      }
    });

    grid.appendChild(ticket);
  }
}

loadTasks();
