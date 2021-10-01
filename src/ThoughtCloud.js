import React, { useState, useEffect } from "react";
import { phrases } from "./Phrases";
export default function ThoughtCloud(props) {
  const [prevWorst, setPrevWorst] = useState(false);
  const [prevPhrase, setPrevPhrase] = useState(false);
  let chosenPhrase;
  if (props.worstThing) {
    if (props.worstThing !== prevWorst) {
      const options = phrases[props.worstThing];
      let randomIndex = Math.floor(Math.random() * options.length);
      chosenPhrase = options[randomIndex];
      setPrevPhrase(chosenPhrase);
      setPrevWorst(props.worstThing);
    } else {
      chosenPhrase = prevPhrase;
    }
  } else {
    chosenPhrase = "";
  }

  useEffect(() => {
    if (props.isHiding) {
      document.getElementById("cloudBox").style.opacity = 0;
    } else if (!props.isHiding) {
      document.getElementById("cloudBox").style.opacity = 100;
    }
  }, [props.isHiding]);

  return (
    <div id="cloudBox">
      <video
        id="thoughtCloudVideo"
        src="mataThoughtCloud.webm"
        muted
        loop
        autoPlay
        playsInline
        preload="true"
      ></video>
      <div id="thoughtCloudTextContainer">
        <div id="thoughtCloudItem">
          <span>{chosenPhrase}</span>
        </div>
      </div>
    </div>
  );
}
