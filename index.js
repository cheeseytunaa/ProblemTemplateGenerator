if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
};

function convertToDataTable(table) {
  table.DataTable({
    info: true,
    search: false,
    "iDisplayLength": 50,
    order: [],
    columnDefs: [
      { bSort: false, targets: "no-sort", orderable: false }
    ]
  })
}

function copyToClipboard(text) {
  const listener = function (event) {
    event.preventDefault();
    event.clipboardData.setData("text/plain", text);
  };
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

document.querySelectorAll("table.table-utility.preload").forEach((element) => {
  convertToDataTable(element);
});

document.querySelectorAll(".time-from-now").forEach((element) => {
  element.innerHTML = moment(element.getAttribute("since"), "YYYY-MM-DD HH:mm:ss").fromNow();
});

// document.querySelectorAll("textarea").forEach((element) => {
//   if (element.value) {
//     element.height = element.scrollHeight;
//   };
// })

$("textarea").each(function(textarea) {
  if (this.value) {
      $(this).height($(this)[0].scrollHeight);
  }
});

document.querySelectorAll("table.table:not(.table-utility)").forEach((table) => {
  if (table.querySelectorAll("tbody tr").length == 0) {
      let tableRow = document.createElement("tr");
      let rowData = document.createElement("td");
      rowData.colSpan = table.querySelectorAll("thead tr th").length;
      rowData.innerHTML = "No data available!";
      rowData.className = "text-center";
      tableRow.appendChild(rowData);
      table.querySelector("tbody").appendChild(tableRow);
  }
});

document.querySelectorAll("pre").forEach((element) => {
  if (element.className.includes("uncopyable")) return;

  let div = document.createElement("div");
  div.className = "clipboard-pre unselectable";
  div.innerHTML = `<span class="clipboard-pre-button unselectable" title="Click me to copy">Copy</span>`;
  div.addEventListener("click", () => { copyToClipboard(element.innerText) })
  element.parentElement.insertBefore(div, element);
})

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const navbarActiveStatus = {
  "home": ["^\/$", "^\/base.html$"],
  "problems": ["^\/problems*", "^\/p\/.*"],
  "submissions": ["^\/submissions*", "^\/s\/.*"],
  "users": ["^\/users*", "^\/u\/.*"],
  "contests": ["\/contests*", "^\/c\/.*"],
  "about": ["^\/about$", "^\/flat\/.*"],
  "judges": ["^\/judges$"]
}

$(document).ready(() => {
  $("select.form-control").select2({
    theme: "bootstrap-5"
  });
});

function clearAllIntervals() {
  const intervalMaxID = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
  for (let i = 1; i < intervalMaxID; i++) {
    window.clearInterval(i);
  }
}

let url = window.location.pathname;
for (let class_ in navbarActiveStatus) {
  navbarActiveStatus[class_].forEach((expression) => {
    if (new RegExp(expression).test(url)) {
      document.querySelector(`a#navbar-item-${class_}`).className += " active";
    }
  })
};