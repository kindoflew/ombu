import { useState, useEffect } from 'react';
import './App.css';

// const BASE_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const BASE_URL = "https://v2.jokeapi.dev/joke/"
const BLACKLIST = "?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
const FILTER_OPTS = ['Programming', 'Miscellaneous', 'Dark', 'Pun', 'Spooky', 'Christmas'];

const getLikesFromStorage = () => {
  let likes = localStorage.getItem('likes');
  likes = JSON.parse(likes);
  return likes || [];
}

const getDislikesFromStorage = () => {
  let dislikes = localStorage.getItem('dislikes');
  dislikes = JSON.parse(dislikes);
  return dislikes || [];
}

const getFiltersFromStorage = () => {
  let filters = localStorage.getItem('filters');
  filters = JSON.parse(filters);
  return filters || [];
}

const getCheckedFromStorage = () => {
  let checked = localStorage.getItem('checked');
  checked = JSON.parse(checked);
  return checked || Array.from({ length: FILTER_OPTS.length}, () => false);
}

function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [checked, setChecked] = useState(getCheckedFromStorage);
  const [filters, setFilters] = useState(getFiltersFromStorage);

  const [likes, setLikes] = useState(getLikesFromStorage);
  const [dislikes, setDislikes] = useState(getDislikesFromStorage);


  const fetchJoke = async () => {
    setLoading(true);
    setError(false);
    try {
      let data = await fetchJokeAndCheck();
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

  async function fetchJokeAndCheck() {
    const ids = [...likes, ...dislikes];
    let attempts = 5;
    while (attempts > 0) {
      const res = await fetch(`${BASE_URL}${filters.join(',') || 'Any'}${BLACKLIST}`);
      const data = await res.json();
      if (!ids.includes(data.id)) {
        return data;
      }
      attempts--;
    }
    throw new Error('No more good jokes.');
  }

  const removeLike = (id) => {
    setLikes(likes.filter(item => item.id !== id));
  }

  const removeDislike = (id) => {
    setDislikes(dislikes.filter(item => item.id !== id));
  }

  const likeCurrentJoke = () => {
    setLikes([...likes, joke]);
    fetchJoke();
  }

  const dislikeCurrentJoke = () => {
    setDislikes([...dislikes, joke]);
    fetchJoke();
  }

  const handleChange = (index) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);

    const newFilters = newChecked[index]
      ? [...filters, FILTER_OPTS[index]]
      : filters.filter(item => item !== FILTER_OPTS[index])
    
    setFilters(newFilters);
  }

  useEffect(() => {
    fetchJoke();
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('dislikes', JSON.stringify(dislikes));
    localStorage.setItem('filters', JSON.stringify(filters));
    localStorage.setItem('checked', JSON.stringify(checked));
  },[likes, dislikes, filters, checked]);

  return (
    <div>
      <form>
        {FILTER_OPTS.map((option, index) => {
          return (
            <div key={option}>
              <input type="checkbox" id={option} name={option} checked={checked[index]} onChange={() => handleChange(index)}/>
              <label htmlFor={option}>{option}</label>
            </div>
          )
        })}
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Something went wrong...</p>}
      {!loading && <p>{joke.text}</p>}
      <button onClick={likeCurrentJoke} disabled={loading}>LIKE</button>
      <button onClick={dislikeCurrentJoke} disabled={loading}>DISLIKE</button>
      <h2>LIKES</h2>
      <ul data-testid="like-list">
        {likes.map(like => <li key={like}>{like.text}--{like.id} <button onClick={() => removeLike(like.id)}>REMOVE</button></li>)}
      </ul>
      <h2>DISLIKES</h2>
      <ul data-testid="dislike-list">
        {dislikes.map(dislike => <li key={dislike}>{dislike.text}--{dislike.id} <button onClick={() => removeDislike(dislike.id)}>REMOVE</button></li>)}
      </ul>
    </div>
  );
}

export default App;
