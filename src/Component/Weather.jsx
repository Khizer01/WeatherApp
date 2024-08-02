import React, { useState } from 'react';
import './Weather.css';
import NavBar from './NavBar';
import Card from './Card';

function Weather() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('Karachi');

  const submit = () => {    
    setQuery(search.trim() === "" ? "Karachi" : search);
  };

  return (
    <div className="weather-background">
      <NavBar submit={submit} setSearch={setSearch} search={search} />
      <Card query={query} />
    </div>
  );
}

export default Weather;
