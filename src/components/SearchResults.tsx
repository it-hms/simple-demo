type SearchIdResults = string[2];

export const SearchResults: React.FC<{
  results: SearchIdResults[] | undefined;
}> = ({ results }) => {
  if (results === undefined) {
    return <></>;
  } else {
    return (
      <div style={{ marginTop: "20px" }}>
        <h2>Search Results</h2>
        {results.map((res) => {
          return (
            <div key={res[1]}>
              {res[0]} {"  "} {res[1]}
            </div>
          );
        })}
      </div>
    );
  }
};
