import fetchMock from 'fetch-mock';

import { emitProxyEventIfNotWhiteListed } from './events';

export default function patchFetchMockForEmit(whitelist) {
  fetchMock.executeRouter = function executeRouter(url, options, request) {
    const match = this.router(url, options, request);

    if (match) {
      return match;
    }

    this.push({ url, options, request, isUnmatched: true });

    const fetchWithEmit = (...args) => {
      const realFetch = this.getNativeFetch();
      return realFetch(...args).then(response => {
        emitProxyEventIfNotWhiteListed(url, whitelist);
        return response;
      });
    };

    return { response: fetchWithEmit };
  };
}
