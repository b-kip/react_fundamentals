import React from 'react';
import { sortBy } from 'lodash';
import { ReactComponent as NumericalSortAsce} from './static/numerically-asce.svg';
import { ReactComponent as NumericalSortDesc} from './static/numerically-desc.svg';
import { ReactComponent as AlphabeticalSortAsce} from './static/alphabetical-asce.svg';
import { ReactComponent as AlphabeticalSortDesc} from './static/alphabetical-desc.svg';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, function (story) {
    return story.title.toLowerCase();
  }),
  AUTHOR: list => sortBy(list, function (story) {
    return story.author.toLowerCase();
  }),
  COMMENT: list => sortBy(list, 'num_comments').reverse(),
  POINT: list => sortBy(list, 'points').reverse()
}

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false,
  });

  const handleSort = sortKey => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({sortKey: sortKey, isReverse: isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <div className='stories'>
      <div className='stories__sort' style={{ display: 'flex' }}>
        <span
          style={{ width: '35%' }}
          className='stories__sort-by-title'
          >
          <button
            
            onClick={() => handleSort('TITLE')}
            className={`sort-item button--white text ${ sort.sortKey === 'TITLE' ? ' active-search' : ''}`}
            type="button"
          >
            <span
              className='text'
            >
              Title
            </span>
            {sort.isReverse && (sort.sortKey === "TITLE") ? <AlphabeticalSortDesc /> : <AlphabeticalSortAsce />}
          </button>
        </span>

        <span 
          style={{ width: '20%' }} 
          className="stories__sort-by-author"
          >
          <button
            onClick={() => handleSort('AUTHOR')}
            type="button"
            className={`sort-item button--white text${ sort.sortKey === 'AUTHOR' ? ' active-search' : ''}`}
          >
            <span
              className="text"
            >
              Author
            </span>
            {sort.isReverse && (sort.sortKey === "AUTHOR")? <AlphabeticalSortDesc /> : <AlphabeticalSortAsce />}
          </button>
        </span>

        <span 
          style={{ width: '20%' }}
          className="stories__sort-by-comment text-center"
          >
          <button
            onClick={() => handleSort('COMMENT')}
            className={`sort-item button--white text${ sort.sortKey === 'COMMENT' ? ' active-search' : ''}`}
            type="button"
          >
            <span
              className="text"
            >
              Comments
            </span>
            {sort.isReverse && (sort.sortKey === "COMMENT") ? <NumericalSortDesc /> : <NumericalSortAsce />}
          </button>
        </span>

        <span 
          style={{ width: '10%' }}
          className="stories__sort-by-point text-center"
          >
          <button
            type="button"
            onClick={() => handleSort('POINT')}
            className={`sort-item button--white text${ sort.sortKey === 'POINT' ? ' active-search' : ''}`}
          >
            <span
              className="text"
            >
              Points
            </span>
            {sort.isReverse && (sort.sortKey === "POINT")? <NumericalSortDesc /> : <NumericalSortAsce />}
          </button>
        </span>

        <span 
          style={{ width: '15%'  }}
          className="stories-delete text-center text"
        >
          Actions
        </span>
        </div>
      <div className='stories__list'>
      {sortedList.map(item => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
      </div>
    </div>
  );
}


const Item = ({ item, onRemoveItem }) => (
  <div style={{ display: 'flex' }} className='item'>
    <span style={{ width: '35%' }} className="item__title">
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '25%' }} className="item__author">{item.author}</span>
    <span style={{ width: '20%' }} className="item__comments-count text-center">{item.num_comments}</span>
    <span style={{ width: '10%' }} className="item__points text-center">{item.points}</span>
    <span style={{ width: '15%' }} className="item__action text-center">
      <div className="button-container">
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </div>
    </span>
  </div>
);

export default List;
