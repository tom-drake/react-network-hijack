import React, { Component } from "react";
import ReactJson from "react-json-view";

export default class XHRComponent extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    fetch(this.props.url)
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          data: json
        });
      });
  }

  render() {
    return <ReactJson src={this.state} />;
  }
}
