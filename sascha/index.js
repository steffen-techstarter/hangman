// Ein String mit allen Buchstaben des Alphabets
const lettersString = 'abcdefghijklmnopqrstuvwxyz';
const letters = lettersString.split('');

// Auswahl der relevanten HTML-Elemente
const tastatur = document.getElementById('tastatur');
const wortfeld = document.getElementById('wortfeld');
const zielFeld = document.getElementById('zielWort');
const ergebnisFeld = document.getElementById('ergebnis');
const resetButton = document.createElement('button');
const keyboardtitel = document.getElementById('keyboardtitel');

// **Prüfe, ob der Hinweistext bereits existiert, ansonsten erstellen**
let hinweisText = document.getElementById('hinweis');

if (!hinweisText) {
	hinweisText = document.createElement('p');
	hinweisText.innerText =
		'Gib ein Wort ein und drücke Enter, um das Spiel zu starten.';
	hinweisText.setAttribute('id', 'hinweis');
	document.body.insertBefore(hinweisText, wortfeld);
}

// Vordefinierte Nachrichten
const gameOver = 'Verbleibende Leben ist 0. Game Over!';
const fail = 'Buchstabe nicht im Lösungswort.';
const success = 'Sehr gut! Das war ein Treffer!';
const congrats = 'Glückwunsch! Du hast das Wort erraten!';
const inputError = 'Bitte nur alphabetische Werte eingeben.';

// Variablen für das Spiel
let wordArray = [];
let targetArray = [];
let leben = 5;

// Funktion zum Aktualisieren des Nachrichtenfelds
const updateErgebnisFeld = (string) => {
	ergebnisFeld.innerText = string;
};

// Funktion zur Anzeige des zu erratenden Wortes
const updateTargetArrayAndZielWort = (letter) => {
	for (let i = 0; i < wordArray.length; i++) {
		if (wordArray[i] === letter) {
			targetArray[i] = letter;
			document.querySelector(`#zielWort div:nth-child(${i + 1})`).innerText =
				letter;
		}
	}
};

// Funktion zum Erstellen der Platzhalter für das Lösungswort
const createBlankZielDivs = () => {
	zielFeld.innerHTML = '';
	targetArray = [];

	for (let i = 0; i < wordArray.length; i++) {
		targetArray.push('_');
		let zielDiv = document.createElement('div');
		zielDiv.classList.add('zieldiv');
		zielDiv.innerText = '_';
		zielFeld.appendChild(zielDiv);
	}
};

const blockKeyboard = () => {
	let buttons = document.getElementsByClassName('letter');
	for (let button of buttons) {
		button.removeEventListener('click', clickEvent);
	}
};

// Eingabeprüfung: Nur Buchstaben erlaubt
const inputSanitizer = (string) => {
	for (let i = 0; i < string.length; i++) {
		if (!letters.includes(string[i])) {
			updateErgebnisFeld(inputError);
			return false;
		}
	}
	return true;
};

// Event für die Tastenklicks
const clickEvent = (e) => {
	let letterToChange = document.getElementById(
		'letter' + e.currentTarget.value
	);
	letterToChange.removeEventListener('click', clickEvent);

	if (wordArray.includes(e.currentTarget.value)) {
		updateTargetArrayAndZielWort(e.currentTarget.value);
		updateErgebnisFeld(success);
		letterToChange.classList.add('letter-clicked-success');
	} else {
		leben--;
		letterToChange.classList.add('letter-clicked-failed');

		if (leben > 0) {
			updateErgebnisFeld(fail);
		} else {
			// Verloren
			updateErgebnisFeld(gameOver);
			showResetButton();
			blockKeyboard();
		}
	}
	// Gewonnen
	if (wordArray.toString() === targetArray.toString()) {
		updateErgebnisFeld(congrats);
		showResetButton();
		blockKeyboard();
	}
};

// **Event-Listener für die Eingabe des Wortes**
wortfeld.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' && wortfeld.value && inputSanitizer(wortfeld.value)) {
		let ws = wortfeld.value.toLowerCase();
		wordArray = ws.split('');
		createBlankZielDivs();
		createKeyboard();

		// **Verstecke das Eingabefeld und den Hinweistext nach Eingabe und blendet Tastatur-Headline ein**
		keyboardtitel.style.display = 'block';
		wortfeld.style.display = 'none';
		if (hinweisText) {
			hinweisText.style.display = 'none';
		}
	}
});

// Erstelle das virtuelle Keyboard
const createKeyboard = () => {
	tastatur.innerHTML = '';

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
};

// Spiel neustarten
const restartGame = () => {
	// Saschas alter Reset-Code zum Lernen
	// wordArray = [];
	// targetArray = [];
	// leben = 5;
	// updateErgebnisFeld('');
	// zielFeld.innerHTML = '';
	// tastatur.innerHTML = '';
	// wortfeld.value = '';
	// wortfeld.style.display = 'inline-block';

	// // **Hinweistext wieder anzeigen (aber nur wenn er existiert!)**
	// if (hinweisText) {
	// 	hinweisText.style.display = 'block';
	// }

	// createKeyboard();
	// resetButton.style.display = 'none';

	// location.reload() um Seite komplett neu zu laden und alles auf anfang zu setzen
	location.reload();
};

// Neustart-Button anzeigen
const showResetButton = () => {
	resetButton.innerText = 'Neustart';
	resetButton.style.display = 'block';
	resetButton.addEventListener('click', restartGame);
	document.body.appendChild(resetButton);
};

// Initialisiere das Spiel
