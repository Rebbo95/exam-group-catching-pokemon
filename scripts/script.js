
/* const gameMusic = document.querySelector("#gameMusic"); */
const startForm = document.querySelector("#form");
const gameField = document.querySelector("#gameField");
const gameMusic = document.querySelector("audio");

const pokemonArray = oGameData.pokemonNumbers;


//Starta spel när formulär skickas utan error
startForm.addEventListener("submit", function (event) {
    event.preventDefault();

    validateForm();

});

function validateForm() {
    oGameData.trainerName = document.querySelector("#nick").value;
    oGameData.trainerAge = document.querySelector("#age").value;
    oGameData.trainerGender = document.querySelector("input[name='gender']:checked");
    // try catch för validering
    try {
        //     // Definera Player
        if (oGameData.trainerName.length < 5 || oGameData.trainerName.length > 10) {
            throw { message: "Please enter a name that is more than 5, less than 10", nodeRef: document.querySelector("#nick") };
        }

        if (oGameData.trainerAge < 10 || oGameData.trainerAge > 15) {
            throw { message: "Your age has to be between 10 or 15", nodeRef: document.querySelector("#age") };
        }

        if (!oGameData.trainerGender) {
            throw { message: "Please select a Gender", nodeRef: document.querySelector("input[name='gender']") };
        }

        document.querySelector("#errorMsg").textContent = "";

        startGame();

    } catch (error) {
        // if selected query has an error, focus it, and clear the field
        if (error.nodeRef) {
            document.querySelector("#errorMsg").textContent = error.message;
            error.nodeRef.value = "";
            error.nodeRef.focus();
        }
        return false;
    }
}

function startGame() {

    gameMusic.currentTime = 0;
    // gameMusic.play(); kommentrade ut för ja tröttna på musiken
    startForm.classList.add("d-none");
    document.querySelector("#gameField").classList.remove("d-none");
    document.querySelector("#formWrapper").classList.remove("flex-class")
    document.querySelector("#formWrapper").classList.add("d-none");
    document.querySelector("#form").classList.add("d-none");


    //Starta spel och tid
    oGameData.startTimeInMilliseconds();
    oGameData.nmbrOfnmbrOfCaughtPokemons = 0;

    // for loop för att skapa upp våran array och tilldela bilderna till varje pokemon

    if (pokemonArray.length === 0) {
        for (let i = 1; i <= 151; i++) {
            const formattedNumber = i.toString().padStart(3, "0");
            const pokemonObject = {
                number: i,
                imageUrl: `./assets/pokemons/${formattedNumber}.png`,
            };
            pokemonArray.push(pokemonObject);
        }
    }

    shuffle(pokemonArray);
    const randomPokemon = pokemonArray.slice(0, 10);
    Spawnpokemon(randomPokemon);

    // updates pokemon position
    function updatePokemonPosition() {
        randomPokemon.forEach((pokemon, i) => {
            let pokemonImg = document.querySelectorAll(".pokemonImg")[i];

            pokemonImg.style.left = `${oGameData.getLeftPosition()}px`;
            pokemonImg.style.top = `${oGameData.getTopPosition()}px`;
        });

    }
    setTimeout(() => {
        updatePokemonPosition();
        setInterval(updatePokemonPosition, 3000);
    }, 500);

    oGameData.nmbrOfCaughtPokemons = [];

}

// Fisher Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
//function for spawning pokemons to gamefield
function Spawnpokemon(randomPokemon) {

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
}

function highScore(newScore) {
    // Load existing scores from localStorage
    let storedScores = localStorage.getItem("highscore");

    let highscore;
    try {
        highscore = storedScores ? JSON.parse(storedScores) : [];
    } catch (e) {
        console.error('Error parsing stored scores:', e);
        highscore = []; // Default to an empty array if parsing fails
    }

    // Create a new score entry
    let scoreEntry = {
        playerName: oGameData.trainerName,
        time: parseFloat(newScore)
    };

    // Add the new score to the list
    highscore.push(scoreEntry);

    // Sort scores in ascending order (best time first)
    highscore.sort((a, b) => a.time - b.time);

    // Keep only the top 10 scores
    highscore = highscore.slice(0, 10);

    // Save updated scores to localStorage
    localStorage.setItem("highscore", JSON.stringify(highscore));

    // Display the highscore list
    displayHighScore();
}

function displayHighScore() {
    let highscoreList = document.querySelector("#highscoreList");
    highscoreList.innerHTML = ""; // Clear previous list

    let storedScores = localStorage.getItem("highscore");
    let highscore = storedScores ? JSON.parse(storedScores) : [];

    // Create list items and append to highscore list
    highscore.forEach((score, index) => {
        let li = document.createElement("li");
        li.textContent = `${index + 1}. ${score.playerName} - Time: ${score.time.toFixed(2)}s`;
        highscoreList.appendChild(li);
    });

    // Show highscore section
    document.querySelector("#highScore").classList.remove("d-none");
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
        if (!oGameData.nmbrOfCaughtPokemons.includes(originalSrc)) {
            oGameData.nmbrOfCaughtPokemons.push(originalSrc);
        }
        //kontrollera om alla pokemons har fångats
        if (oGameData.nmbrOfCaughtPokemons.length === 10) {
            endGame();
        }
    }
}

/* updatePokemonPosition(); */
oGameData.nmbrOfCaughtPokemons = [];

function releasePokemon(pokemon) {
    let originalSrc = pokemon.getAttribute("data-original-src");

    if (originalSrc) {
        //sätt tillbaka orginal pokemon
        pokemon.src = originalSrc;
        pokemon.classList.remove("caught");
        pokemon.removeAttribute("data-caught");

        //ta bort från fångad listan
        const index = oGameData.nmbrOfCaughtPokemons.indexOf(originalSrc);
        if (index !== -1) {
            oGameData.nmbrOfCaughtPokemons.splice(index, 1);
        }
    }
}

function endGame() {
    //  gameField.classList.add("d-none");
    gameMusic.pause();
    oGameData.endTimeInMilliseconds();
    document.querySelectorAll(".pokemonImg").forEach(pokemon => pokemon.remove());

    let timeTaken = (oGameData.endTime - oGameData.startTime) / 1000;
    /*  alert(`Grattis, ${oGameData.trainerName}! Du fångade alla Pokémon på ${timeTaken.toFixed(2)} sekunder`); */
    highScore(timeTaken);
    displayHighScore();



    let playAgainBtn = document.querySelector("#playAgain");

}

document.querySelector("#playAgainBtn").addEventListener("click", function () {
    location.reload(); // Reload the page to restart the game
});
