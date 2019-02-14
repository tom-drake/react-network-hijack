import xhrMock from "xhr-mock";

import { emitProxyEventIfNotWhiteListed } from "./events";

function buildUrl({ protocol, host, path, query }) {
  const builtQuery = Object.entries(query)
    .map(
      ([key, value]) =>
        // The library seems to URL encode query params so keys start with amp;
        // instead of just & as its split on &
        `${key.startsWith("amp;") ? key.substring(4) : key}=${value}`
    )
    .join("&");
  return `${protocol}://${host}${path}${builtQuery ? `?${builtQuery}` : ""}`;
}

function promisifyRealXHR(req, res) {
  return new Promise((resolve, reject) => {
    const xhr = new xhrMock.RealXMLHttpRequest();
    xhr.open(req.method(), req.url());

    const headers = req.headers();
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        res.body(xhr.response);
        resolve(res);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send(req.body());
  });
}

export default whitelist => (req, res) => {
  const url = buildUrl(req.url());

  emitProxyEventIfNotWhiteListed(url, whitelist);
  return promisifyRealXHR(req, res);
};
