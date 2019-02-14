import React, { useState, useEffect } from "react";
import { UNMOCKED_EVENT } from "../src/events";

function useUnmocked() {
  const [unmocked, setUnmocked] = useState(false);
  const [urls, setUrls] = useState(new Set());

  const handleUnmocked = event => {
    setUnmocked(true);
    setUrls(currentUrls => {
      const urlClone = new Set(currentUrls);
      urlClone.add(event.detail.url);
      return urlClone;
    });
  };

  useEffect(() => {
    window.addEventListener(UNMOCKED_EVENT, handleUnmocked);
    return () => window.removeEventListener(UNMOCKED_EVENT, handleUnmocked);
  }, []);

  return { unmocked, urls: [...urls] };
}

export default () => {
  const { unmocked, urls } = useUnmocked();

  if (unmocked) {
    return (
      <div>
        Unmocked urls called:
        <div>
          {urls.map(url => (
            <div key={url}>{url}</div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
