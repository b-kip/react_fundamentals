import React from 'react';
import axios from 'axios';

import SearchForm from './SearchForm';
import List from './List';

// const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='

const getUrl = (searchTerm, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_PAGE_UPDATE':
      return {
        ...state,
        isUpdating: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        isError: false,
        data: 
          action.payload.page === 0 
            ? action.payload.list 
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const extractSearchTerm = url => 
  url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
  .replace(PARAM_SEARCH, '');

const extractPage = url => url.substring(url.lastIndexOf("page")).replace('page=', '');

const getLastSearches = urls =>{
  // const uniqueSearches = Array.from(new Set(urls));
  // console.log('Unique Searches', uniqueSearches);
  return urls
  .reduce((result, url, index) => {
    const searchTerm = extractSearchTerm(url);

    if(index === 0) {
      return result.concat(searchTerm)
    }

    const previousSearchTerm = result[result.length - 1];

    if (searchTerm === previousSearchTerm) {
      return result;
    } else {
      return result.concat(searchTerm);
    }
  }, [])
  .slice(-6).slice(0, -1);
} 

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [urls, setUrls] = React.useState([
    getUrl(searchTerm, 0),
  ]);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false, isUpdating: false }
  );

  const handleFetchStories = React.useCallback(async (operation) => {
    if (operation === 'initial_fetch') {
      dispatchStories({ type: 'STORIES_FETCH_INIT' });
    } else if( operation === 'updating_pages') {
      dispatchStories({ type: 'STORIES_PAGE_UPDATE' });
    }
    // console.log(operation);

    try {
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl);
      console.log(result);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload:{
          list: result.data.hits,
          page: result.data.page,
        } 
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    const page = extractPage(urls[urls.length - 1]);
    console.log('Page', page);
    if (Number(page)) {
      console.log('Updating');
      handleFetchStories('updating_pages');
    } else {
      handleFetchStories('initial_fetch');
    }
  }, [handleFetchStories, urls]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    handleSearch(searchTerm, 0);

    event.preventDefault();
  };

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls([...urls, url]);
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const lastSearches = getLastSearches(urls);
  console.log(lastSearches);

  return (
    <div className="app">
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {lastSearches.length !== 0 && (
      <LastSearches 
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />)}

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading  ? (
        <Loader />
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
      
      {stories.isUpdating ? (
        <Loader />
      ) : (
        <button type="button" onClick={handleMore} className="button--main centered">
          More Stories
        </button>
      )}
    </div>
  );
};


const LastSearches  = ({ lastSearches, onLastSearch}) => (
  <div className="history">
        {lastSearches.map((searchTerm, index) => (
          <button
            type="button"
            key={searchTerm + index}
            onClick={() => { 
              console.log("CLICKED")
              onLastSearch(searchTerm)}
            }
          >
            {searchTerm}
          </button>
        ))}
      </div>
);

const Loader = () => <p className='centered'>Loading ...</p>;

export default App;
