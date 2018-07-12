// @ts-check
(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  /**
   * Function wrapper to construct and execute XML async request
   *
   * @param {*} header ready to accept one header
   * @param {*} callBackHandler
   * @param {*} url
   * @param {*} method
   */
  function ajaxRequest(
    header = { name: '', value: '' },
    callBackHandler = () => {},
    url = '',
    method = 'GET'
  ) {
    const request = new XMLHttpRequest();
    request.open(method, url);
    if (header.name && header.value) {
      request.setRequestHeader(header.name, header.value);
    }
    request.onload = callBackHandler;
    request.send();
  }

  function addImage() {
    let htmlImage = '';
    const data = JSON.parse(this.responseText);
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

  function addArticles() {
    let htmlContent = '';
    const responseData = JSON.parse(this.responseText).response;
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
    const header = { name: 'Authorization', value: `Client-ID ${unsplashKey}` };
    ajaxRequest(header, addImage, url);
  }

  function articleRequest() {
    const url = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${newYorkTimeKey}`;
    const header = { name: '', value: '' };
    ajaxRequest(header, addArticles, url);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    unsplashRequest();
    articleRequest();
  });
})();
