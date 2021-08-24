const Filters = ({options, filters, handleChange}) => {
  return ( 
    <form>
        {options.map((option) => {
          return (
            <div key={option}>
              <input type="checkbox" id={option} name={option} checked={filters.includes(option)} onChange={() => handleChange(option)}/>
              <label htmlFor={option}>{option}</label>
            </div>
          )
        })}
      </form>
   );
}
 
export default Filters;