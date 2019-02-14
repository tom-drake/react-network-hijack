import React, { useState, useEffect } from "react";
import ReactJson from "react-json-view";

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

  useEffect(
    () => {
      makeRequest("GET", url)
        .then(response => JSON.parse(response))
        .then(setData)
        .catch(setError)
        .then(() => setLoading(false));
    },
    [url]
  );

  return { loading, data, error };
};

export default ({ url }) => {
  const state = useXHR(url);

  return <ReactJson src={state} />;
};
