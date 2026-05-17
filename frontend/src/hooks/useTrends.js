import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useTrends(platform = "reddit") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchers = {
      reddit:  api.getRedditTrends,
      youtube: api.getYoutubeTrends,
      google:  api.getGoogleTrends,
    };
    fetchers[platform]()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [platform]);

  return { data, loading, error };
}

export function useSearch() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async (keyword) => {
    setLoading(true);
    try {
      const data = await api.searchKeyword(keyword);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, search };
}
