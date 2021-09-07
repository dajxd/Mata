import React, { useState } from "react";
import Mata from "./Mata";
import Items from "./Items";
import { useCookies } from "react-cookie";
import fakeCookies from "./fakeCookies";
// import ThoughtCloud from "./ThoughtCloud";
function App() {
  const [activeInventory, setActiveInventory] = useState(
    fakeCookies.activeInventory
  ); // make this initialize from cookies
  const [inventory, setInventory] = useState(fakeCookies.inventory); // this too
  const [cookies, setCookie] = useCookies(["data"]);

  function activeInventorySetter(newItem) {
    let newActiveInventory = [];
    activeInventory.forEach((item) => {
      if (item.type !== newItem.type) {
        newActiveInventory.push(item);
      }
    });
    newActiveInventory.push(newItem);
    setActiveInventory(newActiveInventory);
  }

  function removeFromInventory(newItem) {
    setInventory((prev) => {
      let newInv = [];
      prev.forEach((item) => {
        if (item.name !== newItem.name) {
          newInv.push(item);
        }
      });
      return newInv;
    });
    let newActiveInventory = [];
    activeInventory.forEach((item) => {
      if (item.name !== newItem.name) {
        newActiveInventory.push(item);
      }
    });
    setActiveInventory(newActiveInventory);
  }
  function addToInventory(newItem) {
    setInventory((prev) => {
      let newInv = [];
      prev.forEach((item) => {
        newInv.push(item);
      });
      newInv.push(newItem);
      return newInv;
    });
  }

  if (cookies["health"] === undefined) {
    setCookie("health", 100, { sameSite: "strict", maxAge: 2592000 });
    setCookie("lonely", 100, { sameSite: "strict", maxAge: 2592000 });
    setCookie("boredom", 100, { sameSite: "strict", maxAge: 2592000 });
    alert("found no cookies");
  }
  function updateCookies(h, l, b) {
    setCookie("health", h, { sameSite: "strict", maxAge: 2592000 });
    setCookie("lonely", l, { sameSite: "strict", maxAge: 2592000 });
    setCookie("boredom", b, { sameSite: "strict", maxAge: 2592000 });
  }

  // function updateInventoryCookies(i) {
  //   let inventoryCookie = "";
  //   i.forEach((e) => (inventoryCookie += e += "_"));
  //   setCookie("inventory", inventoryCookie, {
  //     sameSite: "strict",
  //     maxAge: 2592000,
  //   });
  // }

  // function updateActiveInventoryCookies(ai) {
  //   let activeInventoryCookie = "";
  //   activeInventoryCookie += ai.health + "_";
  //   activeInventoryCookie += ai.lonely + "_";
  //   activeInventoryCookie += ai.boredom + "_";

  //   setCookie("activeInventory", activeInventoryCookie, {
  //     sameSite: "strict",
  //     maxAge: 2592000,
  //   });
  // }

  let cleanCookies = {};
  Object.entries(cookies).forEach(function (x) {
    if (x[0] === "health") {
      cleanCookies.health = parseInt(x[1]);
    } else if (x[0] === "boredom") {
      cleanCookies.boredom = parseInt(x[1]);
    } else if (x[0] === "lonely") {
      cleanCookies.lonely = parseInt(x[1]);
    }
  });

  return (
    <div>
      {/* <ThoughtCloud props={inventory} /> */}
      <Mata
        cookies={cleanCookies}
        updateFunc={updateCookies}
        activeInventory={activeInventory}
        removeFromInventory={removeFromInventory}
        addToInventory={addToInventory}
        inventory={inventory}
      />

      {/* <Items updateFunc={updateInventoryCookies} activeUpdateFunc={updateActiveInventoryCookies}/> */}
      <Items inventory={inventory} setActiveFunction={activeInventorySetter} />
      {/* <Chest /> */}
    </div>
  );
}

export default App;
