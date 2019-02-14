import React, { useState, useEffect } from "react";
import ReactJson from "react-json-view";

const useFetch = url => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(
    () => {
      fetch(url)
        .then(response => response.json())
        .then(setData)
        .catch(setError)
        .then(() => setLoading(false));
    },
    [url]
  );

  return { loading, data, error };
};

export default ({ url }) => {
  const state = useFetch(url);

  return <ReactJson src={state} />;
};
