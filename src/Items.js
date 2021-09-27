import React, { useState } from "react";
import InventoryIcon from "./InventoryIcon";
import Popup from "./Popup";
import allItems from "./AllItems";
export default function Items(props) {
  let inventory = props.inventory;

  const [hoveredItem, setHoveredItem] = useState(allItems.lettuce); // gotta have something here so the popup loads initially. Maybe add a non-item to allItems?
  const handleMouseOver = (e) => {
    document.getElementById("popUp").style.display = "block";
    setHoveredItem(allItems[e.target.id]);
  };

  const handleMouseOut = () => {
    document.getElementById("popUp").style.display = "none";
  };
  
  return (
    <div id="popUpRealm"> 
    {/* this div is dumb, I have to see why I did this! TODO: revisit past self */}
      <div id="outerItemsBox">
        <h1>Items</h1>
        <div id="itemsBox">
          <br />
          {inventory
            // .sort(function (a, b) {
            //   if (a.type[0] > b.type[0]) {
            //     return -1;
            //   }
            //   return 1;
            // })
            .map((e) => (
              <InventoryIcon item={e} handleMouseOver={handleMouseOver} handleMouseOut={handleMouseOut} setActiveFunction={props.setActiveFunction} />
            ))}
        </div>
      </div>
      <Popup item={hoveredItem} />
    </div>
  );
}
