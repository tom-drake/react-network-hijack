export const UNMOCKED_EVENT = 'http_not_mocked';

export function emitProxyEventIfNotWhiteListed(url, whitelist) {
  let emitEvent = true;
  whitelist.forEach(value => {
    if ((value instanceof RegExp && value.test(url)) || value === url) {
      emitEvent = false;
    }
  });

  if (emitEvent) {
    const event = new CustomEvent(UNMOCKED_EVENT, { detail: { url } });
    window.dispatchEvent(event);
  }
}
