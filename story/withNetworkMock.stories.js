import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';

import withNetworkMock from '../src/withNetworkMock';
import Unmocked from './Unmocked';
import FetchComponent from './FetchComponent';
import XHRComponent from './XHRComponent';

const MOCKED_URL = 'https://jsonplaceholder.typicode.com/todos/1';
const UNMOCKED_URL = 'https://jsonplaceholder.typicode.com/todos/2';

const whitelist = [/.hot-update.json/];

const withUnmocked = MockComponent => ({ url }) => (
  <>
    <Unmocked />
    <MockComponent url="https://jsonplaceholder.typicode.com/todos/3" />
    <MockComponent url={url} />
    <MockComponent url="https://jsonplaceholder.typicode.com/todos/4" />
  </>
);

const getConfig = mockedUrl => ({
  GET: {
    [mockedUrl]: {
      body: {
        mocked: true
      },
      status: 200,
      delay: 200
    }
  }
});

const generateKnobs = (mockedUrl, unMockedUrl) => ({
  url: select(
    'URLs',
    {
      [`Mocked (${mockedUrl})`]: mockedUrl,
      [`UnMocked (${unMockedUrl})`]: unMockedUrl
    },
    mockedUrl
  )
});

const generateStory = MockComponent => {
  const { url } = generateKnobs(MOCKED_URL, UNMOCKED_URL);
  const config = getConfig(MOCKED_URL);

  const DetectUnmocked = withUnmocked(MockComponent);
  const NetworkMocked = withNetworkMock(config, whitelist)(DetectUnmocked);

  return <NetworkMocked url={url} />;
};

storiesOf('withNetworkMock', module)
  .addDecorator(withKnobs)
  .add('fetch', () => generateStory(FetchComponent))
  .add('xhr', () => generateStory(XHRComponent))
  .add('nested', () => {
    const config = getConfig(MOCKED_URL);

    const DetectUnmocked = withUnmocked(XHRComponent);
    const ThirdNetworkMocked = withNetworkMock(config, whitelist)(
      DetectUnmocked
    );
    const SecondNetworkMocked = withNetworkMock()(ThirdNetworkMocked);
    const NetworkMocked = withNetworkMock()(SecondNetworkMocked);

    return <NetworkMocked url={MOCKED_URL} />;
  });
