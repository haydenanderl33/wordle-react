import "./App.css";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const App = () => {
  const [wordle, setWordle] = useState("APPLE");
  const [wordBank, setWordBank] = useState();

  const [currentTile, setCurrentTile] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [guessRows, setGuessRows] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  const [keys, setKeys] = useState([
    {
      lettR: "Q",
      coloR: "",
    },
    {
      lettR: "W",
      coloR: "",
    },
    {
      lettR: "E",
      coloR: "",
    },
    {
      lettR: "R",
      coloR: "",
    },
    {
      lettR: "T",
      coloR: "",
    },
    {
      lettR: "Y",
      coloR: "",
    },
    {
      lettR: "U",
      coloR: "",
    },
    {
      lettR: "I",
      coloR: "",
    },
    {
      lettR: "O",
      coloR: "",
    },
    {
      lettR: "P",
      coloR: "",
    },
    {
      lettR: "A",
      coloR: "",
    },
    {
      lettR: "S",
      coloR: "",
    },
    {
      lettR: "D",
      coloR: "",
    },
    {
      lettR: "F",
      coloR: "",
    },
    {
      lettR: "G",
      coloR: "",
    },
    {
      lettR: "H",
      coloR: "",
    },
    {
      lettR: "J",
      coloR: "",
    },
    {
      lettR: "K",
      coloR: "",
    },
    {
      lettR: "L",
      coloR: "",
    },
    {
      lettR: "ENTER",
      coloR: "",
    },
    {
      lettR: "Z",
      coloR: "",
    },
    {
      lettR: "X",
      coloR: "",
    },
    {
      lettR: "C",
      coloR: "",
    },
    {
      lettR: "V",
      coloR: "",
    },
    {
      lettR: "B",
      coloR: "",
    },
    {
      lettR: "N",
      coloR: "",
    },
    {
      lettR: "M",
      coloR: "",
    },
    {
      lettR: "<<",
      coloR: "",
    },
  ]);

  useEffect(() => {
    getRandomWordFromBank();
  }, []);

  const getRandomWordFromBank = () => {
    fetch("word-bank.json")
      .then((res) => res.json())
      .then((data) => {
        setWordBank(data);
        let randomNumber = Math.floor(Math.random() * data.length);
        let randomWord = data[randomNumber];
        console.log(randomWord.toUpperCase());
        setWordle(randomWord.toUpperCase());
      });
  };

  const handleClick = (letter) => {
    if (!gameOver) {
      if (letter.lettR === "<<") {
        deleteLetter();

        return;
      }
      if (letter.lettR === "ENTER") {
        checkRow();
        return;
      }

      let letterObj = { ...letter };
      letterObj.coloR = "";

      addLetter(letterObj);
    }
  };

  const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
      let guess = [...guessRows];

      guess[currentRow][currentTile] = letter;

      setCurrentTile(currentTile + 1);

      setGuessRows(guess);
    }
  };

  const deleteLetter = () => {
    if (currentTile > 0) {
      setCurrentTile(currentTile - 1);

      let guess = [...guessRows];

      guess[currentRow][currentTile - 1] = "";

      setGuessRows(guess);
    }
  };

  const checkIfWordExists = (guessWord) => {
    let result = wordBank.filter((word) => word === guessWord);

    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const flipTiles = () => {
    let guessRowCopy = [...guessRows];
    let guess = [...guessRows];
    let guessLetters = guess[currentRow].map((e) => e);
    let checkWordle = wordle;
    let guessArray = [];

    guessLetters.forEach((e, i) => {
      e.coloR = "#3a3a3c";
      guessArray.push(e);
    });

    guessArray.forEach((guess, index) => {
      if (guess.lettR === wordle[index]) {
        guess.coloR = "#538d4e";
        checkWordle = checkWordle.replace(guess.lettR, "");
      }
    });
    guessArray.forEach((guess, index) => {
      if (checkWordle.includes(guess.lettR)) {
        guess.coloR = "#b59f3a";
        checkWordle = checkWordle.replace(guess.lettR, "");
      }
    });

    let keysCopy = [...keys];

    guessArray.forEach((e, i) => {
      for (let i = 0; i < keysCopy.length; i++) {
        if (e.lettR === keysCopy[i].lettR) {
          keysCopy[i].coloR = e.coloR;
        }
      }
    });
    keysCopy.forEach((e, i) => {
      for (let i = 0; i < guessArray.length; i++) {
        if (e.coloR === "#538d4e") {
          e.coloR = "#538d4e";
        }
      }
    });

    console.log("guessArray:", guessArray);

    setKeys(keysCopy);

    setGuessRows(guessRowCopy);
  };

  const checkRow = () => {
    let guess = [...guessRows];
    let guessLetters = guess[currentRow].map((e) => e.lettR).join("");

    let word = checkIfWordExists(guessLetters);
    // let word = true;

    if (word === false) {
      toast.error("Word Not Found", { position: "", duration: 4000 });
      return;
    } else {
      if (currentTile > 4) {
        flipTiles();
        if (wordle === guessLetters) {
          toast.success("Magnificent", { position: "", duration: 4000 });
          // toast.success("Magnificent",{style: {marginTop: '64px', duration: 4000 }});
          setGameOver(true);
          return;
        } else {
          if (currentRow >= 5) {
            toast.error("Game Over", { position: "", duration: 4000 });
            setTimeout(() => {
              toast(
                "Answer in ...3 ...2 ...1",
                { icon: "🧐" },
                { position: "", duration: 4000 }
              );
            }, 4000);
            setTimeout(() => {
              toast(
                `Wordle was ${wordle}`,
                { icon: "🙁" },
                { position: "", duration: 6000 }
              );
            }, 8000);
            setGameOver(true);
            return;
          }
          if (currentRow < 5) {
            setCurrentRow(currentRow + 1);
            setCurrentTile(0);
          }
        }
      }
    }
  };

  return (
    <div className="game-container">
      <Toaster />
      <div className="title-container">
        <h1>Wordle</h1>
      </div>
      <div className="message-container"></div>
      <div className="tile-container">
        {guessRows.map((e, i) => {
          return (
            <div key={i}>
              {e.map((e, i) => {
                return (
                  <div
                    key={i}
                    className="tile"
                    style={{ backgroundColor: e.coloR }}
                  >
                    {e.lettR}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="key-container">
        {keys.map((e, index) => {
          return (
            <button
              key={index}
              style={{ backgroundColor: e.coloR }}
              onClick={() => handleClick(e)}
            >
              {e.lettR}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;
