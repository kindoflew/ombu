const JokeDisplay = ({joke, loading, error}) => {
  return ( 
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Something went wrong...</p>}
      {!loading && <p>{joke.text}</p>}
    </>
   );
}
 
export default JokeDisplay;