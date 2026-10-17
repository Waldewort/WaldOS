const GOOGLE_YOUTUBE_API_KEY = "AIzaSyBM82FOqegNqyQOIvJgu9-jw5N5cSOkNcs";

const WALDEYE_QUERIES = [
  { id: "stream-1", title: "🌲 Forest Live Cam (Birds and Squirrels)", query: "nature live stream forest wildlife" },
  { id: "stream-2", title: "🐻 Brown Bear Cam", query: "brown bear live stream alaska" },
  { id: "stream-3", title: "🐘 African Wildlife Waterhole", query: "african wildlife waterhole live camera" },
  { id: "stream-4", title: "🦅 Eagle Nest Live Cam", query: "bald eagle nest live stream" },
];

document.addEventListener("DOMContentLoaded", function () {
  initWaldeye();
});

function initWaldeye() {
  const openBtn = document.querySelector("#openwaldeyescreen");
  const closeBtn = document.querySelector("#closewaldeyescreen");
  const windowEl = document.querySelector("#waldeyescreen");
  const iframeEl = document.querySelector("#waldeye-iframe");
  const channelListContainer = document.querySelector("#waldeye-channel-list");

  if (!windowEl || !iframeEl) return;

  if (openBtn) {
    openBtn.addEventListener("click", async () => {
      windowEl.style.display = "flex";
      if (channelListContainer) {
        channelListContainer.innerHTML = `<div style="color: #a3be8c; font-size: 12px; padding: 10px;">Loading live streams via YouTube API...</div>`;
      }
      await fetchAndRenderStreams();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      windowEl.style.display = "none";
      iframeEl.src = "";
    });
  }

  const observer = new MutationObserver(() => {
    if (windowEl.style.display === "none") {
      iframeEl.src = "";
    }
  });
  observer.observe(windowEl, { attributes: true, attributeFilter: ["style"] });
}

async function fetchAndRenderStreams() {
  const channelListContainer = document.querySelector("#waldeye-channel-list");
  if (!channelListContainer) return;
  channelListContainer.innerHTML = "";

  let loadedStreams = [];

  for (const item of WALDEYE_QUERIES) {
    const videoId = await searchLiveVideoId(item.query);
    if (videoId) {
      loadedStreams.push({
        id: item.id,
        title: item.title,
        desc: `Active YouTube live stream for: ${item.title}`,
        videoId: videoId
      });
    }
  }

  if (loadedStreams.length === 0) {
    loadedStreams.push({
      id: "fallback-1",
      title: "🌲 Peaceful Nature Live Stream",
      desc: "Nature live stream (Fallback mode).",
      videoId: "RnCAl0mQgqA"
    });
  }

  loadedStreams.forEach((stream, index) => {
    const btn = document.createElement("button");
    btn.className = `waldeye-btn ${index === 0 ? "active" : ""}`;
    btn.innerText = stream.title;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".waldeye-channel-list .waldeye-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadStreamIntoPlayer(stream);
    });

    channelListContainer.appendChild(btn);
  });

  if (loadedStreams.length > 0) {
    loadStreamIntoPlayer(loadedStreams[0]);
  }
}

async function searchLiveVideoId(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&eventType=live&type=video&key=${GOOGLE_YOUTUBE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (err) {
    return null;
  }
}

function loadStreamIntoPlayer(stream) {
  const iframeEl = document.querySelector("#waldeye-iframe");
  const titleEl = document.querySelector("#waldeye-title");
  const descEl = document.querySelector("#waldeye-desc");

  if (!iframeEl) return;
  iframeEl.src = `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&mute=0`;
  
  if (titleEl) titleEl.innerText = stream.title;
  if (descEl) descEl.innerText = stream.desc;
}