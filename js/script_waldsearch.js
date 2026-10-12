
var searchInputSearchapp = document.querySelector("#waldos-search-input");
var searchBtnSearchapp = document.querySelector("#waldos-search-btn");
var resultsContainerSearchapp = document.querySelector("#search-results-container");

function runWaldosSearch() {
  var query = searchInputSearchapp.value.trim();
  if (!query) return;

  resultsContainerSearchapp.innerHTML = '<p class="search-msg-info">Diving into the W(ald)wormhole...</p>';

  var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" 
               + encodeURIComponent(query) 
               + "&format=json&origin=*";

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      resultsContainerSearchapp.innerHTML = "";
      var results = data.query.search;

      if (results.length === 0) {
        resultsContainerSearchapp.innerHTML = '<p class="search-msg-error">The W(ald)wormhole is empty.</p>';
        return;
      }

      results.forEach(function(item) {
        var card = document.createElement("div");
        card.className = "search-card";

        var title = document.createElement("h3");
        title.className = "search-card-title";
        
        var link = document.createElement("a");
        link.href = "#";
        link.className = "search-card-link";
        link.textContent = item.title;

        link.addEventListener("click", function(e) {
          e.preventDefault();
          
          var wikiIframe = document.querySelector("#wikipediaframe");
          var wikipediascreen = document.querySelector("#wikipediascreen");

          if (wikiIframe && wikipediascreen) {
            wikiIframe.src = "https://en.m.wikipedia.org/wiki/" + encodeURIComponent(item.title);
            openwindow(wikipediascreen);
          }
        });

        title.appendChild(link);

        var snippet = document.createElement("p");
        snippet.className = "search-card-snippet";
        snippet.innerHTML = item.snippet + "...";

        card.appendChild(title);
        card.appendChild(snippet);
        resultsContainerSearchapp.appendChild(card);
      });
    })
    .catch(function(error) {
      resultsContainerSearchapp.innerHTML = '<p class="search-msg-error">No Results!</p>';
    });
}

if (searchBtnSearchapp && searchInputSearchapp && resultsContainerSearchapp) {
  searchBtnSearchapp.addEventListener("click", runWaldosSearch);
  
  searchInputSearchapp.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      runWaldosSearch();
    }
  });
}
