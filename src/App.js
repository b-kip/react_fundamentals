import { Fragment } from 'react';
import './App.css';

// const title = 'React';
const welcome = {
  greeting: 'Hey',
  title: 'React',
}

function getTitle(title) {
  return title;
}

var list = [
  {
    title: 'React',
    url:'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
]

const App = () => {

  const handleChange = event => {
    console.log(event.target.value);
  }

  return (
    <div>
      <Header />
      <hr />
      <hr />
      <List />
      <hr />
      <hr />
      <List></List>
      <hr />
      <hr />
      <label htmlFor="search">Search: </label>
      <input type="text" id="search" onChange={handleChange}/>
    </div>
  );
}

const List = () => (
  list.map(item => (
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </div>
    )
  )
);

const Header = () => (
    <Fragment>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h2>Hello {getTitle('JavaScript')}</h2>
    </Fragment>
)

export default App;
