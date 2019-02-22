import React, { useState, useEffect } from "react";
import ReactJson from "react-json-view";

const useFetch = url => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let isMounted = true;

    fetch(url)
      .then(response => response.json())
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
  const state = useFetch(url);

  return <ReactJson src={state} />;
};
