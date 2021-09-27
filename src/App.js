import React, { useState } from "react";
import Mata from "./Mata";
import Items from "./Items";
import allItems from "./AllItems";
import Cookies from "js-cookie";

function App() {
  // Starting values if user has no Mata cookies
  const initialValues = {
    inventory: ["lettuce", "pet", "ball", "videogame"],
    activeInventory: ["lettuce", "pet", "ball"],
    vitals: {
      health: 100,
      play: 100,
      love: 100,
    },
    startDate: Date.now(),
  };

  // If user has no inventory cookies, assume they've never been here before and initialize all values
  if (!Cookies.get("inventory")) {
    Cookies.set("inventory", JSON.stringify(initialValues.inventory));
    Cookies.set(
      "activeInventory",
      JSON.stringify(initialValues.activeInventory)
    );
    Cookies.set("vitals", JSON.stringify(initialValues.vitals));
    Cookies.set("startDate", Date.now());
    Cookies.set("sad", 0);
    Cookies.set("lastVisited", Date.now());
  }

  // Function to turn a list of inventory items into an array of their associated objects
  function createInventoryObjects(arr) {
    let tempArr = [];
    arr.forEach((item) => {
      tempArr.push(allItems[item]);
    });
    return tempArr;
  }
  // Create inventory,activeInventory, startDate, and vitals from cookies
  const [activeInventory, setActiveInventory] = useState(
    createInventoryObjects(JSON.parse(Cookies.get("activeInventory")))
  );
  const [inventory, setInventory] = useState(
    createInventoryObjects(JSON.parse(Cookies.get("inventory")))
  );
  const startDate = JSON.parse(Cookies.get("startDate"));
  const vitals = JSON.parse(Cookies.get("vitals"));

  // Interval-updated cookies for lastVisited time, Mata's current vitals, and whether Mata is sad (so the correct idle animation can be loaded with the page)
  function updateLastVisited() {
    Cookies.set("lastVisited", Date.now());
  }
  function updateVitalCookies(v) {
    Cookies.set("vitals", JSON.stringify(v));
  }
  function updateSadCookies(s) {
    Cookies.set("sad", s);
  }

  // Set the activeInventory (and cookies) when an item is selected in the Items module. TODO: Make this use the createInventoryObjects function.
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
    activeInvNames.push(newItem.name);
    setActiveInventory(newActiveInventory);
    // Diagnostic timeout because the cookies were being set with the wrong information.
    setTimeout(() => {
      Cookies.set("activeInventory", JSON.stringify(activeInvNames));
    }, 100);
  }

  // Remove an object from inventory (and cookies). TODO: do this cleaner with rest parameters.
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

    // More diagnostic cookie timeouts!
    setTimeout(() => {
      Cookies.set("activeInventory", JSON.stringify(activeInvNames));
    }, 100);
    setTimeout(() => {
      Cookies.set("inventory", JSON.stringify(invNames));
    }, 100);
  }

  // Add an object to the inventory when the random item button is clicked (or when Mata is hiding!)
  function addToInventory(newItem) {
    let invNames = [];
    setInventory((prev) => {
      let newInv = [];
      prev.forEach((item) => {
        newInv.push(item);
        invNames.push(item.name);
      });
      newInv.push(newItem);
      invNames.push(newItem.name);
      return newInv;
    });
    // Oh hey, a diagnostic cookie timeout.
    setTimeout(() => {
      Cookies.set("inventory", JSON.stringify(invNames));
    }, 100);
  }
  return (
    <div>
      {/* TODO: Mata has gotten huge. Buttons should be a different component, vital monitoring should be a different component
          Should I keep track of the vitals changing here instead of in the Mata component? I'll have to if I extract the vital monitoring bit */}
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
