import { useState } from 'react';

import CountComponent from './components/Count'
function App() {
  const [count, setCount] = useState(0)
  console.log('App: ');
  return (
    <div className="App">
      count:{count}
      <button onClick={() => setCount(count + 1)}>add</button>
      <CountComponent />
    </div>
  );
}

export default App;
