function checkSingleOrPluralCases() {
  const number = document.querySelector("#number-of-cases").value;
  let status = (number == 1) ? true : false;
  var buttons = document.querySelectorAll(".delete-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons.item(i).disabled = status;
  }
}

function setValues(item, value, resetValue = false) {
  item.setAttribute("index", value);
  item.querySelector(".delete-button").innerHTML = `<b>DELETE THIS SAMPLE (${value})</b>`;
  if (resetValue) {
    item.querySelector(".input").value = "";
    item.querySelector(".output").value = "";
    item.querySelector(".explanation").value = "";
  }
  item.querySelector(".input").name = "input-" + value;
  item.querySelector(".output").name = "output-" + value;
  item.querySelector(".explanation").name = "explanation-" + value;
  item.querySelector(".input").id = "input-" + value;
  item.querySelector(".output").id = "output-" + value;
  item.querySelector(".explanation").id = "explanation-" + value;
}

function addSample() {
  document.querySelector("#number-of-cases").value++;
  let number = document.querySelector("#number-of-cases").value;
  const node = document.querySelector(".sample-case-child");
  const clone = node.cloneNode(true);
  setValues(clone, number, true);
  document.querySelector("#sample-cases").appendChild(clone);
  checkSingleOrPluralCases();
}

function removeSample() {
  const elementParent = event.target.closest("button").parentElement.parentElement;
  const testIndex = elementParent.getAttribute("index");
  elementParent.remove();
  document.getElementById("number-of-cases").value--;
  const samples = document.querySelectorAll("[index]");
  for (var i = testIndex; i <= samples.length; i++) {
    setValues(samples.item(i - 1), parseInt(samples.item(i - 1).getAttribute("index")) - 1);
  }
  checkSingleOrPluralCases();
}

function generate() {
  let inputFile = document.querySelector("#input-file").value;
  if (inputFile) {
    inputFile = `: Data taken from \`${inputFile}\``
  }

  let outputFile = document.querySelector("#output-file").value;
  if (outputFile) {
    outputFile = `: Data taken from \`${outputFile}\``
  }

  let constrains = document.querySelector("#constrains").value;
  if (constrains) {
    constrains = `
## Constrains
${document.querySelector("#constrains").value}
`;
  }

  let resultString = `${document.querySelector("#legend").value}

## Input Specification${inputFile}
${document.querySelector("#input-specification").value}

## Output Specification${outputFile}
${document.querySelector("#output-specification").value}
${constrains}
## Sample Cases
`;

  let number = document.querySelector("#number-of-cases").value;
  for (let i = 1; i <= number; i++) {
    resultString += `
### Input #${i}:
${document.querySelector(`#input-${i}`).value}

### Output #${i}:
${document.querySelector(`#output-${i}`).value}
`;

    if (document.querySelector(`#explanation-${i}`).value) {
      resultString += `
### Explanation #${i}:
${document.querySelector(`#explanation-${i}`).value}
`;
    }
  }

  document.querySelector("#renderer").innerHTML = marked.parse(resultString);

  renderMathInElement(document.querySelector("#renderer"), {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "~~", right: "~~", display: true },
      { left: "~", right: "~", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  });

  // resultString = resultString.replace(/(?<!\$)\$(?!\$)/g, "~");
  resultString = resultString.replace(/\$(.*?)\$/g, "~$1~");

  let preElement = document.createElement("pre");
  preElement.innerText = resultString;
  document.querySelector("#result").innerHTML = "";
  document.querySelector("#result").append(preElement);


  document.querySelectorAll("pre").forEach((element) => {
    if (element.className.includes("uncopyable")) return;

    let div = document.createElement("div");
    div.className = "clipboard-pre unselectable";
    div.innerHTML = `<span class="clipboard-pre-button unselectable" title="Click me to copy">Copy</span>`;
    div.addEventListener("click", () => { copyToClipboard(element.innerText) });
    element.parentElement.insertBefore(div, element);
  });
}

$('textarea, input').on('keyup change', () => {
  generate(); 
});

checkSingleOrPluralCases();

function downloadFile() {
  const link = document.createElement("a");
  const filename = document.querySelector("#filename").value;

  const file = new Blob(
    [document.querySelector("#result pre").innerText], 
    {type: "text/plain; charset=utf-8"}
  );

  link.href = URL.createObjectURL(file);
  link.download = filename ? `${filename}.md` : "export.md";

  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}
