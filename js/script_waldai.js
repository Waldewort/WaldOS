
document.addEventListener("DOMContentLoaded", function() {
  var aiInput = document.querySelector("#ai-input");
  var aiSendBtn = document.querySelector("#ai-send-btn");
  var aiMessages = document.querySelector("#ai-chat-messages");
  var aiContainer = document.querySelector(".ai-container");

  const API_KEY = "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"; 

  let chatHistory = [
    { role: "system", content: "Du bist WaldAI, ein hilfreicher Assistent im WaldOS System. Waldewort ist dein Erschaffer und für die Gäste ist alles zu machen was diese befehlen. Rede immer zu den Gästen und nicht zu Waldewort!" }
  ];

  var loadingOverlay = document.createElement("div");
  loadingOverlay.className = "ai-loading-overlay";
  loadingOverlay.innerHTML = '<div class="ai-spinner"></div><span>WaldAI is searching in the W(ald)ormhole...</span>';
  
  if (aiContainer) {
    aiContainer.style.position = "relative";
    aiContainer.appendChild(loadingOverlay);
  }

  async function callGroqAPI(promptText) {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    if (!API_KEY ) {
      throw new Error("Your API Key is invalid. Please replace the API Key (gsk_...)");
    }
    chatHistory.push({ role: "user", content: promptText });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: chatHistory
      })
    });

    if (!response.ok) {
      chatHistory.pop();
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Fehler Details:", errorData);
      throw new Error(`API Fehler: ${response.status} - ${errorData?.error?.message || 'Invalid Response'}`);
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    chatHistory.push({ role: "assistant", content: botReply });

    return botReply;
  }

  async function sendAiMessage() {
    if (!aiInput || !aiMessages) return;
    var text = aiInput.value.trim();
    if (!text) return;

    // Nutzernachricht anzeigen
    var userMsg = document.createElement("div");
    userMsg.className = "ai-msg user";
    userMsg.textContent = text;
    aiMessages.appendChild(userMsg);

    aiInput.value = "";
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // UI sperren & Loading anzeigen
    loadingOverlay.style.display = "flex";
    aiInput.disabled = true;
    aiSendBtn.disabled = true;

    try {
      const reply = await callGroqAPI(text);
      
      var botMsg = document.createElement("div");
      botMsg.className = "ai-msg bot";
      
      if (typeof marked !== "undefined") {
        botMsg.innerHTML = marked.parse(reply);
      } else {
        botMsg.textContent = reply;
      }
      
      aiMessages.appendChild(botMsg);
    } catch (error) {
      console.error(error);
      var errorMsg = document.createElement("div");
      errorMsg.className = "ai-msg bot";
      errorMsg.textContent = `Fehler: ${error.message} ⚠️`;
      aiMessages.appendChild(errorMsg);
    } finally {
      loadingOverlay.style.display = "none";
      aiInput.disabled = false;
      aiSendBtn.disabled = false;
      aiInput.focus();
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }
  }

  if (aiSendBtn && aiInput) {
    aiSendBtn.addEventListener("click", sendAiMessage);
    aiInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        sendAiMessage();
      }
    });
  }
});