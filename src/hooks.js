import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue = []) {
  let storedValue = JSON.parse(localStorage.getItem(key));

  const [value, setValue] = useState(() => storedValue || initialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const BASE_URL = "https://v2.jokeapi.dev/joke/"
const BLACKLIST = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';

export function useFetchJoke(params, likes, dislikes) {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAndCheck = async () => {
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

    const fetchJoke = async () => {
      setLoading(true);
      setError(false);
      try {
        let data = await fetchAndCheck();
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
    }
    fetchJoke();
  }, [likes, dislikes, params]);

  return [joke, loading, error];
}
