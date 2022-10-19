/* eslint-disable */
// @ts-nocheck

import './App.css';
import { FC } from 'react';
import { HelloWorld, NameInput } from './components/index';
import List from './components/List';

const avengers = [
  { name: 'Captain America' },
  { name: 'Iron Man', displayName: 'Iron Man' }, 
  { name: 'Black Widow' },
  { name: 'Thor' },
  { name: 'Hawkeye' },
  { name: 'Vision' },
  { name: 'Hulk' },
];

const App: FC = () => {
  return (
    <div className="App">
      <HelloWorld />
      <NameInput />
      <List data-name={avengers} />
    </div>
  );
};

export default App;
