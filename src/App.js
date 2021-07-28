import { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";



function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);


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
      const res = await fetch(BASE_URL);
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

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div>
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
