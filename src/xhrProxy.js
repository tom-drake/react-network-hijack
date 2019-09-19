import { proxy } from 'xhr-mock';

import { emitProxyEventIfNotWhiteListed } from './events';

function buildUrl({ protocol, host, path, port, query }) {
  const builtQuery = Object.entries(query)
    .map(
      ([key, value]) =>
        // The library seems to URL encode query params so keys start with amp;
        // instead of just & as its split on &
        `${key.startsWith('amp;') ? key.substring(4) : key}=${value}`
    )
    .join('&');
  return `${protocol ? `${protocol}://` : ''}${host || ''}${
    port ? `:${port}` : ''
  }${path}${builtQuery ? `?${builtQuery}` : ''}`;
}

export default whitelist => (req, res) => {
  const url = buildUrl(req.url());

  emitProxyEventIfNotWhiteListed(url, whitelist);
  return proxy(req, res);
};
