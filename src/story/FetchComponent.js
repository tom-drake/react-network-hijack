import React, { Component } from "react";
import ReactJson from "react-json-view";

export default class FetchComponent extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    fetch(this.props.url)
      .then(response => response.json())
      .then(json => this.setState({ data: json }))
      .catch(error => this.setState({ error }))
      .then(() => this.setState({ loading: false }));
  }

  render() {
    return <ReactJson src={this.state} />;
  }
}
