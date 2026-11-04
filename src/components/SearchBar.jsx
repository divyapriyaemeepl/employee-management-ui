function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      className="search-input"
      placeholder="Search by name..."
      aria-label="Search employees by name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;