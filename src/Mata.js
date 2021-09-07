import React, { useState, useEffect } from "react";
import allItems from "./AllItems";
import fakeCookies from "./fakeCookies";
import ThoughtCloud from "./ThoughtCloud";

export default function Mata(props) {
  const [vitals, setVitals] = useState(fakeCookies.vitals);
  const [clickedItem, setClickedItem] = useState(false);
  const [currentIdle, setCurrentIdle] = useState("./mata-loops/MataIdle.webm"); // get from cookies
  const [sad, setSad] = useState(false); // get from cookies
  const [worstThing, setWorstThing] = useState(false);
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
    if (vitals.health > 40 && vitals.love > 40 && vitals.play > 40) {
      if (sad) {
        setSad(false);
        idleChange(false);

        document.getElementById("cloudBox").style.opacity = 0;
      }
    } else {
      if (!sad) {
        idleChange(true);
        setSad(true);
        setTimeout(() => {
          document.getElementById("cloudBox").style.opacity = 100;
        }, 1000);
      }
    }
  }, [vitals]);

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

  const liveTimePassing = () => {
    const decay = 1;
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
    console.log(newPVal, newLVal, newHVal);
  };
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
  // set liveTimePassing, add hide chance
  useEffect(() => {
    const intervalId = setInterval(() => {
      liveTimePassing();
    }, 5000);
    let doesHeHide = new Array(40);
    doesHeHide.fill("none");
    doesHeHide.push("hideInItems", "hideL", "hideC", "hideR");
    let choice = Math.floor(Math.random() * (doesHeHide.length - 1));
    choice = doesHeHide[choice];
    // choice = "hideC"; 
    document.getElementById("imageDiv").classList.add(choice);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div id="wrapperDiv">
      {clickedItem && <div id="itemEffect">{clickedItem.icon}</div>}
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
            // add the transition animation, and then remove it in case he hides again
            document.getElementById("imageDiv").classList =
              "imageDivTransition";
            setTimeout(() => {
              document
                .getElementById("imageDiv")
                .classList.remove("imageDivTransition");
            }, 1000);

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

            let randomItem =
              potentialItems[Math.floor(Math.random() * potentialItems.length)];
            props.addToInventory(randomItem);
          }
        }}
      >
        <ThoughtCloud worstThing={worstThing} />

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
      </div>
    </div>
  );
}
