import React from "react";
export default function VitalMonitor(props) {
  return (
    <div id="vitalBarSection">
      <div id="vitalBars">
        {/*TODO: make it glow if you try to go over 100! And make it its own darn module*/}

        <div id="playBarOuter" className="barOuter">
          <div 
          id="playBar" 
          style={{ height: props.vitals.play + "%" }}
          ></div>
        </div>
        <div id="loveBarOuter" className="barOuter">
          <div 
          id="loveBar" 
          style={{ height: props.vitals.love + "%" }}
          ></div>
        </div>
        <div id="healthBarOuter" className="barOuter">
          <div
            id="healthBar"
            style={{ height: props.vitals.health + "%" }}
          ></div>
        </div>
      </div>
      <div id="vitalBarLabels">
        <span class="vitalBarLabel">Boredom</span>
        <span class="vitalBarLabel">Loneliness</span>
        <span class="vitalBarLabel">Hunger</span>
      </div>
    </div>
  );
}
