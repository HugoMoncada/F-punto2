import { COUNTRIES } from "./countries.js";

const form = document.querySelector("form").addEventListener("submit", callAPI);
const select = document.querySelector("select");



// Fill the select
COUNTRIES.forEach( country => {
    let option = document.createElement("option");
    option.textContent = country.name;
    option.value = country.id;
    select.add(option);  
});

