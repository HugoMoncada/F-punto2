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
    
    // Add last name to the array
    if(validateField(name)){
        errorMessage.textContent = "No puede contener caracteres especiales"
        errorMessage.removeAttribute("hidden");
        name = ""; 
        return;
    }

    let loading = document.querySelector(".loading"); 
    loading.removeAttribute("hidden");

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
        errorMessage.textContent = "No puede contener caracteres especiales ó números"
        errorMessage.removeAttribute("hidden");
        nameInput.value = ""; 
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



function validateField(name){
    let regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0123456789]/;
    if(regex.test(name.trim())){
        return true;
    }
    return false;
}