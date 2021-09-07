import React from "react";

class InventoryIcon extends React.Component {
  componentDidMount() {
    const thisIcon = document.getElementById(this.props.item.name);
    // thisIcon.style.opacity = 0;
    thisIcon.classList.add("itemIconAnimation");
    // setTimeout(() => {thisIcon.style.opacity = 100;}, 200)
    setTimeout(() => {
      thisIcon.classList.remove("itemIconAnimation");
    }, 300);
  }
  render() {
    return (
      <div className="itemIcon" key={"div_" + this.props.item.name}>
        <span
          alt={this.props.item.name}
          key={this.props.item.name}
          onMouseOver={this.props.handleMouseOver}
          onMouseOut={this.props.handleMouseOut}
          onClick={() => this.props.setActiveFunction(this.props.item)}
          id={this.props.item.name}
        >
          {this.props.item.icon}
        </span>
      </div>
    );
  }
}

export default InventoryIcon;
