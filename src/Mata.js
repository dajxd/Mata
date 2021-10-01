import React, { useState, useEffect } from "react";
import allItems from "./AllItems";
import ThoughtCloud from "./ThoughtCloud";

export default function Mata(props) {
  const [clickedItem, setClickedItem] = useState(false);
  const [currentIdle, setCurrentIdle] = useState(
    props.isSad ? "./mata-loops/mataSadLoop.webm" : "./mata-loops/MataIdle.webm"
  );
  const [worstThing, setWorstThing] = useState(false);

  // Decide which funtion to run depending on the clicked item. The function could be in the item object instead?
  const funcReturner = (item) => {
    switch (item.type) {
      case "health":
        feedMata(item);
        break;
      case "love":
        loveMata(item);
        break;
      case "play":
        playWithMata(item);
        break;
      default:
        alert("Function returner doesn't know what to send!");
        return null;
    }
  };

  // Decide which idle video to use. I am sometimes ending up with both videos at 0 opacity. TODO: Make a ghost not transparent.
  const idleChange = (turnSad) => {
    const video = document.getElementById("idleVideo");
    video.style.opacity = 0;
    setTimeout(() => {
      turnSad
        ? (video.src = "./mata-loops/mataSadLoop.webm")
        : (video.src = "./mata-loops/MataIdle.webm");
      setCurrentIdle(video.src);
      video.style.opacity = 100;
    }, 1000);

    return currentIdle;
  };

  // Make Mata happy! Ghosts love video src changes and opacity flips. This is likely a culprit in the bug above!
  const happyMoment = () => {
    const video = document.getElementById("idleVideo");
    const happyVideo = document.getElementById("happyVid");
    happyVideo.src = "./mata-loops/mataHappyIn.webm";
    happyVideo.play();
    video.style.opacity = 0;
    happyVideo.style.opacity = 100;
    function outClip() {
      happyVideo.removeEventListener("ended", outClip);
      happyVideo.style.opacity = 0;
      video.style.opacity = 100;
      setTimeout(() => {
        happyVideo.src = "";
      }, 1000); // Waiting a full second just to be sure the transition has finished.
    }
    happyVideo.addEventListener("ended", outClip);
  };
  // This function is ridiculous. Calculates the worst of the three vitals to send to the ThoughtCloud module, and calls the idleChange function when sadness has changed.
  //                                               [   TODO: do this in App instead!   ]                   [   TODO: do this in a useEffect with a sad dependency!  ]
  useEffect(() => {
    // Get lowest vital value
    let testArray = [];
    Object.entries(props.vitals).forEach((e) => {
      testArray.push(e[1]);
    });
    let worstValue = Math.min.apply(Math, testArray);
    if (worstValue < 40) {
      switch (worstValue) {
        case props.vitals.health:
          setWorstThing("health");
          break;
        case props.vitals.love:
          setWorstThing("love");
          break;
        case props.vitals.play:
          setWorstThing("play");
          break;
        default:
          setWorstThing("IT BROKE OH NO"); // If I'm gonna be silly here, I should at least handle it in the thoughtCloud.
      }
    } else {
      setWorstThing("none");
    }
    if (props.vitals.health + props.vitals.love + props.vitals.play > 150) {
      // If Mata's vitals are good,
      if (props.isSad) {
        // if they're sad,
        props.setSad(false); // set them not sad!
        console.log("setting unnsad")
        idleChange(false); // and change the idle to the not sad version.
        // document.getElementById("cloudBox").style.opacity = 0;
      }
    } else {
      // If Mata's vitals are not good,
      if (!props.isSad) {
        // and they're not sad,
        props.setSad(true); // set them sad
        console.log("setting sad")

        idleChange(true); // and change the idle to the sad version
        setTimeout(() => {
          // document.getElementById("cloudBox").style.opacity = 100;
        }, 1000);
      }
    }
  }, [props.vitals]);

  // Function for the random item button.
  const giveRandomItem = () => {
    //  Only select from items you don't already have
    let potentialItems = [];
    let invItemNames = [];

    Object.entries(props.inventory).forEach((e) => {
      // I really need a dedicated function to turn item objects into an array of names. Oh wait, there's one in App.js.
      invItemNames.push(e[1].name);
    });
    Object.entries(allItems).forEach((e) => {
      if (!invItemNames.includes(e[0])) {
        potentialItems.push(allItems[e[0]]);
      }
    });

    // Identify a butt and disable it. You're next.
    const butt = document.getElementById("button_random");
    butt.setAttribute("disabled", true);

    // Pick a random item from the list of unobtained items.
    let randomItem =
      potentialItems[Math.floor(Math.random() * potentialItems.length)];
    if (potentialItems.length > 0) {
      // Should just check "if (randomItem)" I think
      props.addToInventory(randomItem);
    } else {
      butt.innerText = "Too many items!";
      butt.style.backgroundColor = "darkred";
    }

    setTimeout(() => {
      butt.removeAttribute("disabled");
      butt.innerText = "Random Item";
      butt.style.backgroundColor = "";
    }, 5000); // Five seconds between free items.
  };

  // Function for food item usage. Play animation, update vitals state, remove item from inventory.
  const feedMata = (item) => {
    happyMoment();
    if (document.getElementById("itemEffect")) {
      let itemDiv = document.getElementById("itemEffect");
      itemDiv.classList.remove("fader");
    }
    if (props.vitals.health >= 100) {
      props.vitalGlowEffect("health");
    }
    setClickedItem(item);

    let newVal = props.vitals.health + item.value;
    props.setVitals(
      (prev) => ({ ...prev, health: newVal }),
      props.removeFromInventory(item)
    );
  };
  // Function for love item usage. Play animation, update vitals state, remove item from inventory.
  const loveMata = (item) => {
    happyMoment();
    if (document.getElementById("itemEffect")) {
      let itemDiv = document.getElementById("itemEffect");
      itemDiv.classList.remove("fader");
    }
    if (props.vitals.love >= 100) {
      props.vitalGlowEffect("love");
    }
    setClickedItem(item);

    let newVal = props.vitals.love + item.value;
    props.setVitals(
      (prev) => ({ ...prev, love: newVal }),
      props.removeFromInventory(item)
    );
  };
  // Function for play item usage. Play animation, update vitals state, remove item from inventory.
  const playWithMata = (item) => {
    happyMoment();
    if (isNaN(item)) {
      if (document.getElementById("itemEffect")) {
        let itemDiv = document.getElementById("itemEffect");
        itemDiv.classList.remove("fader");
      }
      if (props.vitals.play >= 100) {
        props.vitalGlowEffect("play");
      }
      setClickedItem(item);

      let newVal = props.vitals.play + item.value;
      props.setVitals(
        (prev) => ({ ...prev, play: newVal }),
        props.removeFromInventory(item)
      );
    } else {
      let newVal = props.vitals.play + item;
      props.setVitals(
        (prev) => ({ ...prev, play: newVal }),
        props.removeFromInventory(item)
      );
    }
  };

  // Make the big woosh-y background item when an clickedItem is changed.
  useEffect(() => {
    if (clickedItem) {
      let itemDiv = document.getElementById("itemEffect");
      itemDiv.classList.add("fader");
    }
    setTimeout(() => {
      setClickedItem(null);
    }, 1000);
  }, [clickedItem]);


  return (
    <div id="wrapperDiv">
    {/* <h1 id="dev">{props.vitals.health + props.vitals.love + props.vitals.play} {props.isSad  && "sad"}</h1> */}
      {clickedItem && <div id="itemEffect">{clickedItem.icon}</div>}
      <div id="timeAway">
        <h1>{props.awayMessage}</h1>
      </div>
      <div
        id="imageDiv"
        // Should be its own function.
        onClick={() => {
          const iD = document.getElementById("imageDiv");
          if (
            iD.classList.contains("hideInItems") ||
            iD.classList.contains("hideL") ||
            iD.classList.contains("hideC") ||
            iD.classList.contains("hideR")
          ) {
            // Award thirty play points, Mata loves them some hide-and-seek.
            playWithMata(30);
            // Not hiding anymore!
            props.setIsHiding(false);
            // Add the transition animation, and then remove it in case he hides again TODO: keep the transition 'cause I want him to hide randomly (not just on the occaisional page load)
            document.getElementById("imageDiv").classList =
              "imageDivTransition"; // No more hide-y class.
            setTimeout(() => {
              document
                .getElementById("imageDiv")
                .classList.remove("imageDivTransition"); // No more transition (after the 1 second it takes to happen)
            }, 1000);

            giveRandomItem();
          }
        }}
      >
        <ThoughtCloud worstThing={worstThing} isHiding={props.isHiding} />

        <video
          id="idleVideo"
          className="vids"
          width="600"
          src={currentIdle}
          muted
          loop
          autoPlay
          playsInline
          preload="true"
        ></video>
        <video
          id="happyVid"
          className="vids"
          width="600"
          muted
          playsInline
          preload="true"
        ></video>
      </div>
      <span id="aliveTime">Time Alive: {props.timeAlive[0]}</span>
      <div id="buttons">
        {props.activeInventory
          .sort(function (a, b) {
            if (a.type[0] > b.type[0]) {
              return -1;
            }
            return 1;
          })
          .map((item, idx) => (
            <button
              key={"button_" + idx}
              className="actionButton"
              id={"button_" + idx}
              onClick={() => {
                funcReturner(item);
              }}
            >
              {item.icon}
              <br />
              <span>{item.phrase}</span>
            </button>
          ))}
        <button
          key={"button_" + 4}
          className="actionButton"
          id={"button_random"}
          onClick={() => {
            giveRandomItem();
          }}
        >
          <span>Random Item</span>
        </button>
      </div>
      
    </div>
  );
}
