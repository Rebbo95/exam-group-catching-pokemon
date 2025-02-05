const log = (msg) => console.log(msg);

/* const gameMusic = document.querySelector("#gameMusic"); */
const startForm = document.querySelector("#form");
const gameField = document.querySelector("#gameField");
const gameMusic = document.querySelector("audio");

// fisher yates för att slumpa våra pokemons
const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        array.push(array[randomIndex]);
        array.splice(randomIndex, 1);
    }
    return array;
};

function updatePokemonPosition() {
    randomPokemon.forEach((pokemon, i) => {
        let pokemonImg = document.querySelectorAll(".pokemonImg")[i];

        pokemonImg.style.left = `${oGameData.getLeftPosition()}px`;
        pokemonImg.style.top = `${oGameData.getTopPosition()}px`;
    });
    setInterval(updatePokemonPosition, 3000);
}

// efter formvalidate skall gameField visas genom att ta bort klassen d-none med dom-manip. Lägg till bakgrundsbilden i CSS för arenan.
// Ta även bort formen med hjälp av d-none samt ta bort bakgrundsbilden.
// randomfunktion som går igenom våran pokemon array behövs här.

//Starta spel när formulär skickas utan error
startForm.addEventListener("submit", function (event) {
    event.preventDefault();

    //     // Definera Player
    oGameData.trainerName = document.querySelector("#nick").value;
    oGameData.trainerAge = document.querySelector("#age").value;
    oGameData.trainerGender = document.querySelector("#gender").value;
    // try catch för validering
    try {
    } catch (error) {}

    //dölj starskärm visa spel
    document.querySelector("form-wrapper").classList.add("d-none");
    gameField.classList.remove("d-none");

    startForm();
});

function startGame() {
    gameMusic.play();
    //Starta spel och tid
    oGameData.startTimeInMilliseconds();
    oGameData.nmbrOfCaughtPokemons = 0;

    // for loop för att skapa upp våran array och tilldela bilderna till varje pokemon

    const pokemonArray = oGameData.pokemonNumbers;

    for (let i = 1; i <= 151; i++) {
        const formattedNumber = i.toString().padStart(3, "0");
        const pokemonObject = {
            number: i,
            imageUrl: `./assets/pokemons/${formattedNumber}.png`,
        };
        pokemonArray.push(pokemonObject);
    }

    shuffle(pokemonArray);

    const randomPokemon = pokemonArray.slice(0, 10);

    randomPokemon.forEach((pokemon) => {
        let pokemonImg = document.createElement("img");
        pokemonImg.className = "pokemonImg";
        pokemonImg.src = pokemon.imageUrl;

        pokemonImg.style.position = "absolute";

        pokemonImg.style.left = `${oGameData.getLeftPosition()}px`;
        pokemonImg.style.top = `${oGameData.getTopPosition()}px`;

        gameField.appendChild(pokemonImg);
    });

    updatePokemonPosition();
}

//Spawn random pokemon
// catch pokemon
//release pokemon
//highscrore- stringify array and parse string to array from localstorage
// Gameover

//TIM - Catch and release pokemon , jesper, shiny jesper
// Emund - randomize spawn.
//Robin -
