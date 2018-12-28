import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import { Button } from "@storybook/react/demo";

import withNetworkMock from "../withNetworkMock";
import FetchComponent from "./FetchComponent";
import XHRComponent from "./XHRComponent";

const mockedUrl = "https://jsonplaceholder.typicode.com/todos/1";
const unMockedUrl = "https://jsonplaceholder.typicode.com/todos/2";

storiesOf("withNetworkMock", module)
  .addDecorator(withKnobs)
  .add("with text", () => {
    const url = select(
      "URLs",
      {
        [`Mocked (${mockedUrl})`]: mockedUrl,
        [`UnMocked (${unMockedUrl})`]: unMockedUrl
      },
      mockedUrl
    );

    const NetworkMocked = withNetworkMock({
      GET: {
        [mockedUrl]: {
          body: {
            mocked: true
          },
          status: 200,
          delay: 200
        }
      }
    })(FetchComponent);

    return <NetworkMocked url={url} />;
  });
