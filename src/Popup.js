import React from "react";

class Popup extends React.Component {
  componentDidMount() {
    document.addEventListener("mousemove", (event) => {
      const popUp = document.getElementById("popUp");
      if (popUp.style.display !== "none") {
        popUp.style.left = event.pageX + "px";
        popUp.style.top = event.pageY + "px";
      }
    });
  }

  render() {
    const item = this.props.item;

    return (
      <div id="popUp">
        <p className="itemTitle">
          {" "}
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </p>
        <p>
          Type:{" "}
          <span className={item.type + "Color"}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </p>
        <p>
          {" "}
          Value: <span className="itemValue">{item.value}</span>
        </p>
      </div>
    );
  }
}

export default Popup;
