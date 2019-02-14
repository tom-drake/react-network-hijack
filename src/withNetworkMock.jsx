import React, { Component } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import MockState from "./MockState";
import hijackNetwork from "./networkMock";

export default function withNetworkMock(networkMocks, whitelist) {
  return WrappedComponent => {
    class NetworkMock extends Component {
      static displayName =
        WrappedComponent.displayName || WrappedComponent.name || "Component";

      constructor(...args) {
        super(...args);

        const lengthBeforeAdd = MockState.getMocks().length;
        MockState.addMocks(this, networkMocks);
        MockState.addWhitelist(this, whitelist);
        if (lengthBeforeAdd === 0) {
          // Only need to do this in the constructor if we are the first to mock.
          hijackNetwork(MockState.getMocks(), MockState.getWhitelist());
        }
      }

      componentDidMount() {
        hijackNetwork(MockState.getMocks(), MockState.getWhitelist());
      }

      componentWillUnmount() {
        MockState.removeMocks(this);
        MockState.removeWhitelist(this);
        hijackNetwork(MockState.getMocks(), MockState.getWhitelist());
      }

      render() {
        const { forwardedRef, ...restProps } = this.props;
        return <WrappedComponent ref={forwardedRef} {...restProps} />;
      }
    }

    hoistNonReactStatics(NetworkMock, WrappedComponent);

    return React.forwardRef((props, ref) => (
      <NetworkMock {...props} forwardedRef={ref} />
    ));
  };
}
