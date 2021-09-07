import React from "react";
import {
  GiHand,
//   GiSoccerBall,
  GiGrass,
//   GiPlainSquare,
  GiOakLeaf,
  GiSuperMushroom,
//   GiLips,
  GiCharm,
  GiNightSleep,
  GiWoodStick,
  GiRetroController,
  GiPaperPlane,
} from "react-icons/gi";

const fakeCookies = {
  inventory: [
    {
      value: 3,
      icon: <GiGrass className="healthColor" />,
      type: "health",
      name: "lettuce",
      phrase: "Feed with lettuce",
    },
    {
      value: 10,
      icon: <GiHand className="loveColor" />,
      type: "love",
      name: "pet",
      phrase: "Pet Mata",
    },
    {
      value: 15,
      icon: <GiRetroController className="playColor" />,
      type: "play",
      name: "videogame",
      phrase: "Play with a video game",
    },
    {
      value: 30,
      icon: <GiCharm className="loveColor" />,
      type: "love",
      name: "heart",
      phrase: "<3 <3 <3",
    },
    {
      value: 15,
      icon: <GiNightSleep className="loveColor" />,
      type: "love",
      name: "cuddle",
      phrase: "Cuddle on Mata",
    },
    {
      value: 3,
      icon: <GiWoodStick className="playColor" />,
      type: "play",
      name: "stick",
      phrase: "Play with a stick",
    },
    {
      value: 15,
      icon: <GiOakLeaf className="healthColor" />,
      type: "health",
      name: "kale",
      phrase: "Feed with kale",
    },
    {
        value: 30,
        icon: <GiSuperMushroom className="healthColor" />,
        type: "health",
        name: "superfood",
        phrase: "Feed with superfood!",
      },
      {
        value: 30,
        icon: <GiPaperPlane className="playColor" />,
        type: "play",
        name: "travel",
        phrase: "Travel!",
      },
  ],
  activeInventory: [
    {
      value: 3,
      icon: <GiGrass className="healthColor" />,
      type: "health",
      name: "lettuce",
      phrase: "Feed with lettuce",
    },
    {
      value: 10,
      icon: <GiHand className="loveColor" />,
      type: "love",
      name: "pet",
      phrase: "Pet Mata",
    },
    {
      value: 15,
      icon: <GiRetroController className="playColor" />,
      type: "play",
      name: "videogame",
      phrase: "Play with a video game",
    },
  ],

  // vitals: {
  //   health: 100,
  //   play: 100,
  //   love: 100,
  // },
  
  vitals: {
    health: 42,
    play: 45,
    love: 48,
  },
};

export default fakeCookies;
