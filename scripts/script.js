
/* const gameMusic = document.querySelector("#gameMusic"); */
const startForm = document.querySelector("#form");
const gameField = document.querySelector("#gameField");
const gameMusic = document.querySelector("audio");


//Starta spel när formulär skickas utan error
startForm.addEventListener("submit", function (event) {
    event.preventDefault();



    oGameData.trainerName = document.querySelector("#nick").value;
    oGameData.trainerAge = document.querySelector("#age").value;
    oGameData.trainerGender = document.querySelector("input[name='gender']:checked")?.value;
    // try catch för validering
    try {
        //     // Definera Player



        if (oGameData.trainerName.length < 5 || oGameData.trainerName.length > 10) {
            throw { message: "Please enter a name that is more than 5, less than 10", nodeRef: document.querySelector("#nick") };
        }

        if (oGameData.trainerAge < 10 || oGameData.trainerAge > 15) {
            throw { message: "Enter a correct Age", nodeRef: document.querySelector("#age") };
        }

        if (!oGameData.trainerGender) {
            throw { message: "Enter a Gender", nodeRef: document.querySelector("input[name='gender']") };
        }


        /*   oGameData.trainerName = trainerName;
          oGameData.trainerAge = trainerAge;
          oGameData.trainerGender = trainerGender.id; */




        //dölj startsida, visa spel
        startGame();


    } catch (error) {
        // if selected query has an error, focus it, and clear the field
        if (error.nodeRef) {
            alert(error.message);
            error.nodeRef.value = "";
            error.nodeRef.focus();
        }
    }

});


function startGame() {

    gameMusic.currentTime = 0;
    // gameMusic.play(); kommentrade ut för ja tröttna på musiken


    startForm.classList.add("d-none");
    document.querySelector("#gameField").classList.remove("d-none");
    document.querySelector("#formWrapper").classList.add("d-none");

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


    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    };

    shuffle(pokemonArray);

    const randomPokemon = pokemonArray.slice(0, 10);

    randomPokemon.forEach((pokemon) => {
        let pokemonImg = document.createElement("img");
        pokemonImg.className = "pokemonImg";
        pokemonImg.src = pokemon.imageUrl;

        pokemonImg.setAttribute("data-original-src", pokemon.imageUrl);


        pokemonImg.style.position = "absolute";

        pokemonImg.style.left = `${oGameData.getLeftPosition()}px`;
        pokemonImg.style.top = `${oGameData.getTopPosition()}px`;
        pokemonImg.addEventListener("mouseover", function () {
            catchPokemon(this);
        });
        gameField.appendChild(pokemonImg);
    });




    function updatePokemonPosition() {
        randomPokemon.forEach((pokemon, i) => {
            let pokemonImg = document.querySelectorAll(".pokemonImg")[i];

            pokemonImg.style.left = `${oGameData.getLeftPosition()}px`;
            pokemonImg.style.top = `${oGameData.getTopPosition()}px`;
        });

    }

    setInterval(updatePokemonPosition, 3000);


    oGameData.caughtPokemons = [];

    catchPokemon(pokemon);
    releasePokemon(pokemon);

}


function highScore(newScore) {
    document.addEventListener("DOMContentLoaded", function () {
        try {
            // Load existing high scores from localStorage
            let load = localStorage.getItem("highscore");
            let highscore = load ? JSON.parse(load) : [];

            newScore = parseInt(newScore, 10);
            highscore.push(newScore);

            // Save the new score first
            localStorage.setItem("highscore", JSON.stringify(highscore));
            alert(`Score ${newScore} has been added to the highscore.`);

            //asks if the user wants to clear all highscore entries from the localstorage
            clearHighScore();


        } catch (error) {
            console.error("Error handling highscore:", error);
        }
    });
}

function clearHighScore() {
    // Ask the user if they want to clear the highscore list
    let clearScores = confirm("Do you want to clear all highscores?");

    if (clearScores) {
        // Delete the highscore key from localStorage
        localStorage.removeItem("highscore");
        alert("all entries within highscore has been deleted");
    }
    else {
        alert("Highscores were not deleted");
    }
    //logs current highScore
    console.log("Highscores:", localStorage.getItem("highscore"));

}

//sets a score into the highscore list in the 
// highScore(150);



function catchPokemon(pokemon) {
    let originalSrc = pokemon.getAttribute("data-original-src");

    //kolla om pokemon redan är fångad
    if (pokemon.getAttribute("data-caught")) {
        //släpp pokemon fri och återställ tidigare pokemon bild
        releasePokemon(pokemon);
    } else {
        //fånga pokemon och byt till pokeboll
        pokemon.src = "assets/ball.webp";
        pokemon.classList.add("caught");
        pokemon.setAttribute("data-caught", "true");


        //lägg till i listan om den inte redan finns 
        if (!oGameData.caughtPokemons.includes(originalSrc)) {
            oGameData.caughtPokemons.push(originalSrc);
        }
        //kontrollera om alla pokemons har fångats
        if (oGameData.caughtPokemons.length === 10) {
            endGame();
        }

    }

}

/* updatePokemonPosition(); */
oGameData.caughtPokemons = [];


function releasePokemon(pokemon) {
    let originalSrc = pokemon.getAttribute("data-original-src");

    if (originalSrc) {
        //sätt tillbaka orginal pokemon
        pokemon.src = originalSrc;
        pokemon.classList.remove("caught");

        pokemon.removeAttribute("data-caught");




        //ta bort från fångad listan
        const index = oGameData.caughtPokemons.indexOf(originalSrc);
        if (index !== -1) {
            oGameData.caughtPokemons.splice(index, 1);
        }


    }

}


function endGame() {
    gameField.classList.add("d-none");
    gameMusic.pause();
    oGameData.endTimeInMilliseconds();

    let timeTaken = (oGameData.endTime - oGameData.startTime) / 1000;
    alert(`Grattis, ${oGameData.trainerName}! Du fångade alla Pokémon på ${timeTaken.toFixed(2)} sekunder`);

    /* saveHighScore(timeTaken); */
    /* displayHighScore(); */

    document.querySelectorAll(".pokemonImg").forEach((pokemon) => {
        pokemon.replaceWith(pokemon.cloneNode(true));
    });
}




/* const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
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
} */