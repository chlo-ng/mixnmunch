const nouns = [
  'light',
  'romantic',
  'heavenly',
  'nutritious',
  'succulent',
  'delectable',
  'rustic',
  'unique',
  'refreshing',
  'appetizing',
  'satisfying',
  'irresistable',
  'sombre',
  'chaotic',
  'unpleasant'
]

const events = [
  'date night',
  'business meeting',
  'dinner',
  'lunch',
  'breakfast',
  'teatime',
  'snack',
  'picnic',
  'meal',
  'thanksgiving dinner',
  'breakup dinner',
  'post-breakup meal',
]

const people = [
  'coworker',
  'boss',
  'wife',
  'husband',
  'girlfriend',
  'alone',
  'best friend',
  'arch nemesis',
  'lover',
  'mistress',
  'situationship',
  'friend',
  'classmate',
  'neighbor',
  'professor',
  'secret link'
]

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }
  
  // Make the actual CORS request.
  function lookUpRecipe(apiId, apiKey, diet, category) {
    var health = diet == 'random' ? '' : `&health=${diet}`
    const url = `https://api.edamam.com/search?q=&app_id=${apiId}&app_key=${apiKey}${health}&dishType=${category}`;

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return Promise.reject('CORS not supported');
    }

    return new Promise((resolve, reject) => {
        // Response handlers.
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var jsonResponse = JSON.parse(xhr.responseText);

                // Now you can work with the jsonResponse object
                // For example, you can access jsonResponse.hits to get recipe hits

                resolve(jsonResponse.hits.map(hit => hit.recipe));
            } else {
                // Handle errors here
                console.error('Request failed with status:', xhr.status);
                reject(`Request failed with status: ${xhr.status}`);
            }
        };
    
  
        xhr.onerror = function() {
        alert('There was an error making the request.');
        };
        
        recipe = document.getElementById('recipe-container')
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(recipe);
    }); 
  }

// Make requests for appetizer, entree, and dessert categories
function getThreeCategoriesRecipes(apiId, apiKey) {
    const dietType= document.getElementById('dietType').value;

    var appetizerContainer = document.getElementById('starter-container')
    var mainContainer = document.getElementById('main-course-container')
    var dessertContainer = document.getElementById('dessert-container')

    appetizerContainer.innerHTML = '<h3> starter </h3>';
    mainContainer.innerHTML = '<h3> main course </h3>';
    dessertContainer.innerHTML = '<h3> dessert </h3>';

    let recipe1 = document.createElement('div')
    let recipe2 = document.createElement('div')
    let recipe3 = document.createElement('div')

    const categories = ['starter', 'main course', 'desserts', 'soup', 'salad', 
    'drinks', 'preserve', 'preps', 'biscuits and cookies', 'bread', 'side dish']

    var eventContainer = document.getElementById('event-container')
    eventContainer.innerHTML = ''
    var event = document.createElement('div')

    Promise.all([
        lookUpRecipe(apiId, apiKey, dietType, categories[Math.floor(Math.random() * categories.length)]),
        lookUpRecipe(apiId, apiKey, dietType, categories[Math.floor(Math.random() * categories.length)]),
        lookUpRecipe(apiId, apiKey, dietType, categories[Math.floor(Math.random() * categories.length)])
    ])
    .then(recipesByCategory => {

        var appetizer = recipesByCategory[0][Math.floor(Math.random() * recipesByCategory[0].length)]
        var entree = recipesByCategory[1][Math.floor(Math.random() * recipesByCategory[1].length)]
        var dessert = recipesByCategory[2][Math.floor(Math.random() * recipesByCategory[2].length)]

        recipe1.innerHTML = `
                            ${appetizer.url ? `<a href=${appetizer.url}><img src=${appetizer.image}></a>
                            <h4> ${appetizer.label} </h4>` : ''}`     
        
        recipe2.innerHTML = `
                            ${entree.url ? `<a href=${entree.url}><img src=${entree.image}></a>
                            <h4> ${entree.label} </h4>` : ''}`
        
        recipe3.innerHTML = `
                            ${dessert.url ? `<a href=${dessert.url}><img src=${dessert.image}></a>
                            <h4> ${dessert.label} </h4>` : ''}`

        appetizerContainer.appendChild(recipe1)
        mainContainer.appendChild(recipe2)
        dessertContainer.appendChild(recipe3)

        event.innerHTML = `<p> <i> a <u>${nouns[Math.floor(Math.random() * nouns.length)]}</u> 
                            <u> ${events[Math.floor(Math.random() * events.length)]}</u> with your 
                            <u> ${people[Math.floor(Math.random() * people.length)]}</u></i></p>`
        eventContainer.appendChild(event)
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}