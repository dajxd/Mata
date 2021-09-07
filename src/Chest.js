/* eslint-disable no-useless-constructor */
import React from "react";
import allItems from "./AllItems";

class Chest extends React.Component {
  constructor() {
    super();
    
    let itemNames = [];
    Object.entries(allItems).forEach((e) => {
      itemNames.push(e[0]);
    });
    let sixRandomItems = [];
    let c = 0;
    while (c < 7) {
      sixRandomItems.push(allItems[itemNames[Math.floor(Math.random() * 6)]]);
      c += 1;
    }
    this.state = { randomItems: sixRandomItems, rot: 2};

    this.turnChest = this.turnChest.bind(this);
  }
  turnChest() {
    const chest = document.getElementById("chest");
    chest.style.transform = "rotateX(" + this.state.rot + "deg) rotateY(" + (this.state.rot+10)/2 + "deg) rotateZ(" + (this.state.rot+30)/4 + "deg)";
    this.setState((prev) => ({randomItems: prev.randomItems, rot: prev.rot+400}))
  }

  render() {
    return (
      <div
        id="chestOuter"
        onClick={(e) => {
          this.turnChest();
        }}
      >
        <div id="chest">
          <div className="chest_face" id="chest-front">
            {this.state.randomItems[0].icon}
          </div>
          <div className="chest_face" id="chest-back">
            {this.state.randomItems[1].icon}
          </div>
          <div className="chest_face" id="chest-right">
            {this.state.randomItems[2].icon}
          </div>
          <div className="chest_face" id="chest-left">
            {this.state.randomItems[3].icon}
          </div>
          <div className="chest_face" id="chest-top">
            {this.state.randomItems[4].icon}
          </div>
          <div className="chest_face" id="chest-bottom">
            {this.state.randomItems[5].icon}
          </div>
        </div>
      </div>
    );
  }
}

export default Chest;
