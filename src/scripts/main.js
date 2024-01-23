const state = {
	score: {
		playerScore: 0,
		computerScore: 0,
		scoreBox: document.getElementById("score_points"),
	},
	cardSprites: {
		avatar: document.getElementById("card-image"),
		name: document.getElementById("card-name"),
		type: document.getElementById("card-type"),
	},
	fieldCards: {
		player: document.getElementById("player-field-card"),
		computer: document.getElementById("computer-field-card"),
	},
	playerSides: {
		player1: "player-cards",
		player1El: document.getElementById("player-cards"),
		computer: "computer-cards",
		computerEl: document.getElementById("computer-cards"),
	},
	actions: {
		button: document.getElementById("next-duel"),
	},
};

const cardData = [
	{
		id: 0,
		name: "Blue Eyes White Dragon",
		type: "Paper",
		img: "src/assets/icons/dragon.png",
		WinOf: [1],
		LoseOf: [2]
	},
	{
		id: 1,
		name: "Dark Magician",
		type: "Rock",
		img: "src/assets/icons/magician.png",
		WinOf: [2],
		LoseOf: [0]
	},
	{
		id: 2,
		name: "Exodia",
		type: "Scissors",
		img: "src/assets/icons/exodia.png",
		WinOf: [0],
		LoseOf: [1]
	},
];

async function drawCards(cardAmount, fieldSide) {
	for (let i = 0; i < cardAmount; i++) {
		const randomCardId = await getRandomCardId();
		const cardImage = await createCardImage(randomCardId, fieldSide);

		document.getElementById(fieldSide).appendChild(cardImage);
	}
}

async function getRandomCardId() {
	const randId = Math.floor(Math.random() * cardData.length);
	return randId;
}

async function createCardImage(randIdCard, fieldSide) {
	const cardImage = document.createElement("img");

	cardImage.setAttribute("height", "100px");
	cardImage.setAttribute("src", "src/assets/icons/card-back.png");
	cardImage.setAttribute("data-id", randIdCard);

	cardImage.classList.add("card");

	if (fieldSide === state.playerSides.player1) {
		cardImage.addEventListener("click", () => {
			setCardField(cardImage.getAttribute("data-id"));
		});

		cardImage.addEventListener("mouseover", () => {
			drawSelectCard(randIdCard)
		});
	}

	return cardImage;
}

async function drawSelectCard(index) {
	state.cardSprites.avatar.src = cardData[index].img;
	state.cardSprites.name.innerText = cardData[index].name;
	state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function setCardField(cardId) {
	await removeAllCardsImage();

	let computerCardId = await getRandomCardId();

	state.fieldCards.player.style.display = "block";
	state.fieldCards.computer.style.display = "block";

	state.fieldCards.player.src = cardData[cardId].img;
	state.fieldCards.computer.src = cardData[computerCardId].img;

	state.cardSprites.avatar.src = "";
	state.cardSprites.name.innerText = "";
	state.cardSprites.type.innerText = "";

	let duelResult = await checkDuelResult(cardId, computerCardId);

	await updateScore();
	await drawButton(duelResult);
}

async function removeAllCardsImage() {
	let { player1El, computerEl } = state.playerSides;

	let imgElements = computerEl.querySelectorAll("img");
	imgElements.forEach(img => img.remove());

	imgElements = player1El.querySelectorAll("img");
	imgElements.forEach(img => img.remove());
}

async function checkDuelResult(playerCardId, computerCardId) {
	let result = "Empate";
	let playerCard = cardData[playerCardId];

	if (playerCard.WinOf.includes(computerCardId)) {
		await playAudio("win");
		result = "Ganhou";
		state.score.playerScore++;
	}
	if (playerCard.LoseOf.includes(computerCardId)) {
		await playAudio("lose");
		result = "Perdeu";
		state.score.computerScore++;
	}
	return result;
}

async function drawButton(duelResult) {
	state.actions.button.innerText = duelResult.toUpperCase();
	state.actions.button.style.display = "block";
}

async function updateScore() {
	state.score.scoreBox.innerText = `
		Win : ${state.score.playerScore} Lose: ${state.score.computerScore}`;
}

async function resetDuel() {
	state.cardSprites.avatar.src = "";
	state.actions.button.style.display = "none";

	state.fieldCards.player.style.display = "none";
	state.fieldCards.computer.style.display = "none";
	main();
}

async function playAudio(status) {
	const audio = new Audio(`src/assets/audios/${status}.wav`);

	audio.volume = 0.2;
	audio.play();
}

function main() {
	state.fieldCards.player.style.display = "none";
	state.fieldCards.computer.style.display = "none";

	drawCards(5, state.playerSides.player1);
	drawCards(5, state.playerSides.computer);

	const bgm = document.getElementById("bgm");
	bgm.volume = 0.2;
	bgm.play();
}

main();
