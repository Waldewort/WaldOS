document.addEventListener("DOMContentLoaded", function () {

  const inputArea = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-todo-btn");
  const listContainer = document.getElementById("todo-list-container");

  let todos = JSON.parse(localStorage.getItem("waldos_todos")) || [];

  // FIX 1: Explicit focus on click & prevent OS drag interference
  if (inputArea) {
    inputArea.style.pointerEvents = "auto"; // Stellt sicher, dass Klicks ankommen
    inputArea.addEventListener("click", function (e) {
      e.stopPropagation(); // Verhindert, dass Drag-Skripte des Fensters das Event verschlucken
      this.focus();
    });
  }

  function addTodo() {
    if (!inputArea) return;
    const text = inputArea.value.trim();
    if (!text) return;

    const now = new Date();

    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      dateStr: now.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }),
      timeStr: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      timestamp: now.getTime()
    };

    todos.unshift(newTodo);
    saveAndRender();
    inputArea.value = "";
    inputArea.focus(); // Belässt den Cursor direkt im Eingabefeld
  }

  if (addBtn) addBtn.addEventListener("click", addTodo);

  // Taste Enter (ohne Shift) zum Absenden nutzen
  if (inputArea) {
    inputArea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addTodo();
      }
    });
  }

  window.toggleTodo = function (id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
  };

  window.deleteTodo = function (e, id) {
    e.stopPropagation();
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
  };

  function saveAndRender() {
    localStorage.setItem("waldos_todos", JSON.stringify(todos));
    renderTodos();
  }

  function renderTodos() {
    if (!listContainer) return;
    listContainer.innerHTML = "";

    if (todos.length === 0) {
      listContainer.innerHTML = `<div style="text-align: center; color: rgba(255,255,255,0.4); margin-top: 40px;">Keine Zettel vorhanden.</div>`;
      return;
    }

    const groups = {};
    todos.forEach(todo => {
      if (!groups[todo.dateStr]) {
        groups[todo.dateStr] = [];
      }
      groups[todo.dateStr].push(todo);
    });

    Object.keys(groups).forEach(date => {
      const groupEl = document.createElement("div");
      groupEl.className = "todo-date-group";

      const header = document.createElement("h3");
      header.className = "todo-date-header";
      header.textContent = date;
      groupEl.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "todo-notes-grid";

      groups[date].forEach(todo => {
        const note = document.createElement("div");
        note.className = `todo-note ${todo.completed ? "completed" : ""}`;
        note.onclick = () => toggleTodo(todo.id);

        note.innerHTML = `
          <div class="todo-note-header">
            <span>🕒 ${todo.timeStr}</span>
            <button class="todo-delete-btn" onclick="deleteTodo(event, ${todo.id})">✕</button>
          </div>
          <div class="todo-text">${escapeHtml(todo.text)}</div>
        `;

        grid.appendChild(note);
      });

      groupEl.appendChild(grid);
      listContainer.appendChild(groupEl);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }
  renderTodos();
});