import React, { useState, useEffect } from "react";
import allItems from "./AllItems";
import ThoughtCloud from "./ThoughtCloud";

export default function Mata(props) {
  const [vitals, setVitals] = useState(props.vitals);
  const [clickedItem, setClickedItem] = useState(false);
  const [currentIdle, setCurrentIdle] = useState(
    props.isSad ? "./mata-loops/mataSadLoop.webm" : "./mata-loops/MataIdle.webm"
  );
  const [sad, setSad] = useState(props.isSad);
  const [isHiding, setIsHiding] = useState(false);
  const [worstThing, setWorstThing] = useState(false);
  const [timeAlive, setTimeAlive] = useState(false);
  const [awayMessage, setAwayMessage] = useState(false);
  const decay = 1;
  const decayRate = 5000;

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
        alert("func returner broke");
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
    Object.entries(vitals).forEach((e) => {
      testArray.push(e[1]);
    });
    let worstValue = Math.min.apply(Math, testArray);
    if (worstValue < 40) {
      switch (worstValue) {
        case vitals.health:
          setWorstThing("health");
          break;
        case vitals.love:
          setWorstThing("love");
          break;
        case vitals.play:
          setWorstThing("play");
          break;
        default:
          setWorstThing("IT BROKE OH NO"); // If I'm gonna be silly here, I should at least handle it in the thoughtCloud.
      }
    } else {
      setWorstThing("none");
    }
    if (vitals.health + vitals.love + vitals.play > 125) {
      // If Mata's vitals are good,
      if (sad) {
        // if they're sad,
        setSad(false); // set them not sad!
        idleChange(false); // and change the idle to the not sad version.
        // document.getElementById("cloudBox").style.opacity = 0;
      }
    } else {
      // If Mata's vitals are not good,
      if (!sad) {
        // and they're not sad,
        setSad(true); // set them sad
        idleChange(true); // and change the idle to the sad version
        setTimeout(() => {
          // document.getElementById("cloudBox").style.opacity = 100;
        }, 1000);
      }
    }
  }, [vitals]);

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
    setClickedItem(item);

    let newVal = vitals.health + item.value;
    setVitals(
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
    setClickedItem(item);

    let newVal = vitals.love + item.value;
    setVitals(
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
      setClickedItem(item);

      let newVal = vitals.play + item.value;
      setVitals(
        (prev) => ({ ...prev, play: newVal }),
        props.removeFromInventory(item)
      );
    } else {
      let newVal = vitals.play + item;
      setVitals(
        (prev) => ({ ...prev, play: newVal }),
        props.removeFromInventory(item)
      );
    }
  };

  // Calculate how long Mata has been kept happy and alive. (or dead!)
  const getTimeDiff = (returnAliveTime) => {
    let dateDiff;
    if (returnAliveTime) {
      dateDiff = Date.now() - props.startDate;
    } else {
      dateDiff = Date.now() - props.lastVisited;
    }
    let dayCount = Math.floor(dateDiff / 86400000);
    dateDiff -= dayCount * 86400000;
    let hourCount = Math.floor(dateDiff / 3600000);
    dateDiff -= hourCount * 3600000;
    let minuteCount = Math.floor(dateDiff / 60000);
    return [
      `${dayCount} days, ${hourCount} hours, and ${minuteCount} minutes`,
      minuteCount,
    ];
  };

  // Main function for vital decay over time.
  const liveTimePassing = () => {
    // Vital decay
    let newHVal, newPVal, newLVal;
    setVitals((prev) => {
      if (prev.health > 0) {
        newHVal = prev.health - decay;
      } else {
        newHVal = prev.health;
      }
      if (prev.play > 0) {
        newPVal = prev.play - decay - 1;
      } else {
        newPVal = prev.play;
      }
      if (prev.love > 0) {
        // Should decay based on last visit?
        newLVal = prev.love - decay;
      } else {
        newLVal = prev.love;
      }

      return { health: newHVal, love: newLVal, play: newPVal };
    });

    // timeAlive calculation
    setTimeAlive(getTimeDiff(true));
    // Cookie update
    props.updateVitalCookies(
      { health: newHVal, love: newLVal, play: newPVal },
      sad ? 1 : 0
    );
    props.updateLastVisited();
  };

  // Update the vital cookies every time the vitals change.
  useEffect(() => {
    props.updateVitalCookies(vitals);
  }, [vitals]);

  // Update the sad cookies every time the sadness changes. TODO: use this useEffect to help out the Ridiculous Function.
  useEffect(() => {
    props.updateSadCookies(sad ? 1 : 0);
  }, [sad]);

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

  // Set liveTimePassing, make vitals reflect how long it's been since Mata was loaded, and add hide chance TODO: Mata should not only hide on page refresh. Should do it randomly (with a transition to the target spot, if a quick one.)
  useEffect(() => {
    // Adjust vitals based on time away
    setTimeAlive(getTimeDiff(true));
    props.updateLastVisited();
    let timeData = getTimeDiff(false);
    let text = timeData[0];
    if (timeData[1] > 1) {
      setAwayMessage(`You've been away for ${text}`); // Gotta guilt 'em!
    }

    setTimeout(() => {
      document.getElementById("timeAway").style.opacity = 0; // And then make the guilt invisible.
    }, 4000); // ...after four seconds.
    let hoursAway = Math.floor((Date.now() - props.lastVisited) / 3600000); // Calculate how many hours have passed to wear away Mata's vital accordingly.
    setVitals((prev) => {
      // Still not sure exactly how much to wear them away.
      let newHVal, newPVal, newLVal;
      // console.log(`decaying ${decay * hoursAway * 0.5} from each category. ${hoursAway} hours away.`)

      // This is a dumb way to do this, TODO: undumb this.

      if (prev.health > 0) {
        newHVal = prev.health - decay * hoursAway * 0.5;
      } else {
        newHVal = prev.health;
      }
      if (prev.play > 0) {
        newPVal = prev.play - decay * hoursAway * 0.5;
      } else {
        newPVal = prev.play;
      }
      if (prev.love > 0) {
        newLVal = prev.love - decay * hoursAway * 0.5;
      } else {
        newLVal = prev.love;
      }
      return { health: newHVal, love: newLVal, play: newPVal };
    });
    // Set interval for the time passing function. TODO: make this a different hook.
    const intervalId = setInterval(() => {
      liveTimePassing();
    }, decayRate);

    // Calculate whether or not Mata will be hiding on page load. 1 in 11 chance.
    let doesHeHide = new Array(40);
    doesHeHide.fill("none");
    doesHeHide.push("hideInItems", "hideL", "hideC", "hideR");
    let choice = Math.floor(Math.random() * (doesHeHide.length - 1));
    choice = doesHeHide[choice];
    document.getElementById("imageDiv").classList.add(choice);
    if (choice === "none") {
      setIsHiding(false);
    } else {
      setIsHiding(true);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div id="wrapperDiv">
      {clickedItem && <div id="itemEffect">{clickedItem.icon}</div>}
      <div id="timeAway">
        <h1>{awayMessage}</h1>
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
            setIsHiding(false);
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
        <ThoughtCloud worstThing={worstThing} isHiding={isHiding} isSad={sad} />

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
      <span id="aliveTime">Time Alive: {timeAlive[0]}</span>
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
      <div id="vitalBars">
        {/*TODO: make it glow if you try to go over 100! And make it its own darn module*/}
        <div id="playBarOuter" class="barOuter">
          <div id="playBar" style={{ height: vitals.play + "%" }}></div>
        </div>
        <div id="loveBarOuter" class="barOuter">
          <div id="loveBar" style={{ height: vitals.love + "%" }}></div>
        </div>
        <div id="healthBarOuter" class="barOuter">
          <div id="healthBar" style={{ height: vitals.health + "%" }}></div>
        </div>
      </div>
    </div>
  );
}
