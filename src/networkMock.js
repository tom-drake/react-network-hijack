import fetchMock from "fetch-mock";
import xhrMock, { delay as xhrDelay } from "xhr-mock";

import xhrProxy from "./xhrProxy";
import patchFetchMockForEmit from "./fetchMockPatch";

const REQUEST_DELAY = 50;

function generateMocks(mocksArray) {
  return mocksArray.reduce((acc, mocks) => {
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
}

function mockUrl({
  method,
  url,
  status = 200,
  body: _body,
  delay = REQUEST_DELAY
}) {
  const body = _body === Object(_body) ? JSON.stringify(_body) : _body;

  xhrMock[method](url, xhrDelay({ status, body }, delay));

  const fetchDelay = new Promise(resolve => setTimeout(resolve, delay));
  fetchMock[method](url, fetchDelay.then(() => new Response(body, { status })));
}

function setupMocks(networkMocks) {
  Object.entries(networkMocks).forEach(([_method, urls]) => {
    const method = _method.toLowerCase();
    Object.entries(urls).forEach(([url, config]) =>
      mockUrl({ method, url, ...config })
    );
  });
}

export default function hijackNetwork(mocks, whitelist) {
  if (mocks.length === 0) {
    fetchMock.restore();
    xhrMock.teardown();
    return;
  }

  fetchMock.restore().spy();
  xhrMock.setup();

  setupMocks(generateMocks(mocks));

  xhrMock.use(xhrProxy(whitelist));
  patchFetchMockForEmit(whitelist);
}
