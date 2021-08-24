import { useCallback, useEffect, useState } from 'react';

const BASE_URL = "https://v2.jokeapi.dev/joke/"
const BLACKLIST = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';

export function useFetchJoke(params, likes, dislikes) {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchAndCheck = async (params, likes, dislikes) => {
    const ids = [...likes, ...dislikes];
    let attempts = 5;
    while (attempts > 0) {
      const res = await fetch(`${BASE_URL}${params.join(',') || 'Any'}${BLACKLIST}`);
      const data = await res.json();
      if (!ids.includes(data.id)) {
        return data;
      }
      attempts--;
    }
    throw new Error('No more good jokes.');
  }

  const fetchJoke = useCallback(async (params, likes, dislikes) => {
    setLoading(true);
    setError(false);
    try {
      let data = await fetchAndCheck(params, likes, dislikes);
      if (data.joke) {
        setJoke({
          text: data.joke,
          id: data.id
        });
      } else {
        setJoke({
          text: `${data.setup} -- ${data.delivery}`,
          id: data.id
        });
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoke(params, likes, dislikes);
  }, [fetchJoke, params, likes, dislikes]);

  return [joke, loading, error];
}

export function useLocalStorage(key, initialValue = []) {
  let storedValue = JSON.parse(localStorage.getItem(key));

  const [value, setValue] = useState(() => storedValue || initialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
