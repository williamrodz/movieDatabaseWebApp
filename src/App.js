import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="container"
    style = {{  backgroundColor: '#282c34',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'calc(10px + 2vmin)',
      color: 'white'}}
    >
      <h1>Movies</h1>
      <div style={{display: 'flex',flexDirection:'row',width: "100%",alignItems: 'center',justifyContent: 'center'}}>
        <input type="text" value={'...Extraction'} style={{width: '80%',height: '10vh',fontSize: '3vh'}}/>
      </div>
      <div style={{display: 'flex',flexDirection: 'row',width: 1000,height: 500,alignItems: 'center',justifyContent: 'center'}}>
        <div style={{backgroundColor: 'blue',width: 200,height: 200}}></div>
      </div>

      <div style={{display: 'flex',flexDirection:'row',width: "100%",alignItems: 'center',justifyContent: 'center'}}>
        <div>previous | current page number | next</div>
      </div>

    </div>
  );
}

export default App;
