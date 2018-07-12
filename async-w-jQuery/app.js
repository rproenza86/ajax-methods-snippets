/* eslint-env jquery */

(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  function addImage(data) {
    let htmlImage = '';
    const firstImage = data.results[0];

    if (data && data.results && data.results.length) {
      htmlImage = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
       </figure> `;
    } else {
      htmlImage = '<div class="error-no-image">No images available</div>';
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlImage);
  }

  function addArticles(data) {
    let htmlContent = '';
    const { response: responseData } = data;
    if (responseData && responseData.docs && responseData.docs.length) {
      htmlContent = `
          <ul>
            ${responseData.docs
              .map(article => {
                return `<li class="article">
                            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                            <p>${article.snippet}</p>
                            </li>`;
              })
              .join('')}
            </ul>
          `;
    } else {
      htmlContent = '<div class="error-no-articles">No articles available</div>';
    }

    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }

  function unsplashRequest() {
    const url = `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`;
    const headers = { Authorization: `Client-ID ${unsplashKey}` };
    $.ajax({ url, headers }).done(addImage);
  }

  function articleRequest() {
    const url = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${newYorkTimeKey}`;
    $.ajax({ url }).done(addArticles);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    unsplashRequest();
    articleRequest();
  });
})();
