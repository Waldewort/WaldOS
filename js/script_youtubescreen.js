
const API_KEY = "AIzaSyBPTc_wbo3dpmEYEd-g-zNu7vmv8oYLFUQ";

var ytSearchInput = document.querySelector("#yt-search-input");
var ytSearchBtn = document.querySelector("#yt-search-btn");
var ytPlayerContainer = document.querySelector("#yt-player-container");
var ytResultsContainer = document.querySelector("#yt-results-container");
var ytPlayer = document.querySelector("#yt-player");
var ytLogo = document.querySelector("#yt-logo");
var pContainer = ytPlayerContainer || document.querySelector("#yt-player-container");
var pIframe = ytPlayer || document.querySelector("#yt-player");

async function performYtSearch() {
  if (!ytSearchInput) return;
  const query = ytSearchInput.value.trim();
  if (!query) return;

  if (ytLogo) ytLogo.style.display = "none";
  if (pContainer) pContainer.style.display = 'none';
  if (pIframe) {
    pIframe.style.display = 'none';
    pIframe.src = '';
  }

  ytResultsContainer.innerHTML = '<p class="yt-msg-info">Spaceship is diving into the W(ald)wormhole...</p>';

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      ytResultsContainer.innerHTML = `<p class="yt-msg-error">API-Fehler: ${data.error.message}</p>`;
      return;
    }

    if (data.items && data.items.length > 0) {
      ytResultsContainer.innerHTML = '';
      data.items.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const author = item.snippet.channelTitle;
        const thumbnail = item.snippet.thumbnails.medium.url;

        const card = document.createElement('div');
        card.className = 'yt-card';
        card.innerHTML = `
          <img src="${thumbnail}" class="yt-card-thumb">
          <div class="yt-card-info">
            <div class="yt-card-title">${title}</div>
            <div class="yt-card-author">${author}</div>
          </div>
        `;
        
        card.addEventListener('click', () => {
          var activeContainer = document.querySelector("#yt-player-container");
          var activeIframe = document.querySelector("#yt-player");
          var ytApp = document.querySelector(".youtube-app");
          var activeLogo = document.querySelector("#yt-logo");

          if (activeLogo) activeLogo.style.display = "none";

          if (activeContainer && activeIframe) {
            activeContainer.style.display = 'block';
            activeIframe.style.display = 'block';
            activeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            
            if (ytApp) {
              ytApp.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        });
        ytResultsContainer.appendChild(card);
      });
    } else {
      ytResultsContainer.innerHTML = '<p class="yt-msg-error">This part of the W(ald)wormhole is empty.</p>';
    }
  } catch (err) {
    ytResultsContainer.innerHTML = '<p class="yt-msg-error">Your Spaceship has a problem by reaching the W(ald)wormhole.</p>';
  }
}

if (ytSearchBtn && ytSearchInput) {
  ytSearchBtn.addEventListener("click", performYtSearch);
  ytSearchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      performYtSearch();
    }
  });
}