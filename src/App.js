import React, { useState } from "react";
import Mata from "./Mata";
import Items from "./Items";
import allItems from "./AllItems";
import Cookies from "js-cookie";

function App() {
  const initialState = {
    inventory: ["lettuce", "pet", "ball", "videogame"],
    activeInventory: ["lettuce", "pet", "ball"],
    vitals: {
      health: 100,
      play: 100,
      love: 100,
    },
    startDate: Date.now(),
  };

  if (!Cookies.get("inventory")) {
    Cookies.set("inventory", JSON.stringify(initialState.inventory));
    Cookies.set(
      "activeInventory",
      JSON.stringify(initialState.activeInventory)
    );
    Cookies.set("vitals", JSON.stringify(initialState.vitals));
    Cookies.set("startDate", Date.now());
    Cookies.set("sad", 0);
    Cookies.set("lastVisited", Date.now());
  }

  function createInventoryObjects(arr) {
    let tempArr = [];
    arr.forEach((item) => {
      tempArr.push(allItems[item]);
    });
    return tempArr;
  }

  const [activeInventory, setActiveInventory] = useState(
    createInventoryObjects(JSON.parse(Cookies.get("activeInventory")))
  );
  const [inventory, setInventory] = useState(
    createInventoryObjects(JSON.parse(Cookies.get("inventory")))
  );
  const startDate = JSON.parse(Cookies.get("startDate"));
  const vitals = JSON.parse(Cookies.get("vitals"));

  function updateLastVisited() {
    Cookies.set("lastVisited", Date.now());
  }
  function updateVitalCookies(v) {
    Cookies.set("vitals", JSON.stringify(v));
  }

  function updateSadCookies(s) {
    Cookies.set("sad", s);
  }

  function activeInventorySetter(newItem) {
    let newActiveInventory = [];
    let activeInvNames = [];
    activeInventory.forEach((item) => {
      if (item.type !== newItem.type) {
        newActiveInventory.push(item);
        activeInvNames.push(item.name);
      }
    });
    newActiveInventory.push(newItem);
    activeInvNames.push(newItem.name)
    setActiveInventory(newActiveInventory);
    // Object.entries(newActiveInventory).forEach((e) => {
    //   activeInvNames.push(e[1].name);
    // });
    
    setTimeout(() => {Cookies.set("activeInventory", JSON.stringify(activeInvNames))}, 100);
  }



  function removeFromInventory(newItem) {
    let invNames = [];
    setInventory((prev) => {
      let newInv = [];
      prev.forEach((item) => {
        if (item.name !== newItem.name) {
          newInv.push(item);
          invNames.push(item.name);
        }
      });
      return newInv;
    });
    let newActiveInventory = [];
    let activeInvNames = [];
    activeInventory.forEach((item) => {
      if (item.name !== newItem.name) {
        newActiveInventory.push(item);
        activeInvNames.push(item.name);
      }
    });
    setActiveInventory(newActiveInventory);
    // console.log("activeInvNames", activeInvNames);
    // console.log("InvNames", invNames);
    setTimeout(() => {Cookies.set("activeInventory", JSON.stringify(activeInvNames))}, 100);

    // Object.entries(inventory).forEach((e) => {
    //   invNames.push(e[1].name);
    // });
    setTimeout(() => {Cookies.set("inventory", JSON.stringify(invNames))}, 100);
  }

  function addToInventory(newItem) {
    let invNames = [];
    setInventory((prev) => {
      console.log(prev);
      let newInv = [];
      prev.forEach((item) => {
        newInv.push(item);
        invNames.push(item.name);
      });
      newInv.push(newItem);
      invNames.push(newItem.name);
      console.log(newInv);
      return newInv;
    });

    // Object.entries(inventory).forEach((e) => {
    //   invNames.push(e[1].name);
    // });
    console.log("InvNames", invNames);
    setTimeout(() => {Cookies.set("inventory", JSON.stringify(invNames))}, 100);
  }
  return (
    <div>
      <Mata
        updateVitalCookies={updateVitalCookies}
        updateSadCookies={updateSadCookies}
        updateLastVisited={updateLastVisited}
        lastVisited={Cookies.get("lastVisited")}
        activeInventory={activeInventory}
        removeFromInventory={removeFromInventory}
        addToInventory={addToInventory}
        inventory={inventory}
        startDate={startDate}
        vitals={vitals}
        isSad={parseInt(Cookies.get("sad")) ? true : false}
      />

      <Items inventory={inventory} setActiveFunction={activeInventorySetter} />
    </div>
  );
}

export default App;
