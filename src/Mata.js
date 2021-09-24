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

  const funcReturner = (item) => {
    switch (item.type) {
      case "health":
        feedMata(item);
        break;
      case "love":
        visitMata(item);
        break;
      case "play":
        playWithMata(item);
        break;
      default:
        alert("func returner broke");
        return null;
    }
  };

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
      }, 1000);
    }
    happyVideo.addEventListener("ended", outClip);
  };
  // idle handler, sad setter, cloud opacity, worstThing
  useEffect(() => {
    // get smallest vital value

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
          setWorstThing("IT BROKE OH NO");
      }
    } else {
      setWorstThing("none");
    }
    if (vitals.health + vitals.love + vitals.play > 125) {
      if (sad) {
        setSad(false);
        idleChange(false);
        document.getElementById("cloudBox").style.opacity = 0;
      }
    } else {
      if (!sad) {
        // console.log("changing to sad idle");
        idleChange(true);
        setSad(true);
        setTimeout(() => {
          document.getElementById("cloudBox").style.opacity = 100;
        }, 1000);
      }
    }
  }, [vitals]);
  const giveRandomItem = () => {
    //  only select from items you don't already have
    let potentialItems = [];
    let invItemNames = [];

    Object.entries(props.inventory).forEach((e) => {
      invItemNames.push(e[1].name);
    });
    Object.entries(allItems).forEach((e) => {
      if (!invItemNames.includes(e[0])) {
        potentialItems.push(allItems[e[0]]);
      }
    });
    const butt = document.getElementById("button_random");
    butt.setAttribute("disabled", true);
    let randomItem =
      potentialItems[Math.floor(Math.random() * potentialItems.length)];
    if (potentialItems.length > 0) {
      props.addToInventory(randomItem);
    } else {
      butt.innerText = "Too many items!";
      butt.style.backgroundColor = "darkred";
    }

    setTimeout(() => {
      butt.removeAttribute("disabled");
      butt.innerText = "Random Item";
      butt.style.backgroundColor = "";
    }, 5000);
  };
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
  const visitMata = (item) => {
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
  const getTimeDiff = (wantsAlive) => {
    // console.log("alive time: ", wantsAlive);
    let dateDiff;
    if (wantsAlive) {
      dateDiff = Date.now() - props.startDate;
    } else {
      dateDiff = Date.now() - props.lastVisited;
    }
    // console.log(dateDiff);
    let dayCount = Math.floor(dateDiff / 86400000);
    // console.log("days", dayCount);
    dateDiff -= dayCount * 86400000;
    let hourCount = Math.floor(dateDiff / 3600000);
    // console.log("hours", hourCount);
    dateDiff -= hourCount * 3600000;
    let minuteCount = Math.floor(dateDiff / 60000);
    // console.log("minutes", minuteCount);
    return [
      `${dayCount} days, ${hourCount} hours, and ${minuteCount} minutes`,
      minuteCount,
    ];
  };
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
        // should decay based on last visit
        newLVal = prev.love - decay;
      } else {
        newLVal = prev.love;
      }

      return { health: newHVal, love: newLVal, play: newPVal };
    });
    // console.log(newPVal, newLVal, newHVal);

    // timeAlive calculation
    setTimeAlive(getTimeDiff(true));
    // Cookie update
    props.updateVitalCookies(
      { health: newHVal, love: newLVal, play: newPVal },
      sad ? 1 : 0
    );
    props.updateLastVisited();
  };

  useEffect(() => {
    props.updateVitalCookies(vitals);
  }, [vitals]);

  useEffect(() => {
    // console.log("uE", sad);
    props.updateSadCookies(sad ? 1 : 0);
  }, [sad]);

  // itemEffect handler
  useEffect(() => {
    if (clickedItem) {
      let itemDiv = document.getElementById("itemEffect");
      itemDiv.classList.add("fader");
    }
    setTimeout(() => {
      setClickedItem(null);
    }, 1000);
  }, [clickedItem]);

  // Set liveTimePassing, add hide chance
  useEffect(() => {
    // Adjust vitals based on time away
    setTimeAlive(getTimeDiff(true));
    props.updateLastVisited();
    let timeData = getTimeDiff(false);
    let text = timeData[0];
    if (timeData[1] > 1) {
      setAwayMessage(`You've been away for ${text}`);
    }

    setTimeout(() => {
      document.getElementById("timeAway").style.opacity = 0;
    }, 4000);
    let hoursAway = Math.floor((Date.now() - props.lastVisited) / 3600000);
    setVitals((prev) => {
      let newHVal, newPVal, newLVal;
      // console.log(`decaying ${decay * hoursAway * 0.5} from each category. ${hoursAway} hours away.`)
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
        // should decay based on last visit
        newLVal = prev.love - decay * hoursAway * 0.5;
      } else {
        newLVal = prev.love;
      }

      return { health: newHVal, love: newLVal, play: newPVal };
    });
    const intervalId = setInterval(() => {
      liveTimePassing();
    }, decayRate);
    let doesHeHide = new Array(40);
    doesHeHide.fill("none");
    doesHeHide.push("hideInItems", "hideL", "hideC", "hideR");
    let choice = Math.floor(Math.random() * (doesHeHide.length - 1));
    choice = doesHeHide[choice];
    // choice = "hideC";
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
        // certainly should be its own function.
        onClick={() => {
          const iD = document.getElementById("imageDiv");
          if (
            iD.classList.contains("hideInItems") ||
            iD.classList.contains("hideL") ||
            iD.classList.contains("hideC") ||
            iD.classList.contains("hideR")
          ) {
            // award thirty play points
            playWithMata(30);
            // not hiding anymore!
            setIsHiding(false);
            // add the transition animation, and then remove it in case he hides again
            document.getElementById("imageDiv").classList =
              "imageDivTransition";
            setTimeout(() => {
              document
                .getElementById("imageDiv")
                .classList.remove("imageDivTransition");
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
        {/* make it glow if you try to go over 100! And maybe make it its own module*/}
        <div id="playBarOuter" class="barOuter"><div id="playBar" style={{height: vitals.play + '%'}}></div></div>
        <div id="loveBarOuter" class="barOuter"><div id="loveBar" style={{height: vitals.love + '%'}}></div></div>
        <div id="healthBarOuter" class="barOuter"><div id="healthBar" style={{height: vitals.health + '%'}}></div></div>
      </div>
    </div>
  );
}
