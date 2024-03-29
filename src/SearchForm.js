import React from 'react';
import './SearchForm.css';

import InputWithLabel from './InputWithLabel';

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button className="button--main" type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

export default SearchForm;
