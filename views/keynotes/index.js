// jshint esversion: 9 
const notes = document.getElementsByClassName("note");

// --------------------- Poor Solution ---------------------------

// for (let i = 0; i < notes.length; i++) {
//   let id = notes[i].id;
//   eval("var audio_" + id + " = new Audio('/sounds/" + id + ".wav');");
//   let keyChar = "audio_"+id;
//   notes[i].addEventListener("click", function () {
//     playNote(eval(keyChar));
//   });
// }
// --------------------- Better Solution ---------------------------

function clicked(key) {
  var pressedKey = document.querySelector("#" + key);
  pressedKey.classList.add("white-active");
  setTimeout(function () {
    pressedKey.classList.remove("white-active");
  }, 50);
}

function playAudio(id) {
  let audio = new Audio("public/assets/sounds/" + id + ".wav");
  let volControl = document.getElementById("vol-control");
  audio.volume = parseFloat(volControl.value) / 100;
  audio.play();
  // --- solution for too many media instances --- //
  audio.onended = function () {
    this.currentSrc = null;
    this.src = "";
    this.srcObject = null;
    this.remove();
  };
}

function playSound(key) {
  switch (key) {
    case "a":
      clicked("c");
      playAudio("gs");
      break;
    case "w":
      clicked("cs");
      playAudio("a");
      break;
    case "s":
      clicked("d");
      playAudio("as");
      break;
    case "e":
      clicked("ds");
      playAudio("b");
      break;
    case "d":
      clicked("e");
      playAudio("cs");
      break;
    case "j":
      clicked("f");
      playAudio("c");
      break;
    case "i":
      clicked("fs");
      playAudio("d");
      break;
    case "k":
      clicked("g");
      playAudio("ds");
      break;
    case "o":
      clicked("gs");
      playAudio("e");
      break;
    case "l":
      clicked("a");
      playAudio("fs");
      break;
    case "p":
      clicked("as");
      playAudio("f");
      break;
    case ";":
      clicked("b");
      playAudio("g");
      break;
  }
}
let playableKeys = [];
for (let i = 0; i < notes.length; i++) {
  playableKeys.push(notes[i].innerText);
  let id = notes[i].id;
  notes[i].addEventListener("click", function () {
    playAudio(id);
  });
}

window.addEventListener("keydown", function (event) {
  playSound(event.key);
});
// ------------------- THE GAME ----------------------------

const keys = $(".note");
function randomKey() {
  return keys[Math.floor(Math.random() * keys.length)];
}
function playRandomKey() {
  playSound(randomKey().innerText);
  return randomKey().innerText;
}

function startGame() {
  playerSequence = [];
  gameSequence = [];
  createGameSequence(3);
  setTimeout(playGameSequence, 1000);
  startPlayerSequence();
  $("#play").addClass("hide");
  $("#record").addClass("hide");
  $("#stop").addClass("hide");
  $("#play-record").addClass("hide");
}

$("#play").click(startGame);
$(document).on("keypress", function (e) {
  if (event.key == " ") {
    if (gameOn == false) {
      if (score > 0) {
        playNext();
      } else {
      }
    }
  }
});

let gameSequence = [];
let level = 1;
let gameOn = false;
// ---------------- Create game sequence --------------------//
function createGameSequence(level) {
  for (let i = 0; i < level; i++) {
    gameSequence.push(randomKey().innerText);
  }
}

// --------------- CHOOSE PLAYBACK SPE ---------------------//
let playSpeed = 1000;
$(".speed").click(function (clicked) {
  // console.log($(this))
  $(this).addClass("selected-button");
  $(this).siblings().removeClass("selected-button");
  switch ($(this)[0].innerText) {
    case "Normal":
      playSpeed = 1000;
      break;
    case "Fast":
      playSpeed = 600;
      break;
    case "Faster":
      playSpeed = 300;
  }
});
// --------------- PLAY AUDIO with async timer ---------------------//
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

async function playGameSequence() {
  for (let i = 0; i < gameSequence.length; i++) {
    playSound(gameSequence[i]);
    await timer(playSpeed);
  }
  console.log(gameSequence);
}

// --------------- NEXT LEVEL --------------------//
function nextLevelSequence() {
  gameSequence.push(randomKey().innerText);
}
// -------------------------------------PLAY NEXT ----------------------------------------//
let score = 0;
let playerSequence = [];
let nextLevel = $("#next-level");

function playNext() {
  nextLevelSequence();
  setTimeout(playGameSequence, 1000);
  startPlayerSequence();
  nextLevel.addClass("hide");
  $(".progress-bar").width(0);
}
nextLevel.click(playNext);

function startPlayerSequence() {
  playerSequence = [];
  playerSequenceLength = playerSequence.length;
  // playerSequence[playerSequenceLength] == gameSequence[playerSequenceLength];

  function checkIfCorrect() {
    let progressBar = Math.floor(
      (playerSequence.length / gameSequence.length) * 100
    );
    $(".progress-bar").width(`${progressBar}%`);

    function removeListeners() {
      window.removeEventListener("keydown", appendPlayerSequence);
      $(".note").off();
    }
    // == wrong == //
    function wrong() {
      nextLevel.addClass("hide");
      $("#play").removeClass("hide");
      $("#record").removeClass("hide");
      $(".score").text(`GAME OVER: Your score is: ${score}`);
      removeListeners();
      score = 0;
      gameOn = false;
      playerSequence = [];
      gameSequence = [];
      $(".progress-bar").width(0);
    }
    // === correct == //
    function correct() {
      console.log("Correct");
      score++;
      $(".score").text(`CORRECT! Your score is now: ${score}`);
      nextLevel.removeClass("hide");
      removeListeners();
      gameOn = false;
    }
    if (playerSequence.length < gameSequence.length) {
      if (
        playerSequence[playerSequence.length - 1] !=
        gameSequence[playerSequence.length - 1]
      ) {
        wrong();
      }
    } else if (playerSequence.length >= gameSequence.length) {
      // --------------- WINNING -------------------------//
      if (playerSequence.join() == gameSequence.join()) {
        correct();

        // --------------- LOOSING -------------------------//
      } else {
        wrong();
      }
    }
  }

  if (!gameOn) {
    function appendPlayerSequence(event) {
      if (playableKeys.indexOf(event.key) > -1) {
        playerSequence.push(event.key);
        checkIfCorrect();
      }
    }
    function appendPlayerSequenceMouse(event) {
      playerSequence.push(event.target.innerText);
      checkIfCorrect();
    }
    function addListeners() {
      window.addEventListener("keydown", appendPlayerSequence);
      $(".note").click(appendPlayerSequenceMouse);
    }
    addListeners();
    gameOn = true;
  }
}
// --------------------------------RECORD--------------------------------------------//
let recordedSequence = [0];
function stopRecording() {
  $(document).off();
  $(".score").text(`Recording Stopped`);
  $("#stop").addClass("hide");
  // $("#record").removeClass("hide");
  // $("#play").removeClass("hide");
  $("#play-record").removeClass("hide");
}
function startRecording() {
  $("#record").addClass("hide");
  $("#play").addClass("hide");
  $("#stop").removeClass("hide");

  $(".score").text(`Press SPACE to stop recording`);
  recordedSequence = [];
  $(document).keydown(function (event) {
    if (playableKeys.indexOf(event.key) > -1) {
      recordedSequence.push(event);
    }
    if (event.key == " ") {
      stopRecording();
    }
  });
}
function playRecordedSequence() {
  $(".progress-bar").width(0);
  if (recordedSequence[0] == undefined) {
    $(".score").text(`The Record is empty. Try again`);
    $("#play-record").addClass("hide");
  } else {
    
    let firstNote = recordedSequence[0].timeStamp;
    let lastNote = recordedSequence[recordedSequence.length-1].timeStamp;
    let timings = [];
    recordedSequence.forEach(function (note) {
      timings.push(note.timeStamp - firstNote);
    });


    $("#play-record").addClass("hide");
    setTimeout(function () {
      $("#play-record").removeClass("hide");
      $("#stop").removeClass("hide");
    }, lastNote-firstNote);


    for (let i = 0; i < recordedSequence.length; i++) {
      setTimeout(function () {
        // --- progress bar -----
        let progressBar = Math.floor(
          ((recordedSequence[i].timeStamp - firstNote) / (lastNote-firstNote)) * 100
        );
        console.log(progressBar);
        $(".progress-bar").width(`${progressBar}%`);
        //  ----------------------
        playSound(recordedSequence[i].key);
      }, recordedSequence[i].timeStamp - firstNote);
    }
    
  }
  $(".progress-bar").width(0);
}
$("#record").click(startRecording);
$("#stop").click(stopRecording);
$("#play-record").click(playRecordedSequence);
