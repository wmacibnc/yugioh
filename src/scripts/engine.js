const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
        computerBox: document.getElementById("computer_points")    
    },
    cardSprites: {
        avatar: document.getElementById("card-image-player"),
        name: document.getElementById("card-name-player"),
        type: document.getElementById("card-type-player"),
        avatarComputer: document.getElementById("card-image-computer"),
        nameComputer: document.getElementById("card-name-computer"),
        typeComputer: document.getElementById("card-type-computer")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playersSides: {
        player1: "player-cards",
        computer: "computer-cards",
        player1Box: document.querySelector("#player-cards"),
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel"),
        buttonResult: document.getElementById("result-duel"),
        buttonAudio: false
    },
    bgm: document.getElementById("bgm"),
    audio: document.getElementById("audio")

}


const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", idCard);
    
    if (fieldSide === state.playersSides.player1) {
        cardImage.classList.add("card");

        cardImage.addEventListener("mouseover", () => {
            drawSelectCardPlayer(idCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

    }
    return cardImage;
}


async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await drawSelectCardComputer(computerCardId);
    await updateScore();
    await drawButton(duelResults);
}

async function updateScore() {
    state.score.scoreBox.innerText = ` Jogador: ${state.score.playerScore} vitória (s)`;
    state.score.computerBox.innerText = ` Máquina: ${state.score.computerScore} vitória (s)`;
}

async function drawButton(text) {
    state.actions.button.style.display = "block";

    state.actions.buttonResult.innerText = text;
    state.actions.buttonResult.style.display = "block";   
}
async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "Empate";
    let playCard = cardData[playerCardId];
    if (playCard.WinOf.includes(ComputerCardId)) {
        duelResults = "Você Ganhou!";
        state.score.playerScore++;
        await playAudio("win");
    }

    if (playCard.LoseOf.includes(ComputerCardId)) {
        duelResults = "Você Perdeu!";
        state.score.computerScore++;
        await playAudio("lose");
    }

    return duelResults;
}
async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playersSides;

    computerBox.querySelectorAll("img").forEach((img) => {
        img.remove();
    });

    player1Box.querySelectorAll("img").forEach((img) => {
        img.remove();
    });

}

async function drawSelectCardPlayer(idPlayer) {
    state.cardSprites.avatar.src = cardData[idPlayer].img;
    state.cardSprites.name.innerText = cardData[idPlayer].name;
    state.cardSprites.type.innerText = `Atributo: ${cardData[idPlayer].type}`;
}

async function drawSelectCardComputer(idComputer) {
    state.cardSprites.avatarComputer.src = cardData[idComputer].img;
    state.cardSprites.nameComputer.innerText = cardData[idComputer].name;
    state.cardSprites.typeComputer.innerText = `Atributo: ${cardData[idComputer].type}`;

}

async function drawCards(cardNumbers, fieldSide, isRandom) {
    for (let i = 0; i < cardNumbers; i++) {
        let idCard = i;
        if (isRandom) {
            idCard = await getRandomCardId();
        }
        const cardImage = await createCardImage(idCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.actions.button.style.display = "none";
    state.actions.buttonResult.style.display = "none";
    
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";

    state.cardSprites.avatarComputer.src = "";
    state.cardSprites.nameComputer.innerText = "Aguardando";
    state.cardSprites.typeComputer.innerText = "jogador";

    init();
}

async function playAudio(audioName) {
    const audio = new Audio(`./src/assets/audios/${audioName}.wav`);
    audio.play();
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(3, state.playersSides.player1, false);
    drawCards(3, state.playersSides.computer, true);

    bgm.play();
    bgm.volume(0.5);
}

init();
