import React, { useState, useEffect } from 'react';

function makeRequest(method, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject(xhr.response);
    };
    xhr.send();
  });
}

const useXHR = url => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let isMounted = true;

    makeRequest('GET', url)
      .then(response => JSON.parse(response))
      .then(_data => isMounted && setData(_data))
      .catch(_error => isMounted && setError(_error))
      .then(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { loading, data, error };
};

export default ({ url }) => {
  const state = useXHR(url);

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};
