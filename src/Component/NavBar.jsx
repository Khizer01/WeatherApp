import React, { useState } from 'react';
import clear from '../Assets/clear.png';
import searchIc from '../Assets/search.svg';

function NavBar({ submit, setSearch, search }) {
  const [key,setKey] = useState(null);
  const handleKeyDown = (e) => {
    setKey(e.key)
    if(key === 'Enter'){
      e.preventDefault();
      submit();
    }
  }
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href='./Weather.jsx'>
          <img src={clear} alt="" className="navbar-logo" />
          Weather Forecast
        </a>
        <div className='searchBox'>
          <input 
            className="search-input" 
            type="search" 
            placeholder="Search" 
            aria-label="Search" 
            value={search} 
            onKeyDown = {handleKeyDown}
            onChange={(e) => setSearch(e.target.value)} 
          />
          <img src={searchIc} alt="" className='Searchico' onClick={submit} />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
