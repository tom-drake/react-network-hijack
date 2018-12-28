import React, { Component } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import fetchMock from "fetch-mock";
import xhrMock, { delay as xhrDelay, proxy as xhrProxy } from "xhr-mock";

const REQUEST_DELAY = 50;

const mockers = [];

function hijackNetwork() {
  if (mockers.length === 0) {
    fetchMock.restore();
    xhrMock.teardown();
    return;
  }

  fetchMock.restore();
  fetchMock.spy();
  xhrMock.setup();

  const networkMocks = mockers
    .map(({ mocks }) => mocks)
    .reduce((acc, mocks) => {
      Object.entries(mocks).forEach(([method, urls]) => {
        if (!acc[method]) acc[method] = {};

        Object.entries(urls).forEach(([url, options]) => {
          if (acc[method][url]) {
            console.warn(
              `Multiple mockers mocking the same URL (${url}). The last component to render will override any options previously set for this URL.`
            );
          }

          acc[method][url] = options;
        });
      });

      return acc;
    }, {});

  Object.entries(networkMocks).forEach(([method, urls]) => {
    const _method = method.toLowerCase();
    Object.entries(urls).forEach(
      ([url, { status = 200, body, delay = REQUEST_DELAY }]) => {
        const _body = body === Object(body) ? JSON.stringify(body) : body;

        xhrMock[_method](
          url,
          xhrDelay(
            {
              status,
              body: _body
            },
            delay
          )
        );
        const fetchDelay = new Promise(resolve => setTimeout(resolve, delay));
        fetchMock[_method](
          url,
          fetchDelay.then(() => new Response(_body, { status }))
        );
      }
    );
  });

  xhrMock.use(xhrProxy);
}

export default function withNetworkMock(networkMocks) {
  return WrappedComponent => {
    class NetworkMock extends Component {
      static displayName =
        WrappedComponent.displayName || WrappedComponent.name || "Component";

      constructor(...args) {
        super(...args);
        mockers.push({
          instance: this,
          mocks: networkMocks
        });
        hijackNetwork();
      }

      componentDidMount() {
        hijackNetwork();
      }

      componentWillUnmount() {
        const index = mockers.map(({ instance }) => instance).indexOf(this);
        if (index > -1) {
          mockers.splice(index, 1);
        }
        hijackNetwork();
      }

      render() {
        const { forwardRef, ...restProps } = this.props;
        return <WrappedComponent {...restProps} />;
      }
    }

    hoistNonReactStatics(NetworkMock, WrappedComponent);

    return React.forwardRef((props, ref) => (
      <NetworkMock {...props} forwardedRef={ref} />
    ));
  };
}
