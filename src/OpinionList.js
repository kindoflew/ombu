const OpinionList = ({title, list, remove, testID}) => {
  return (
    <>
      <h2>{title}</h2>
      <ul data-testid={testID}>
        {list.map((item) => (
          <li key={item}>
            {item.text}--{item.id} <button onClick={() => remove(item.id)}>REMOVE</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default OpinionList;
