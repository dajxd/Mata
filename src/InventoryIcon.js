import React from "react";

class InventoryIcon extends React.Component {
  
  componentDidMount() {
    const thisIcon = document.getElementById(this.props.item.name);
    console.log(this.props.item.name)
    thisIcon.classList.add("itemIconAnimation");
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
          {this.props.item.icon} {this.props.hiding}
        </span>
      </div>
    );
  }
}

export default InventoryIcon;
