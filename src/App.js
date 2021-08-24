import { useLocalStorage, useFetchJoke } from './hooks';
import './App.css';

// const BASE_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const FILTER_OPTS = ['Programming', 'Miscellaneous', 'Dark', 'Pun', 'Spooky', 'Christmas'];

function App() {
  const [filters, setFilters] = useLocalStorage('filters');
  const [likes, setLikes] = useLocalStorage('likes');
  const [dislikes, setDislikes] = useLocalStorage('dislikes');

  const [joke, loading, error] = useFetchJoke(filters, likes, dislikes);

  const removeLike = (id) => {
    setLikes(likes.filter(item => item.id !== id));
  }

  const removeDislike = (id) => {
    setDislikes(dislikes.filter(item => item.id !== id));
  }

  const likeCurrentJoke = () => {
    setLikes([...likes, joke]);
  }

  const dislikeCurrentJoke = () => {
    setDislikes([...dislikes, joke]);
  }

  const handleChange = (option) => {
    const newFilters = filters.includes(option)
      ? filters.filter(item => item !== option)
      : [...filters, option]
    
    setFilters(newFilters);
  }

  return (
    <div>
      <form>
        {FILTER_OPTS.map((option) => {
          return (
            <div key={option}>
              <input type="checkbox" id={option} name={option} checked={filters.includes(option)} onChange={() => handleChange(option)}/>
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
