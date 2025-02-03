const log = (msg) => console.log(msg);

/* const gameMusic = document.querySelector("#gameMusic"); */
const startForm = document.querySelector("#form");
const gameField = document.querySelector("#gameField");
const gameMusic = document.querySelector("audio");

// efter formvalidate skall gameField visas genom att ta bort klassen d-none med dom-manip. Lägg till bakgrundsbilden i CSS för arenan.
// Ta även bort formen med hjälp av d-none samt ta bort bakgrundsbilden.
// randomfunktion som går igenom våran pokemon array behövs här.

//Starta spel när formulär skickas utan error
startForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Definera Player
    oGameData.trainerName = document.querySelector("#nick").value;
    oGameData.trainerAge = document.querySelector("#age").value;
    oGameData.trainerGender = document.querySelector("#gender").value;
    // try catch för validering
    try {
    } catch (error) {}

    //dölj starskärm visa spel
    document.querySelector("form-wrapper").classList.add("d-none");
    gameField.classList.remove(".d-none");

    startForm();
});

function startGame() {
    gameMusic.play();
    //Starta spel och tid
    oGameData.startTimeInMilliseconds();
    oGameData.nmbrOfCaughtPokemons = 0;
}

//Spawn random pokemon
// catch pokemon
//release pokemon
//highscrore- stringify array and parse string to array from localstorage
// Gameover

//TIM - Catch and release pokemon , jesper, shiny jesper
// Emund - randomize spawn.
//Robin -
