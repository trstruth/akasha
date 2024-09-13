import React from 'react';
import CreateFlag from './CreateFlag';
import FlagList from './FlagList';

const App: React.FC = () => {
  return (
    <div>
      <h1>Akasha Feature Flag Management</h1>
      <CreateFlag />
      <FlagList />
    </div>
  );
};

export default App;
