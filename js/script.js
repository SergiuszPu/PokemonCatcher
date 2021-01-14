'use strict'

const startButton = document.getElementById('start-button');
const nameInput = document.getElementById('player-name');
const gameTitle = document.getElementById('game-title');
const pokeCardsContainer = document.getElementById('pokeCardsContainer');
const choiseCardButton = document.getElementById('catch-button');
const winContainer = document.getElementById('choiseCardContainer');

const table = [];

const pokemonObject = {
    pokemonName: '',
    url: '',
    stats: []
}

const choise = {
    win: [],
    lose: [],
}

/* Show page */
function showPage(id) {
    document.getElementById(id).classList.remove('hide');
}

/* Hide page */
function hidePage(id) {
    document.getElementById(id).classList.add('hide');
}

/* Check if the input is not empty and release the button */
function disabledButton() {
    startButton.disabled = true;
    if (nameInput.value.length > 0) {
        startButton.disabled = false;
    }
}

document.querySelector('#player-name').addEventListener('change', disabledButton)

/* Set the header of the card page */
function setView() {
    hidePage('player-wrapper');
    showPage('game-wrapper');
    const nickname = nameInput.value;
    const inputTitle = document.getElementById('game-title');
    inputTitle.innerHTML = `Hello, ${nickname} that's kind of pokemon you can catch`;

    showCardPokemon()
}

startButton.addEventListener('click', setView);

/* gets a cart group selected based on the nickname */
const showCardPokemon = async () => {
    const offset = nameInput.value.length * 10;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=5&offset=${offset}`
    const res = await fetch(url);
    const data = await res.json();

    for (let i in data.results) {
        showSinglePockemon(data.results[i])
    }
}

/* get single card with group of all pokemon cards */
const showSinglePockemon = async (pokemon) => {
    const url = pokemon.url
    const res = await fetch(url)
    const data = await res.json()
    table.push(data)
    checkName(data)
}

/* check name and change to uppercase and hyphens replaced with spaces */
const checkName = (data) => {
    let goodName = ''
    if (data.name.includes('-')) {
        goodName = data.name.replace('-', ' ')
    } else {
        goodName = data.name.toUpperCase()
    }
    createPokemonCard(goodName, data)
}

/* create single pokemon card with name and image*/
const createPokemonCard = (goodName, data) => {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
    const pokeInnerHTML = `
    <div class="img-container">
        <img class="img" src="${data.sprites.other['official-artwork'].front_default}">
        <h2>${goodName}</h2>
    </div>
    `
    pokemonEl.innerHTML = pokeInnerHTML;
    pokeCardsContainer.appendChild(pokemonEl);
}

/* Match card function */
function choiseCard() {
    const test = Math.floor(Math.random() * 4)
    choise.win.push(table[test]);
    showWinCard()
    winPokemonObject()
}

choiseCardButton.addEventListener('click', choiseCard);

/* Shows the card that won the draw */
function showWinCard() {
    hidePage('game-wrapper');
    showPage('choise-wrapper');

    const winEl = document.createElement('div');
    winEl.classList.add('pokemon');

    const pokeInnerHTML = `
    <div class="img-result">
    <img class="img" src="${choise.win[0].sprites.other['official-artwork'].front_default}">
    <h2>${choise.win[0].name.toUpperCase()}</h2>
    <h3>"${nameInput.value}"</h3>
    <div>
    `
    winEl.innerHTML = pokeInnerHTML;
    winContainer.appendChild(winEl);
}

/* Send to the console win card object with Name, Url and Stats */
function winPokemonObject() {
    pokemonObject.pokemonName = choise.win[0].name
    pokemonObject.url = choise.win[0].sprites.other['official-artwork'].front_default;
    for (let object of choise.win) {
        for (let ob in object.stats) {
            pokemonObject.stats.push({ name: object.stats[ob].stat.name, value: object.stats[ob].base_stat })
        }
    }
    console.log(pokemonObject);
}
