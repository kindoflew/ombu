import { useFetchJoke, useLocalStorage } from './hooks';
import JokeDisplay from './JokeDisplay';
import Filters from './Filters';
import OpinionList from './OpinionList';
import './App.css';

// const BASE_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const FILTER_OPTS = ['Programming', 'Miscellaneous', 'Dark', 'Pun', 'Spooky', 'Christmas'];

function App() {
  const [filters, setFilters] = useLocalStorage('filters');
  const [likes, setLikes] = useLocalStorage('likes');
  const [dislikes, setDislikes] = useLocalStorage('dislikes');

  const [joke, loading, error] = useFetchJoke(filters, likes, dislikes);

  const removeLike = (id) => {
    setLikes(likes.filter((item) => item.id !== id));
  };

  const removeDislike = (id) => {
    setDislikes(dislikes.filter((item) => item.id !== id));
  };

  const likeCurrentJoke = () => {
    setLikes([...likes, joke]);
  };

  const dislikeCurrentJoke = () => {
    setDislikes([...dislikes, joke]);
  };

  const handleChange = (option) => {
    const newFilters = filters.includes(option)
      ? filters.filter((item) => item !== option)
      : [...filters, option];

    setFilters(newFilters);
  };

  return (
    <div>
      <Filters options={FILTER_OPTS} filters={filters} handleChange={handleChange} />
      <JokeDisplay joke={joke} loading={loading} error={error} />
      <button onClick={likeCurrentJoke} disabled={loading}>
        LIKE
      </button>
      <button onClick={dislikeCurrentJoke} disabled={loading}>
        DISLIKE
      </button>
      <OpinionList title="LIKES" list={likes} remove={removeLike} testID="like-list" />
      <OpinionList title="DISLIKES" list={dislikes} remove={removeDislike} testID="dislike-list" />
    </div>
  );
}

export default App;
