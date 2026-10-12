
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var dateInput = document.querySelector("#calendar-date");
    var timeInput = document.querySelector("#calendar-time");
    var textInput = document.querySelector("#calendar-text");
    var addButton = document.querySelector("#calendar-add-button");
    var listContainer = document.querySelector("#calendar-list");

    if (!addButton || !listContainer) return;

    var STORAGE_KEY = "waldos_mooncalendar_events";

    function getStoredEvents() {
      var saved = localStorage.getItem(STORAGE_KEY);
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }

    function setStoredEvents(events) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }

    function renderEvents() {
      var events = getStoredEvents();
      listContainer.innerHTML = "";

      if (events.length === 0) {
        listContainer.innerHTML = '<p class="calendar-empty-msg">No takeoff dates saved yet.</p>';
        return;
      }

      events.sort(function (a, b) {
        var keyA = (a.date || "") + " " + (a.time || "00:00");
        var keyB = (b.date || "") + " " + (b.time || "00:00");
        return keyA.localeCompare(keyB);
      });

      events.forEach(function (eventItem, index) {
        var card = document.createElement("div");
        card.className = "calendar-item";

        var infoContainer = document.createElement("div");
        infoContainer.className = "calendar-item-info";

        var safeText = eventItem.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        infoContainer.innerHTML = '<strong class="calendar-item-text">' + safeText + '</strong>' +
                                  '<small class="calendar-item-date">📅 ' + (eventItem.date || "No date") + (eventItem.time ? ' ⏰ ' + eventItem.time : '') + '</small>';

        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.className = "calendar-delete-btn";

        deleteBtn.addEventListener("click", function () {
          var currentEvents = getStoredEvents();
          currentEvents.splice(index, 1);
          setStoredEvents(currentEvents);
          renderEvents();
        });

        card.appendChild(infoContainer);
        card.appendChild(deleteBtn);
        listContainer.appendChild(card);
      });
    }

    addButton.addEventListener("click", function () {
      var dateVal = dateInput ? dateInput.value : "";
      var timeVal = timeInput ? timeInput.value : "";
      var textVal = textInput ? textInput.value.trim() : "";

      if (!textVal) {
        alert("Your litle catbaby needs a name! 😸");
        return;
      }

      if (!dateVal) {
        alert("How shall it work without a date, stupid!");
        return;
      }

      var events = getStoredEvents();
      events.push({
        text: textVal,
        date: dateVal,
        time: timeVal
      });

      setStoredEvents(events);

      if (textInput) textInput.value = "";
      if (timeInput) timeInput.value = "";

      renderEvents();
    });

    renderEvents();
  });
})();
