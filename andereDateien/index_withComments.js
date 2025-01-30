// Ein String mit allen Buchstaben des Alphabets
const lettersString = 'abcdefghijklmnopqrstuvwxyz';
// Aufteilen des String in Array mit einzelnen Buchstaben als Elemente
const letters = lettersString.split('');
// String mit den Buchstaben der obersten Reihe der Tastatur
const row1 = 'qwertzuiop';
// String mit den Buchstaben der mittleren Reihe der Tastatur
const row2 = 'asdfghjkl';
// String mit den Buchstaben der unteren Reihe der Tastatur
const row3 = 'yxcvbnm';
// Array mit den Buchstaben der einzelnen Reihen als 3 Arrays -> 2-dimensionales Array
const rows = [row1.split(''), row2.split(''), row3.split('')];

// Auswahl der relevanten HTML-Elemente, Zugriff über die definierten Variablen
// <div> Hier kann der Nutzer den Rate-Buchstaben auswählen
const tastatur = document.getElementById('tastatur');
// <input> Hier kann der Nutzer das zu suchende Wort eingeben
const wortfeld = document.getElementById('wortfeld');
// <div> Hier wird das Wort geraten, erst werden nur Unterstriche angezeigt, dann ggf. erfolgreich geratene Buchstaben
const zielFeld = document.getElementById('zielWort');
// <div> Hier werden Statusmeldungen für den Nutzer angezeigt
const ergebnisFeld = document.getElementById('ergebnis');
// <button> Neustart-Button, wird dynamisch erzeugt und taucht nicht in der index.html auf
const resetButton = document.createElement('button');
// <h2> Überschrift für die Tastatur, wird zu Beginn ausgeblendet
const keyboardtitel = document.getElementById('keyboardtitel');

// ??? warum Hinweistext nicht im html als <div>, im js als const-variable wie alle anderen, ausblenden wie wortfeld, hinweistext bei den anderen texten ???
// ??? geht möglicherweise, da jetzt location.reload() genutzt wird ???
// ??? ähnliche Frage bei Neustart-Button ???
// ??? Wenn der Button sowieso zu Beginn erzeugt wird, aber erst am Spiel-Ende mit Werten belegt und angezeigt wird, warum dann nicht im HTML einfügen und anfangs ausblenden. Was ist der Vorteil der Neuerschaffung des Elements? ????
// Prüfe, ob der Hinweistext bereits existiert, ansonsten erstellen
let hinweisText = document.getElementById('hinweis');

if (!hinweisText) {
	hinweisText = document.createElement('p');
	hinweisText.innerText =
		'Gib ein Wort ein und drücke Enter, um das Spiel zu starten.';
	hinweisText.setAttribute('id', 'hinweis');
	document.body.insertBefore(hinweisText, wortfeld);
}

// Vordefinierte Nachrichten als Strings
const gameOver = 'Verbleibende Leben ist 0. Game Over!';
const fail = 'Buchstabe nicht im Lösungswort.';
const success = 'Sehr gut! Das war ein Treffer!';
const congrats = 'Glückwunsch! Du hast das Wort erraten!';
const inputError = 'Bitte nur alphabetische Werte eingeben.';
// Variablen für das Spiel
// ??? wordArray und targetArray auch als 'const' möglich ??? in dieser Version möglich
// Array mit den Buchstaben des Lösungswort als Elemente
let wordArray = [];
// Array mit Unterstrichen (nicht erraten) und erratenen Buchstaben als Elementen
let targetArray = [];
// Anzahl der Leben als 'number'
let leben = 5;



// ***Eingabe des Lösungsworts***
// Worteingabe
// Hinzufügen eines 'eventListener' der das <input>-Element 'wortfeld' auf bestimmte Eingabewerte (Tastendrücke) überprüft
wortfeld.addEventListener('keydown', (e) => {
	// Überprüfen, ob (1) Enter gedrückt, (2) überhaupt etwas und (3) Buchstaben eingegeben worden sind
	if (e.key === 'Enter' && wortfeld.value && inputSanitizer(wortfeld.value)) {
		// Eingabewert in Kleinbuchstaben umwandeln, als String speichern
		let ws = wortfeld.value.toLowerCase();
		// Array mit den Buchstaben des Eingabeworts als Elemente
		wordArray = ws.split('');
		// Erschaffe Array mit entsprechender Anzahl an Unterstrichen
		createBlankZielDivs();
		// Erschaffe die virtuelle Tastatur
		createKeyboard();
		// Verstecke das Eingabefeld und den Hinweistext nach Eingabe und blendet Tastatur-Headline ein
		// Blende den Titel der Tastatur ein
		keyboardtitel.style.display = 'block';
		// Blende das Wortfeld aus
		wortfeld.style.display = 'none';
		// Blende den Hinweistext aus
		// ??? if-Abfrage nötig, auch wenn mit location.reload() gearbeitet wird ???
		if (hinweisText) {
			hinweisText.style.display = 'none';
		}
	}
});
// Eingabeprüfung: Nur Buchstaben erlaubt
const inputSanitizer = (string) => {
	// Schleife iteriert über die Länge des eingegeben Worts
	for (let i = 0; i < string.length; i++) {
		// Überprüfung, ob nur im zugelassenen Alphabet enthaltene Werte im Eingabewort enthalten sind, Bedingung negiert
		if (!letters.includes(string[i])) {
			// Sollten 'falsche' Werte gefunden werden, wird in der Ergebniszeile eine Fehlermeldung angezeigt.
			updateErgebnisFeld(inputError);
			// Rückgabewert 'false', wenn ein nicht erlaubter Buchstabe im Eingabewort enthalten ist
			return false;
		}
	}
	// Rückgabewert 'true', d.h. das Eingabewort enthält nur erlaubte Buchstaben
	return true;
};
// Erstellen der Platzhalter für das Lösungswort
const createBlankZielDivs = () => {
	// Setze den Inhalt des HTML-Elements mit ID='zielWort' über die verknüpfte Variable 'zielFeld' auf einen leeren String
	zielFeld.innerHTML = '';
	// Setze das Rate-Array auf ein leeres Array
	// ??? Warum wird es hier erneut auf ein leeres Array gesetzt, reicht es nicht in Zeile 53 ???
	targetArray = []; // Überbleibsel aus der KonsolenVersion
	// Durchlaufe die Schleife so oft, wie das Eingabewort Buchstaben enthält
	for (let i = 0; i < wordArray.length; i++) {
		// Fülle das Ziel-Array mit einem Unterstrich auf
		targetArray.push('_');
		// Erschaffe ein neues <div>-Element
		let zielDiv = document.createElement('div');
		// Füge diese <div>-Element der Klasse 'zieldiv' hinzu
		zielDiv.classList.add('zieldiv');
		// Setze den Inhalt dieses <div>-Elements auf Unterstrich
		zielDiv.innerText = '_';
		// Füge das <div>-Elements als Kind-Element an das Element 'zielFeld' an
		zielFeld.appendChild(zielDiv);
		// ??? Warum wird extra ein 'targetArray' erschaffen? ??? Einfacher, als Werte aus den <div> zu ziehen
		// ??? Kann man 'wordArray' nicht direkt mit den Kindern von 'zielFeld' vergleichen ???
	}
};


// ***Rate-Phase***
// Erstelle das virtuelle Keyboard
const createKeyboard = () => {
	// Setze den Inhalt des <div>-Elements 'tastatur' auf einen leeren String
	tastatur.innerHTML = '';
	// Führe die Schleife so oft aus ( 3 mal), wie Tastaturreihen existieren
	for (let j = 0; j < rows.length; j++) {
		// Speichere das j-te Element (in diesem Fall ein Array) des 2-dimensionalen Array 'rows' in der Variable 'row'
		let row = rows[j];
		// Erschaffe ein <div>-Element für die jeweilige Tastatur-Reihe
		let rowDiv = document.createElement('div');
		// Führe die Schleife so oft aus, wie Buchstaben in der entsprechenden Tastatur-Reihe enthalten sind
		for (let i = 0; i < row.length; i++) {
			// Erschaffe ein allgemeines HTML <input>-Element
			// ??? ist der gewählte Name 'letterDiv' hier nicht irreführend, da es kein <div>-Element ist ???
			let letterDiv = document.createElement('input');
			// Setze das Attribut 'type' dieses <input>-Elements auf den Wert 'button'
			letterDiv.setAttribute('type', 'button');
			// Beschrifte den Button mit dem entsprechenden Buchstaben der Tastatur-Reihe
			letterDiv.innerText = row[i];
			// Füge das <input>-Element der Klasse 'letter' hinzu
			letterDiv.classList.add('letter');
			// Setze den Wert des <input>-Elements auf den entsprechenden Buchstaben der Tastatur-Reihe
			// ??? Jetzt beinhaltet '.innerText' und '.value' den gleichen Wert, braucht man beide ???
			letterDiv.value = row[i];
			// Setze die ID des <input>-Elements auf 'lettera', 'letterb', etc.
			letterDiv.setAttribute('id', 'letter' + row[i]);
			// Füge dem <input>-Element eine 'EventListener' hinzu, 
			letterDiv.addEventListener('click', clickEvent);
			// Hänge das <input>-Element an das neu erschaffen Tastatur-Reihen-<div> 
			rowDiv.appendChild(letterDiv);
		}
		// Hänge das Tastatur-Reihen-<div> an das Tastatur-<div>
		tastatur.appendChild(rowDiv);
	}
};
// Eingabe des Rate-Buchstaben durch den Nutzer über die virtuelle Tastatur
const clickEvent = (e) => {
	// Speichere das vom Benutzer gewählte Buchstaben-Objekt
	let letterToChange = document.getElementById(
		'letter' + e.currentTarget.value
	);
	// Entferne den 'EventListener' vom entsprechenden Buchstaben-Objekt
	letterToChange.removeEventListener('click', clickEvent);
	// Fall: Das Wortarray beinhaltet den gewählten Buchstaben bzw. den Wert des Buchstaben-Objekts
	if (wordArray.includes(e.currentTarget.value)) {
		// Füge den gewählten Buchstaben in das Array 'targetArray' und in das angezeigte HTML-<div>-Element 'zielWort' ein
		updateTargetArrayAndZielWort(e.currentTarget.value);
		// Schreibe die Erfogsmeldung in das Ergebnisfeld
		updateErgebnisFeld(success);
		// Füge das Buchstaben-Objekt der Klasse 'letter-clicked-success' hinzu, um sein Aussehen anzupassen
		letterToChange.classList.add('letter-clicked-success');
	// Fall: Das Wortarray beinhaltet NICHT den gewählten Buchstaben bzw. den Wert des Buchstaben-Objekts
	} else {
		// Verringere die Anzahl der Leben um 1
		leben--;
		// Füge das Buchstaben-Objekt der Klasse 'letter-clicked-failed' hinzu, um sein Aussehen anzupassen
		letterToChange.classList.add('letter-clicked-failed');
		// Fall: Es sind noch Leben vorhanden
		if (leben > 0) {
			// Schreibe die Fehlermeldung, dass der Buchstabe nicht im Lösungswort enthalten ist. Evt. Text anpassen, dass der nächste Buchstabe zu wählen ist (?)
			updateErgebnisFeld(fail);
		// Fall: (VERLOREN) Es sind KEINE Leben mehr vorhanden
		} else {
			// SChreibe die Fehlermeldung, dass das Spiel verloren wurde
			updateErgebnisFeld(gameOver);
			// Belege den Neustart-Button mit Werten
			showResetButton();
			// Blockiere die Tastatur durch Entfernen der 'EventListener' von allen Buchstaben-Objekten
			blockKeyboard();
		}
	}
	// Fall: (GEWONNEN) Das Lösungswort entspricht dem vom Nutzer durch Raten gefüllten Ziel-Array
	if (wordArray.toString() === targetArray.toString()) {
		// Schreibe die Erfolgsmeldung in die Ergebniszeile
		updateErgebnisFeld(congrats);
		// Belege den Neustart-Button mit Werten
		showResetButton();
		// Blockiere die Tastatur durch Entfernen der 'EventListener' von allen Buchstaben-Objekten
		blockKeyboard();
	}
};
// Überprüfung, ob der Buchstabe im Wort enthalten ist, falls ja Anzeige des Buchstaben
const updateTargetArrayAndZielWort = (letter) => {
	// Schleife iteriert über die Länge des Lösungsworts
	for (let i = 0; i < wordArray.length; i++) {
		// Vergleiche die entsprechende Stelle des Lösungsworts mit dem gewählten Buchstaben
		// Fall: Die Stelle des Lösungsworts entspricht dem gewählten Buchstaben
		if (wordArray[i] === letter) {
			// Fülle die entsprechende Stelle des Ziel-Array mit dem gewählten Buchstabaen
			targetArray[i] = letter;
			
			document.querySelector(`#zielWort div:nth-child(${i + 1})`).innerText =
				letter;
		}
	}
};
// Aktualisieren des Nachrichtenfelds
const updateErgebnisFeld = (string) => {
	ergebnisFeld.innerText = string;
};


//***Spiel-Ende***
// Tastatur blockieren
const blockKeyboard = () => {
	let buttons = document.getElementsByClassName('letter');
	for (let button of buttons) {
		button.removeEventListener('click', clickEvent);
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
// ??? ist die Funktion nötig, falls mit ein-/ausblenden des Button gearbeitet wird ???
// Neustart-Button anzeigen
const showResetButton = () => {
	resetButton.innerText = 'Neustart';
	resetButton.style.display = 'block';
	resetButton.addEventListener('click', restartGame);
	document.body.appendChild(resetButton);
};


// ***Sonstiges***
// SkinWechsel
function changeSkin(skinNumber) {
	let skins = document.getElementsByTagName('link');
	skins[0].href = skinNumber;
}
