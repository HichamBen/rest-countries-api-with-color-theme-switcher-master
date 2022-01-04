// Assign elements to use when rendering home and detail pages:
const main = document.querySelector("main");
let cards_holder = document.querySelector(".cards-holder"); // These variables (cards_holder and form)...↓
let form = document.getElementById("form");                 // reinitialize when you click back button in detail page.
const listOfResearch = document.createElement("ul"); // Hold suggestions when you are searching.

// Map holds country alphaCode as key with the name of country that refer to it  as value...↓
// This map used when detail page rendered and setted when render_homePage function called.
const alphaCode_borders = new Map();


// Call uploadData function to upload countries cards in home page:
uploadData("https://restcountries.com/v2/all", render_homePage);
uploadData("https://restcountries.com/v2/all", setContinent); // Sort countries by continent.

// Add waiting data icon:
cards_holder.innerHTML = `<div class="download"></div>`

// Make get request to api and handle it with callback function...↓
// (render_homePage(obj) or setContinent(obj) or setDetailPage(obj)):  
function uploadData(url, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this);
        }
    }
    xhttp.open("GET", url);
    xhttp.send();
}

//Renders country cards in home page: 
function render_homePage(xhttp) {

    const res = JSON.parse(xhttp.responseText);

    // Empty cards_holder section when response got:   
    cards_holder.innerHTML = "";

    for (let i = 0; i < res.length; i++) {
        if (alphaCode_borders.size <= 250) {
            alphaCode_borders.set(res[i].alpha3Code, res[i].name);
        }

        // Rendering cards_holder section:   
        cards_holder.innerHTML += `<div class="country-card">
        <img  src="${res[i].flags.png}" alt="${res[i].name}"> 
        <div class="card-details">
            <h2>${res[i].name}</h2>
            <p><span>Population</span>: ${res[i].population}</p>
            <p><span>Region</span>: ${res[i].region}</p>
            <p><span>Capital</span>: ${res[i].capital}</p>
        </div>
     </div>`
    }

   // Add click event to country cards (images and countries names) in home page:
   addClick_toCards();

   // Function handle width input and submit button elements in the form:
   setSuggestion();
}

function addClick_toCards() {
    let cards = document.getElementsByClassName("country-card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", function (event) {
            let hold_CountryName = (event.target.alt) ? event.target.alt : event.target.textContent;
            uploadData(`https://restcountries.com/v2/name/${hold_CountryName}`, setDetailPage);
        });
    }
}


//Renders detail page: 
function setDetailPage(xhttp) {

    // call changePage function to recreate elements in home page to be detail page:
    changePage();

    const res = JSON.parse(xhttp.responseText);

    // Destructuring assignment api response:  
    let { name, capital, nativeName, region, population, subregion,
        topLevelDomain: [domain], currencies: [{ name: nameCurren }],
        languages, flags: { svg }
    } = res[0];

    // Renders detail page:
    document.getElementById("countryName").innerHTML = name;
    document.querySelector("img[alt='flag']").src = svg;
    document.getElementById("col1-countryInfo").innerHTML = `<p><span>Native Name</span>: ${nativeName}</p>
    <p><span>Population</span>: ${population}</p>
    <p><span>Region</span>: ${region}</p>
    <p><span>Sub Region</span>: ${subregion}</p>
    <p><span>Capital</span>: ${capital}</p>`

    document.getElementById("col2-countryInfo").innerHTML = `<p><span>Top Level Domain</span>: ${domain}</p>
    <p><span>Currencies</span>: ${nameCurren}</p>
    <p><span>Languages</span>: ${languages.map(lang => {
        return lang.name;
    })}</p>`

    // Set alphaCode_borders map:
    if (res[0].borders) {
        for (const [alphaCode, countryBorder] of alphaCode_borders) {
            if (res[0].borders.includes(alphaCode)) {
                document.getElementById("borders").innerHTML +=
                    `<button>${countryBorder}</button>`
            }
        }
    }

    //Add event to buttons that hold names of borders countries in detail page:
    document.getElementById("borders").addEventListener("click", function (event) {
        let hold_CountryName = event.target.textContent;
        uploadData(`https://restcountries.com/v2/name/${hold_CountryName}`, setDetailPage);

    });

}

function changePage() {

    // Prepare detail page to render data:
    main.className = "main-detailP";
    main.innerHTML = `<button id="returnBtn_homeP" onclick="returnTo_homeP()" title="Back to the home page"><i class="fal fa-long-arrow-left"></i>&nbsp;&nbsp;&nbsp;Back</button>
    <section class="detailP">
        <img  alt="flag">
        <div class="detailP-countryInfo">
            <h2 id="countryName"></h2>
            <div class="flex-countryInfo">
                <div id="col1-countryInfo">
                
                </div>
                <div id="col2-countryInfo">
                    
                </div>
            </div>
            <div class="border-country">
                <span style="margin-right: 15px;">Border Countries:</span>
                <div id="borders"></div>
            </div>
        </div>
    </section> `

}

// Called when back button in detail page has clicked:
function returnTo_homeP() {

    // Prepare home page to render data:
    main.className = "main-homeP";
    main.innerHTML = `<form action="home.html" method="post" id="form"> 
    <button type="submit"><i class="far fa-search"></i></button>
    <input type="search" name="keyWord" placeholder="Search for a country..." autocomplete="off">
    <select name="filter" onchange="select_Continent(this.value)" >
        <option value="filter">Filter by Region</option>
        <option value="africa">Africa</option>
        <option value="americas">America</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="oceania">Oceania</option>
    </select>
</form>
<section class="cards-holder">
${cards_holder.innerHTML}
</section> `

    addClick_toCards();
    // Reinitialize cards_holder section and form to refer actual elements:
    cards_holder = document.querySelector(".cards-holder");
    form = document.getElementById("form")

    setSuggestion();
}


// Arrays hold countries sorted by continents:
const africa = [];
const americas = [];
const asia = [];
const europe = [];
const oceania = [];
const allCountry = [];

//Assign items to above array:
function setContinent(xhttp) {
    const res = JSON.parse(xhttp.responseText);

    for (let i = 0; i < res.length; i++) {
        let { name, region } = res[i];
        switch (region) {
            case "Africa":
                africa.push(name);
                allCountry.push(name.toLowerCase());
                break;

            case "Americas":
                americas.push(name);
                allCountry.push(name.toLowerCase());
                break;

            case "Asia":
                asia.push(name);
                allCountry.push(name.toLowerCase());
                break;

            case "Europe":
                europe.push(name);
                allCountry.push(name.toLowerCase());
                break;

            case "Oceania":
                oceania.push(name);
                allCountry.push(name.toLowerCase());
                break;
        }
    }
}

// Handle with select element in the form:
function select_Continent(continent) {
    let holdContinent;
    switch (continent) {
        case "africa":
            holdContinent = africa;
            break;
        case "americas":
            holdContinent = americas;
            break;
        case "asia":
            holdContinent = asia;
            break;
        case "europe":
            holdContinent = europe;
            break;
        case "oceania":
            holdContinent = oceania;
            break;
        default:
            cards_holder.innerHTML = `<div class="download"></div>`;
            uploadData("https://restcountries.com/v2/all", render_homePage);
            return;
    }

    // Rendering countries cards by continents in home page:
    holdContinent.forEach(country => {
        cards_holder.innerHTML = "";
        uploadData(`https://restcountries.com/v2/name/${country}`, function (data) {

            const res = JSON.parse(data.responseText);
            let { name, capital, region, population, flags: { png } } = res[0];

            cards_holder.innerHTML += `<div class="country-card">
                <img  src="${png}" alt="${name}"> 
                <div class="card-details">
                    <h2>${name}</h2>
                    <p><span>Population</span>: ${population}</p>
                    <p><span>Region</span>: ${region}</p>
                    <p><span>Capital</span>: ${capital}</p>
                </div>
             </div>`
        });

    });

    // Add click event to country cards (images and countries names) in home page:
    let newcards = document.querySelector(".cards-holder");
    newcards.addEventListener("click", function (event) {
        let hold_CountryName = (event.target.alt) ? event.target.alt : event.target.textContent;
        uploadData(`https://restcountries.com/v2/name/${hold_CountryName}`, setDetailPage);
    });
}


function setSuggestion() {

    // Handle form after search button clicked:
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let searchWord = form.elements["keyWord"].value;
        for (let i = 0; i < allCountry.length; i++) {
            if (searchWord === allCountry[i]) {
                uploadData(`https://restcountries.com/v2/name/${searchWord}`, setDetailPage);
                return;
            }
        }
    });


    // Add suggestions when searching for country:
    form.elements["keyWord"].addEventListener("input", function (event) {
        let inputText = form.elements["keyWord"].value.toLowerCase();
        let length_OfInputText = inputText.length;

        if (length_OfInputText >= 0) {
            listOfResearch.innerHTML = "";
        }
        allCountry.forEach(country => {
            if (inputText === country.slice(0, length_OfInputText)) {
                listOfResearch.innerHTML += `<li id="search">${country}</li>`
                form.insertBefore(listOfResearch, form.elements["keyWord"]);
            }
        });

        if (inputText === "") {
            listOfResearch.innerHTML = "";
        }

        // Make suggestions able to click and focus on:
        for (let i = 0; i < listOfResearch.childNodes.length; i++) {
            listOfResearch.childNodes[i].setAttribute('tabindex', '-1');
            listOfResearch.childNodes[i].addEventListener("click", function (event) {
                let suggestion = event.target.textContent;
                uploadData(`https://restcountries.com/v2/name/${suggestion}`, setDetailPage);
            });
        }
    });

    let currentFocus = -1;
    // Move between the suggestions:  
    if (listOfResearch.childNodes !== 0) {
        document.addEventListener("keydown", function (e) {
            switch (e.key) {
                case "ArrowDown":
                    if (currentFocus < listOfResearch.childNodes.length - 1) {
                        currentFocus++;
                        listOfResearch.childNodes[currentFocus].focus();
                        form.elements["keyWord"].value = listOfResearch.childNodes[currentFocus].textContent;
                    }
                    break;
                case "ArrowUp":
                    if (currentFocus > 0) {
                        currentFocus--;
                        listOfResearch.childNodes[currentFocus].focus();
                        form.elements["keyWord"].value = listOfResearch.childNodes[currentFocus].textContent;
                    }
                    break;
                case "Enter":
                    uploadData(`https://restcountries.com/v2/name/${form.elements["keyWord"].value}`, setDetailPage);
                    break;
                default:
                    return;
            }
        });
    }

    // Hide or show the suggestions according to location of click in HTML document:
    document.addEventListener("click", function (event) {
        if (event.target != form.elements["keyWord"]) {
            listOfResearch.style.visibility = "hidden";
            window.removeEventListener("keydown", noScroll);
        } else {
            listOfResearch.style.visibility = "visible";
            window.addEventListener("keydown", noScroll)
        }
    });
}

// When you move between suggestions using arrow keyboard don't scroll: 
function noScroll(e) {
    if ([38, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}