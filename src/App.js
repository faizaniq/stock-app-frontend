import React from 'react';
import './App.css';

function App() {

  function test(){
    fetch('https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_3d2d0ca1d6224b5da4270b1ff4414d01')
      .then(res => res.json())
      .then(console.log)
  } 




  return (
    <div className="App">
      <header className="App-header">
       {test()}
      </header>
    </div>
  );
}

export default App;


