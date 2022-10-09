import { COUNTRIES } from "./countries.js";

const form = document.querySelector("form").addEventListener("submit", callAPI);
const select = document.querySelector("select");
const addAnotherNameBtn = document.getElementById("addAnotherName").addEventListener("click", addAnotherName);
let names = []; 

// Fill the select
COUNTRIES.forEach( country => {
    let option = document.createElement("option");
    option.textContent = country.name;
    option.value = country.id;
    select.add(option);  
});


async function callAPI(e){
    e.preventDefault();
    
    cleanList();

    let name = e.target[0].value; 
    let country = e.target[1].value;
    let onlyNames = []; 
    let namesAndCountries = []; 
    let namesResponse = [];
    let namesAndCountriesResponse = [];
    let errorMessage = document.querySelector(".error");

    errorMessage.textContent = ""; 
    errorMessage.setAttribute("hidden", true);
    
    
    if(validateField(name)){
        errorMessage.textContent = "No puede contener caracteres especiales, números o espacios."
        errorMessage.removeAttribute("hidden");
        return;
    }

    let loading = document.querySelector(".loading"); 
    loading.removeAttribute("hidden");

    // Add the last added name to the array
    names.push({
        name: name.trim(),
        country
    });
  
    for(let person of names){
        if(person.name && person.country != ""){
            namesAndCountries.push(person); 
            continue;
        }
        onlyNames.push(person); 
    }

    if(onlyNames.length > 0){
        namesResponse= await callApiWithNames(onlyNames);
    }

    if(namesAndCountries.length > 0){
        namesAndCountriesResponse = await callApiWithNamesAndCountry(namesAndCountries);
    }

    names = []; 
    names = names.concat(namesResponse);
    names = names.concat(namesAndCountriesResponse);
    
    loading.setAttribute("hidden", true);

    renderResponse(names);
    names = []; 
    e.target[0].value = ""; 
}

function addAnotherName(){
    let nameInput = document.getElementById("name");
    let errorMessage = document.querySelector(".error");
    let success = document.querySelector(".success");
    let select = document.querySelector("select"); 

    success.textContent = "";
    errorMessage.textContent = ""; 
    errorMessage.setAttribute("hidden", true);
    success.setAttribute("hidden", true);
    
    if(nameInput.value === "") {
        errorMessage.textContent = "No puede estar vacio"
        errorMessage.removeAttribute("hidden");
        return;
    }; 
    
    if(validateField(nameInput.value)){
        errorMessage.textContent = "No puede contener caracteres especiales, números o espacios."
        errorMessage.removeAttribute("hidden");
        return;
    }
    
    names.push({
        name: nameInput.value.trim(),
        country: select.value 
    }); 

    success.textContent = "Nombre agregado con exito"
    success.removeAttribute("hidden");

    setTimeout(() => {
        success.setAttribute("hidden", true);
    },1000)

    nameInput.value = ""; 
    select.selectedIndex = 0;
}

async function callApiWithNames(names){
    let url = "https://api.agify.io?"; 

    if(names.length === 1){
        url += `name=${names[0].name}`;
        let response = await (await fetch(url, { method: "GET"})).json();
        return response;
    }   
    
    for (const {name} of names) {
        url += `name[]=${name}&`;
    }

    let response = await (await fetch(url, { method: "GET"})).json();
    return response;
}

async function callApiWithNamesAndCountry(names){
    
    let responseNames = []; 

    let url = "https://api.agify.io?"; 

    if(names.length === 1){
        url += `name=${names[0].name}&country_id=${names[0].country}`;
        let response = await (await fetch(url, {method: "GET"})).json();
        //Get country id replace it with the name of the country
        let {name} = COUNTRIES.find( country => country.id == response.country_id );
        response.country_id = name;
        responseNames.push(response);
        return responseNames;  
    }

    for (const person of names) {
        url += `name=${person.name}&country_id=${person.country}`;
        let response = await(await fetch(url, {method: "GET"})).json();
        //Get country id replace it with the name of the country
        let {name} = COUNTRIES.find( country => country.id == response.country_id );
        response.country_id = name;
        responseNames.push(response);
        url = "https://api.agify.io?";
    }
    
    return responseNames;
}

function renderResponse(response){  
    let ul = document.createElement("ul"); 
    ul.classList.add("names__list");
    document.querySelector(".names").appendChild(ul);
    for(const element of response){
        createListElement(element, ul);
    }
}

function createListElement(element, ul){
    let nameList = ul;
    let li = document.createElement("li"); 
    let nameDiv = document.createElement("div");
    let ageDiv = document.createElement("div");

    let nameSpan = document.createElement("span");
    let ageSpan = document.createElement("span"); 

    let nameSpanValue = document.createElement("span");
    let ageSpanValue = document.createElement("span");

    li.classList.add("names__item");
    nameSpan.classList.add("highlight");
    ageSpan.classList.add("highlight");

    nameSpan.textContent = `Nombre: `;
    ageSpan.textContent = `Edad: `;

    nameSpanValue.textContent = `${element.name}`;
   
    // Sometimes with some countries and names the age value comes null
    ageSpanValue.textContent = element.age === null ? "Desconocida" : element.age ;

    nameDiv.append(nameSpan);
    nameDiv.append(nameSpanValue);

    ageDiv.append(ageSpan);
    ageDiv.append(ageSpanValue);

    if(element.country_id){
        let countryDiv = document.createElement("div");
        let countrySpanValue = document.createElement("span");
        let countrySpan = document.createElement("span"); 
        countrySpan.textContent = "País: "; 
        countrySpan.classList.add("highlight");
        countrySpanValue.textContent = `${element.country_id}`;
        countryDiv.append(countrySpan);
        countryDiv.append(countrySpanValue);
        li.appendChild(countryDiv);
    }
    
    li.appendChild(nameDiv);
    li.appendChild(ageDiv);

    nameList.appendChild(li); 
}

function cleanList(){
    let menu = document.querySelector(".names__list"); 
    if(menu == null){
        return; 
    }
    menu.remove(); 
}

function validateField(name){
    let regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0123456789]/;
    if(regex.test(name.trim())){
        return true;
    }
    return false;
}