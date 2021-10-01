import React, { useState, useEffect } from "react";
import Mata from "./Mata";
import Items from "./Items";
import VitalMonitor from "./VitalMonitor";
import allItems from "./AllItems";
import Cookies from "js-cookie";

function App() {
  const [timeAlive, setTimeAlive] = useState(false);
  const [awayMessage, setAwayMessage] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  const lastVisited = Cookies.get("lastVisited");
  const decay = 1;
  const decayRate = 5000;
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
  // Create inventory, activeInventory, startDate, and vitals from cookies
  const [activeInventory, setActiveInventory] = useState(
    createInventoryObjects(JSON.parse(Cookies.get("activeInventory")))
  );
  const [inventory, setInventory] = useState(
    createInventoryObjects(JSON.parse(Cookies.get("inventory")))
  );
  const startDate = JSON.parse(Cookies.get("startDate"));
  const [vitals, setVitals] = useState(JSON.parse(Cookies.get("vitals")));
  const [sad, setSad] = useState(parseInt(Cookies.get("sad")) ? true : false);

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

  // Remove an object from inventory (and cookies). TODO: do this cleaner with spread.
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
      let inventoryCleaner = [...new Set(invNames)];
      Cookies.set("inventory", JSON.stringify(inventoryCleaner)); // This is dirty. TODO: Figure out why the inventory was duplicating from cookies to begin with!
    }, 100);
  }
  // Calculate how long Mata has been kept happy and alive. (or dead! but happy.)
  const getTimeDiff = (returnAliveTime) => {
    let dateDiff;
    if (returnAliveTime) {
      dateDiff = Date.now() - startDate;
    } else {
      dateDiff = Date.now() - lastVisited;
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
  const vitalGlowEffect = (vitalType) => {
    let target;
      switch (vitalType) {
        case "health":
          target = document.getElementById("healthBar");
          break;
        case "play":
          target = document.getElementById("playBar");
          break;
        case "love":
          target = document.getElementById("loveBar");
          break;
        default:
          alert("vitalGlowEffect error!");
          target = document.getElementById("healthBar");
          break;
      }
    
    console.log(target);
    target.classList.add("vitalBarGlowEffect");
    setTimeout(() => {
      target.classList.remove("vitalBarGlowEffect");
    }, 800);
  };
  // Main function for vital decay over time.
  const liveTimePassing = () => {
    // Vital decay
    let newHVal, newPVal, newLVal;
    setVitals((prev) => {
      if (prev.health > 0) {
        newHVal = prev.health - decay;
        if (newHVal > 110) {
          newHVal = 110;
        }
      } else {
        newHVal = prev.health;
      }
      if (prev.play > 0) {
        newPVal = prev.play - decay - 1;
        if (newPVal > 110) {
          newPVal = 110;
        }
      } else {
        newPVal = prev.play;
      }
      if (prev.love > 0) {
        // Should decay more based on last visit?
        newLVal = prev.love - decay;
        if (newLVal > 110) {
          newLVal = 110;
        }
      } else {
        newLVal = prev.love;
      }

      return { health: newHVal, love: newLVal, play: newPVal };
    });

    // timeAlive calculation
    setTimeAlive(getTimeDiff(true));
    // Cookie update
    updateVitalCookies({ health: newHVal, love: newLVal, play: newPVal });
    updateLastVisited();
  };
  // Update the vital cookies every time the vitals change.
  useEffect(() => {
    updateVitalCookies(vitals);
  }, [vitals]);

  // Update the sad cookies every time the sadness changes. TODO: use this useEffect to help out the Ridiculous Function.
  useEffect(() => {
    updateSadCookies(sad ? 1 : 0);
  }, [sad]);

  // Set liveTimePassing, make vitals reflect how long it's been since Mata was loaded, and add hide chance TODO: Mata should not only hide on page refresh. Should do it randomly (with a transition to the target spot, if a quick one.)
  useEffect(() => {
    // Adjust vitals based on time away
    setTimeAlive(getTimeDiff(true));
    updateLastVisited();
    let timeData = getTimeDiff(false);
    let text = timeData[0];
    if (timeData[1] > 1) {
      setAwayMessage(`You've been away for ${text}`); // Gotta guilt 'em!
    }

    setTimeout(() => {
      document.getElementById("timeAway").style.opacity = 0; // And then make the guilt invisible.
    }, 4000); // ...after four seconds.
    let hoursAway = Math.floor((Date.now() - lastVisited) / 3600000); // Calculate how many hours have passed to wear away Mata's vital accordingly.
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
    <div>
      {/* TODO: Mata has gotten huge. Buttons should be a different component, vital monitoring should be a different component
          Should I keep track of the vitals changing here instead of in the Mata component? I'll have to if I extract the vital monitoring bit */}
      <Mata
        // lastVisited={lastVisited}
        activeInventory={activeInventory}
        removeFromInventory={removeFromInventory}
        addToInventory={addToInventory}
        inventory={inventory}
        // startDate={startDate}
        vitals={vitals}
        isSad={sad}
        setSad={setSad}
        setVitals={setVitals}
        awayMessage={awayMessage}
        setIsHiding={setIsHiding}
        isHiding={isHiding}
        timeAlive={timeAlive}
        vitalGlowEffect={vitalGlowEffect}
      />
      <VitalMonitor vitals={vitals} />
      <Items inventory={inventory} setActiveFunction={activeInventorySetter} />
    </div>
  );
}

export default App;
