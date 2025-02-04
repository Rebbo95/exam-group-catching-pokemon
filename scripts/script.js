
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
    oGameData.trainerGender = document.querySelector("input[name='gender']:checked")

    // try catch för validering
    try {
        if (oGameData.trainerName.length < 5 || oGameData.trainerName.length > 10){
            throw { message: "Please enter a name that is more than 5, less than 10", nodeRef: document.querySelector("#nick") };
        }
        
        if (oGameData.trainerAge < 5 || oGameData.trainerAge > 10) {
            throw { message: "Enter a correct Age", nodeRef: document.querySelector("#age") };
        }

        if (!oGameData.trainerGender){
            throw { message: "Enter a Gender", nodeRef: document.querySelector("#gender") };
        }
         //dölj startsida, visa spel
        startGame();
     }

       catch (error) {

        alert(error.message);

        // if selected query has an error, focus it, and clear the field
        if (error.nodeRef) {
            error.nodeRef.value = ""; 
            error.nodeRef.focus();  
        }

    
    
    

}


function startGame() {

    startForm.classList.add("d-none");
    gameField.classList.remove(".d-none")
    
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
});