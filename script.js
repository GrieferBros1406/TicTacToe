const SPIELFELD_KLASSE = "spielfeld";
const SPIELANZEIGE_KLASSE = "spielanzeige";
const FELD_KLASSE = "feld";
const SPIELER_KLASSE = "spieler";
const GEGNER_KLASSE = "gegner";
const OVERLAY_KLASSE = "overlay";
const OVERLAY_TEXT_KLASSE = "overlay-text";
const OVERLAY_BUTTON_KLASSE = "overlay-button";
const SICHTBAR_KLASSE = "sichtbar";
const AUFGEBEN_BUTTON_KLASSE = "aufgeben-button"
const COMPUTER_BUTTON_KLASSE = "computer-button";

const spielfeld = document.querySelector("." + SPIELFELD_KLASSE);
const spielanzeige = document.querySelector("." + SPIELANZEIGE_KLASSE);
const overlay = document.querySelector("." + OVERLAY_KLASSE);
const overlayText = document.querySelector("." + OVERLAY_TEXT_KLASSE);
const overlayButton = document.querySelector("." + OVERLAY_BUTTON_KLASSE);
const aufgebenButton = document.querySelector("." + AUFGEBEN_BUTTON_KLASSE);
const userOne = document.getElementById('NameOne');
const userTwo = document.getElementById('NameTwo');

let spielernameEins = "O"
let spielernameZwei = "X"

const felder = document.querySelectorAll("." + FELD_KLASSE);

const SIEG_KOMBINATIONEN = [
   [felder[0], felder[1], felder[2]],
   [felder[3], felder[4], felder[5]],
   [felder[6], felder[7], felder[8]],
   [felder[0], felder[3], felder[6]],
   [felder[1], felder[4], felder[7]],
   [felder[2], felder[5], felder[8]],
   [felder[0], felder[4], felder[8]],
   [felder[2], felder[4], felder[6]],
];

let aktuelleKlasse;

// damit ein spieler Aufgeben kann
aufgebenButton.addEventListener("click", beendenAufgeben)

// damit der button neustarten funktioniert
overlayButton.addEventListener("click", spielStarten);

spielStarten();

function klickVerarbeiten(ereignis) {
  // Ermitteln, welches Feld angeklickt wurde
  const feld = ereignis.target;

  // Spielstein auf dieses Feld setzen
  if (spielsteinSetzen(feld) === true) {
    // Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde
    zugBeenden();
  }
}

function spielsteinSetzen(feld) {
   // Prüfen, ob das Feld schon besetzt ist
   if (
     feld.classList.contains(SPIELER_KLASSE) ||
     feld.classList.contains(GEGNER_KLASSE)
   ) {
     // Verhindern, dass ein Spielstein gesetzt wird
     return false;
   }
 
   // Dem Feld die Klasse des Spielers anhängen, der gerade an der Reihe ist
   feld.classList.add(aktuelleKlasse);
 
   // Das Feld deaktivieren, um weitere Klicks zu verhindern
   feld.disabled = true;
 
   // Signalisieren, dass der Spielstein erfolgreich gesetzt wurde
   return true;
 }

function spielStarten() {
  // Das Overlay wieder verstecken, falls es bereits sichtbar ist
  overlay.classList.remove(SICHTBAR_KLASSE);

  // Die Klasse des letzten Siegers vom Overlay-Text entfernen
  overlayText.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);

  // Die aktuelleKlasse leeren, damit der Zufall entscheidet, wer beginnt
  aktuelleKlasse = null;

  // Die Liste der Felder durchgehen
  for (const feld of felder) {
    // Bestehende Spielsteine vom Feld entfernen
    feld.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);

    // Das Feld wieder aktivieren, falls es schon deaktiviert ist
    feld.disabled = false;

    // Jedem Feld sagen, was beim Klick darauf passieren soll
    feld.addEventListener("click", klickVerarbeiten);
  }

  // Festlegen, wer beginnen darf
  zugBeenden();
}

function zugBeenden() {
   //prüfen, ob der spieler, der gerade an der reihe ist, gewonnen hat
   if (siegPrüfen() === true) {
      // ist das der fall, wird das spiel beendet
      spielBeenden(false)
      // zugBeenden-funktion unterbrechen, um nicht zu anderen spieler zu wechseln
      return;
   }

   // prüfen, ob ein unentschieden entstanden ist
   if(unentschiedenprüfen() === true) {
      //ist das der fall, wird das spiel beendet
      spielBeenden(true);
      return;
   }

   if (aktuelleKlasse === SPIELER_KLASSE) {
      // Spieler beendet seinen Zug -> zum Gegner wechseln
      aktuelleKlasse = GEGNER_KLASSE;
    } else if (aktuelleKlasse === GEGNER_KLASSE) {
      // Gegner beendet seinen Zug -> zum Spieler wechseln
      aktuelleKlasse = SPIELER_KLASSE;
    } else {
      // Es ist noch niemand am Zug -> auswürfeln, wer beginnt
      aktuelleKlasse = Math.random() < 0.5 ? SPIELER_KLASSE : GEGNER_KLASSE;
    }

    spielanzeigeAktualisieren();
}

function spielanzeigeAktualisieren() {
   // Die Klasse des aktuellen Spielers von der Spielanzeige entfernen
   spielanzeige.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
 
   // Text der Spielanzeige anpassen: je nachdem, wer gerade am Zug ist
   if (aktuelleKlasse === SPIELER_KLASSE) {
     spielanzeige.innerText = spielernameEins + ", Platzier dein Kreis.";
   } else {
     spielanzeige.innerText = spielernameZwei + ", Platzier dein Kreuz.";
   }
 
   // Die Klasse des Spielers, der gerade am Zug ist an die Spielanzeige hängen
   spielanzeige.classList.add(aktuelleKlasse);
 }

 function siegPrüfen() {
   // gehe alle siegeskombinationen durch
   for (const kombination of SIEG_KOMBINATIONEN) {
      // prüfe, ob alle 3 felder der gleichen klasse angehören
      const gewonnen = kombination.every(function (feld) {
         return feld.classList.contains(aktuelleKlasse);
      });

      if (gewonnen === true) {
         // beende die funktion & signalisiere, dass der spieler gewonnen ha
         return true;
      }
   }

   // signalisiere, dass das spiel (noch) NICHT gewonnen ist
   return false;
 }

function spielBeenden(unentschieden) {
   // text für das overlay festlegen
   if (unentschieden === true) {
      overlayText.innerText = "Unentschieden!";
   } else if (aktuelleKlasse === SPIELER_KLASSE) {
      overlayText.innerText = spielernameEins + " hat Gewonnen!";
   } else {
      overlayText.innerText = spielernameZwei + " hat Gewonnen"
   }

   // das overlay sichtbar machen
   overlay.classList.add(SICHTBAR_KLASSE);
}

function beendenAufgeben() {
   // das overlay sichtbar machen
   overlay.classList.add(SICHTBAR_KLASSE); 
   if (aktuelleKlasse == SPIELER_KLASSE) {
      overlayText.innerText = spielernameEins + " hat Aufgegeben"
   } else {
      overlayText.innerText = spielernameZwei + " hat Aufgegeben"
   }
}

function unentschiedenprüfen() {
   // gehe alle felder durch
   for (const feld of felder) {
      if (
         !feld.classList.contains(SPIELER_KLASSE) &&
         !feld.classList.contains(GEGNER_KLASSE)
      ) {
         // gibt es ein ubesetztes Feld, kann es kein Unentschieden sein
         return false;
      }
   }

   // es gibt kein freies feld mehr -> unentschieden!
   return true
}

// öffnet denn dialog
function dialogÖffnen(dialogId) {
   document.getElementById(dialogId).classList.add("sichtbar");
}

// Schließt denn dialog
function dialogSchliessen(dialogId) {
   document.getElementById(dialogId)?.classList.remove("sichtbar");
}

function myInput(dialogId) {
   spielernameEins = document.getElementById("NameOne").value;
   spielernameZwei = document.getElementById("NameTwo").value;
   spielanzeigeAktualisieren();
   dialogSchliessen(dialogId);
}

function validateForm() {
   let x = document.forms["dialogForm"]["NameOne"].value;
   if (x == null || x == "") {
      alert("Spielernamen müssen ausgefüllt sein");
      return false;
   }

   let y = document.forms["dialogForm"]["NameTwo"].value;
   if (y == null || y == "") {
     alert("Spielernamen müssen ausgefüllt sein");
     return false;
   }

   myInput("onoff-dialog")
 }