import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('Mike');
  const [players, setPlayers] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    setPlayers(await getPlayers(name));
  }

  function handleChange(event) {
    setName(event.target.value);
  }

  async function getPlayers(name) {
    const url = `https://www.balldontlie.io/api/v1/players?search=${name}`;
    return await fetch(url).then(handleFetchResponse).then(handlePlayerSearchResponse);
  }

  async function handleFetchResponse(r) {
    if (r.ok) {
      return await r.json();
    } else {
      console.log(await r.json());
    }
  }

  async function handlePlayerSearchResponse(response) {
    return response.data;
  }

  return (
    <body>
      <section>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </section>
      <section>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>team</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr>
                <td>{player.id}</td>
                <td>{`${player.first_name} ${player.last_name}`}</td>
                <td>{player.team.abbreviation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </body>
  );
}

export default App;
