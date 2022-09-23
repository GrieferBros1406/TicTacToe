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

let spielernameEins = "O"
let spielernameZwei = "Bot"

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
    // den klick verhindern, wenn der Bot am zug ist
    if (aktuelleKlasse === GEGNER_KLASSE) {
        return;
    }
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
   if (siegPrüfen(aktuelleKlasse) === true) {
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

    // ist der Gegner an der reihe, muss ein computer ausgeführt werden
    if (aktuelleKlasse === GEGNER_KLASSE) {
      setTimeout(computerZugAusführen, 750);
    }
}

function spielanzeigeAktualisieren() {
   // Die Klasse des aktuellen Spielers von der Spielanzeige entfernen
   spielanzeige.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
 
   // Text der Spielanzeige anpassen: je nachdem, wer gerade am Zug ist
   if (aktuelleKlasse === SPIELER_KLASSE) {
     spielanzeige.innerText = " Platzier dein Kreis.";
   } else {
     spielanzeige.innerText = "Bot Platziert sein Kreuz.";
   }
 
   // Die Klasse des Spielers, der gerade am Zug ist an die Spielanzeige hängen
   spielanzeige.classList.add(aktuelleKlasse);
 }

 function siegPrüfen(siegerKlasse) {
   // gehe alle siegeskombinationen durch
   for (const kombination of SIEG_KOMBINATIONEN) {
      // prüfe, ob alle 3 felder der gleichen klasse angehören
      const gewonnen = kombination.every(function (feld) {
         return feld.classList.contains(siegerKlasse);
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
      overlayText.innerText = " Du hast Gewonnen!";
   } else {
      overlayText.innerText = " Der Bot hat Gewonnen"
   }

   // das overlay sichtbar machen
   overlay.classList.add(SICHTBAR_KLASSE);
}

function beendenAufgeben() {
   // das overlay sichtbar machen
   overlay.classList.add(SICHTBAR_KLASSE); 
   if (aktuelleKlasse == SPIELER_KLASSE) {
      overlayText.innerText = "Du hast Aufgegeben"
   } else {
      overlayText.innerText = "Du hast Aufgegeben"
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

function dialogÖffnen(dialogId) {
   document.getElementById(dialogId).classList.add("sichtbar");
}

function dialogSchliessen(dialogId) {
   document.getElementById(dialogId).classList.remove("sichtbar");
}

function computerZugAusführen() {
    // einen spielstein auf dieses feld setzten
    if (spielsteinSetzen(bestenZugFinden()) === true) {
        zugBeenden();
    } else {
        // wähle ein anderes feld, wenn dsa fel schon besetzt war
        computerZugAusführen();
    }
}

function bestenZugFinden() {
    let besteWertung;
    let besterZug

    // alle möglichen felder durchgehen
    for (const feld of felder) {
        /* herausfidnen, wie das spiel laufen würde,
        wenn man einen spielstein auf das feld setzt*/
        if (feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE)) {
            continue;
        }

        // herausfinden, wie das spiel laufen würde, wenn man ein spielstein auf das feld setzt

        // 1. Spielstein auf das Feld setzen
        feld.classList.add(aktuelleKlasse);

        // 2. ermitteln, wie gut der zug für uns ausgehen würde
        const zugWertung = zugBewerten(true);

        // falls der zug besser war als der bisher beste, merken wir uns diesen zug
        if (besteWertung === undefined || zugWertung > besteWertung) {
            besteWertung = zugWertung;
            besterZug = feld;
        }

        // 3. Spielstein wieder vom Feld nehmen
        feld.classList.remove(aktuelleKlasse);
    }

    return besterZug;
}

function zugBewerten(istEigenerZug) {
    // der zug wurde zum sieg führen -> positives ergebnis
    if (siegPrüfen(aktuelleKlasse)) {
        return 10;
    }

    // der zug würde zur niederlage führen -> negatives ergebnis
    if(siegPrüfen(aktuelleKlasse === SPIELER_KLASSE ? GEGNER_KLASSE : SPIELER_KLASSE)) {
        return -10;
    }

    // der zug führt zum gleichstand -> neutrales ergebnis
    if(unentschiedenprüfen()) {
        return 0;
    }

    /*der zug führt noch nicht zum Ende des Spiels -> schauen, wie das Spiel weitergehen
    könte, um eine wertung ermitteln zu können*/

    if (istEigenerZug === true) {
    // den bestmöglichen gegnerzug simulieren (kleinste endpunktzahl)

    let kleinsteWertung;

    // alle möglichen züge durchgehen
    for (const feld of felder) {
        // ist das Feld bereits belegt, muss nichts getan werden
        if (feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE)) {
            continue;
        }
        
        // as würde passieren, wenn der gegner einen spielstein auf das Feld setzt?

        // 1. Gegner-Spielstein auf das Feld setzen
        feld.classList.add(aktuelleKlasse === SPIELER_KLASSE ? GEGNER_KLASSE : SPIELER_KLASSE);

        // 2. herausfinden, wie gut der zug für den Gegner wäre
        const zugWertung = zugBewerten(false);

        // Zugwertung ggf. als kleinste wertung speichern
        if (kleinsteWertung === undefined || zugWertung < kleinsteWertung) {
            kleinsteWertung = zugWertung;
        }

        // 3. Spielstein wieder vom Feld nehmen
        feld.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
    }

    return kleinsteWertung;
} else {

    // den bestmöglichen eigenen zug simulieren (größte Endpunktzahl)

    let besteWertung;

    // alle möglichen züge durchgehen
    for (const feld of felder) {
        // ist das feld bereits belegt, muss nichts getan werden
        if (feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE)) {
            continue;
        }

        // was würde passieren, wenn wir einen Spielstein auf das Feld setzen

        // 1. Spielstein auf das feld setzen
        feld.classList.add(aktuelleKlasse);

        // 2. herausfinden, wie gut der zug für uns wäre
        const zugWertung = zugBewerten(true);

        if (besteWertung === undefined || zugWertung > besteWertung) {
            besteWertung = zugWertung;
        }

        // 3. Spielstein wieder vom Feld nehmen
        feld.classList.remove(aktuelleKlasse);
    }

    return besteWertung;
    }
}