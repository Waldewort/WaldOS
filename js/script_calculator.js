(function initWaldCalc() {
  const calcScreen = document.getElementById("calculatorscreen");
  const modeToggleBtn = document.getElementById("toggle-calc-mode");

  if (!calcScreen) return;

  if (typeof dragElement === "function") dragElement(calcScreen);
  if (typeof addwindowtaphandling === "function") addwindowtaphandling(calcScreen);

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", () => {
      calcScreen.classList.toggle("scientific-mode");
      modeToggleBtn.textContent = calcScreen.classList.contains("scientific-mode")
        ? "🔢 Noob-Mode"
        : "🧪 Sci-Mode";
    });
  }

  const displayInput = document.getElementById("calc-input");
  const displayHistory = document.getElementById("calc-history");
  const buttons = calcScreen.querySelectorAll(".calc-btn");

  let currentExpr = "0";
  let resetOnNextInput = false;

  function updateDisplay() {
    displayInput.value = currentExpr;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-value");
      const action = btn.getAttribute("data-action");

      if (action === "clear") {
        currentExpr = "0";
        displayHistory.innerText = "";
      } else if (action === "backspace") {
        if (currentExpr.length > 1) {
          currentExpr = currentExpr.slice(0, -1);
        } else {
          currentExpr = "0";
        }
      } else if (action === "plusminus") {
        if (currentExpr !== "0") {
          currentExpr = currentExpr.startsWith("-") ? currentExpr.substring(1) : "-" + currentExpr;
        }
      } else if (action === "calculate") {
        try {
          displayHistory.innerText = currentExpr + " =";
          let evalExpr = currentExpr.replace(/÷/g, "/").replace(/×/g, "*").replace(/%/g, "/100");
          let result = Function('"use strict"; return (' + evalExpr + ')')();
          currentExpr = String(Number(result.toFixed(8)));
          resetOnNextInput = true;
        } catch (e) {
          displayHistory.innerText = currentExpr;
          currentExpr = "Error";
          resetOnNextInput = true;
        }
      } else if (["sin", "cos", "tan", "sqrt", "log"].includes(action)) {
        try {
          let evalExpr = currentExpr.replace(/÷/g, "/").replace(/×/g, "*");
          let num = Function('"use strict"; return (' + evalExpr + ')')();
          let mathFunc = action === "log" ? "Math.log10" : action === "sqrt" ? "Math.sqrt" : "Math." + action;
          displayHistory.innerText = `${action}(${currentExpr})`;
          let result = Function('"use strict"; return ' + mathFunc + '(' + num + ')')();
          currentExpr = String(Number(result.toFixed(8)));
          resetOnNextInput = true;
        } catch (e) {
          currentExpr = "Error";
          resetOnNextInput = true;
        }
      } else if (action === "pow") {
        currentExpr += "**2";
      } else if (val) {
        if (currentExpr === "0" || resetOnNextInput) {
          currentExpr = (val === ".") ? "0." : val;
          resetOnNextInput = false;
        } else {
          currentExpr += val;
        }
      }

      updateDisplay();
    });
  });
})();
