const lettersString = 'abcdefghijklmnopqrstuvwxyz';
const letters = lettersString.split('');

const tastatur = document.getElementById('tastatur');
const wortfeld = document.getElementById('wortfeld');
const zielFeld = document.getElementById('zielWort');
const ergebnisFeld = document.getElementById('ergebnis');

const gameOver = 'Verbleibende Leben ist 0. Game Over!';
const fail = 'Buchstabe nicht im Lösungswort.';
const success = 'Sehr gut! Das war ein Treffer!';
const congrats = 'Glückwunsch! Du hast das Wort erraten!';
const inputError = 'Bitte nur alphabetische Werte eingeben.';

let wordArray = [];
let targetArray = [];
let leben = 5;

const updateErgebnisFeld = (string) => {
	ergebnisFeld.innerText = string;
};

const updateTargetArrayAndZielWort = (letter) => {
	for (let i = 0; i < wordArray.length; i++) {
		if (wordArray[i] === letter) {
			targetArray[i] = letter;
			document.querySelector(
				'#zielWort div:nth-child(' + (i + 1) + ')'
			).innerText = letter;
		}
	}
};

const createBlankZielDivs = () => {
	for (let i = 0; i < wordArray.length; i++) {
		targetArray.push('_');
		let zielDiv = document.createElement('div');
		zielDiv.classList.add('zieldiv');
		zielDiv.innerText = '_';
		zielFeld.appendChild(zielDiv);
	}
};
const inputSanatizer = (string) => {
	for (let i = 0; i < string.length; i++) {
		if (!letters.includes(string[i])) {
			updateErgebnisFeld(inputError);
			return false;
		}
	}
	return true;
};

const clickEvent = (e) => {
	let letterToChange = document.getElementById(
		'letter' + e.currentTarget.value
	);
	letterToChange.removeEventListener('click', clickEvent);
	if (wordArray.includes(e.currentTarget.value)) {
		updateTargetArrayAndZielWort(e.currentTarget.value);
		updateErgebnisFeld(success);
		letterToChange.classList.replace('letter', 'letter-clicked-success');
	} else {
		leben--;
		letterToChange.classList.replace('letter', 'letter-clicked-failed');
		if (leben > 0) {
			updateErgebnisFeld(fail);
		} else {
			updateErgebnisFeld(gameOver);
			return;
		}
	}
	if (wordArray.toString() === targetArray.toString()) {
		updateErgebnisFeld(congrats);
	}
};

wortfeld.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' && wortfeld.value && inputSanatizer(wortfeld.value)) {
		let ws = wortfeld.value;
		wordArray = ws.toLowerCase().split('');
		createBlankZielDivs();
	}
});

for (let i = 0; i < letters.length; i++) {
	let letterDiv = document.createElement('input');
	letterDiv.setAttribute('type', 'button');
	letterDiv.innerText = letters[i];
	letterDiv.classList.add('letter');
	letterDiv.value = letters[i];
	letterDiv.setAttribute('id', 'letter' + letters[i]);
	letterDiv.addEventListener('click', clickEvent);
	tastatur.appendChild(letterDiv);
}
