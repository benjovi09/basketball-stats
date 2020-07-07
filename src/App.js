import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('Booger');
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlayer, setSelectedPlayer] = useState({
    id: 1,
    first_name: 'Booger',
    last_name: 'Johnson',
    team: { abbreviation: 'USA' },
    stats: {
      averageAssistsPerGame: 2,
    },
  });

  useEffect(() => {
    async function fetchData() {
      setAllPlayers(await getAllPlayers());
    }
    fetchData();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (loading) getPlayers(name);
    else setFilteredPlayers(allPlayers.filter((player) => `${player.first_name} ${player.last_name}`.includes(name)));
  }

  function handleChange(event) {
    setName(event.target.value);
  }

  async function getPlayers(name) {
    const url = `https://www.balldontlie.io/api/v1/players?per_page=100&search=${name}`;
    const result = await fetch(url).then(handleFetchResponse);
    setFilteredPlayers(result.data);
  }

  async function getAllPlayers() {
    let page = 1;
    let nextPage = 2;
    let players = [];

    while (nextPage) {
      const url = `https://www.balldontlie.io/api/v1/players?per_page=100&page=${page++}`;
      const result = await fetch(url).then(handleFetchResponse);
      nextPage = result.meta.next_page;
      players = players.concat(result.data);
      await new Promise((r) => setTimeout(r, 1002));
    }
    setLoading(false);
    return players;
  }

  async function handleFetchResponse(r) {
    if (r.ok) {
      return await r.json();
    } else {
      console.log(await r.json());
    }
  }

  function averagePlayerStats(stats) {
    const assists = stats.data.map((game) => game.ast);
    const blocks = stats.data.map((game) => game.blk);
    const points = stats.data.map((game) => game.pts);
    return {
      averageAssistsPerGame: calculateAverage(assists),
      averageBlocksPerGame: calculateAverage(blocks),
      averagePointsPerGame: calculateAverage(points),
    };
  }

  function calculateAverage(stats) {
    const total = stats.reduce((acc, c) => acc + c, 0);
    return total / stats.length;
  }

  async function getPlayerById(id) {
    const url = `https://www.balldontlie.io/api/v1/players/${id}`;
    return await fetch(url).then(handleFetchResponse);
  }

  async function handlePlayerClick(id) {
    const url = `https://www.balldontlie.io/api/v1/stats?player_ids[]=${id}`;

    const results = await fetch(url).then(handleFetchResponse).then(averagePlayerStats);

    let playerData = loading ? await getPlayerById(id) : allPlayers.find((player) => player.id === id);

    setSelectedPlayer({
      ...playerData,
      stats: {
        averageAssistsPerGame: results.averageAssistsPerGame,
        averageBlocksPerGame: results.averageBlocksPerGame,
        averagePointsPerGame: results.averagePointsPerGame,
      },
    });
  }

  return (
    <article>
      <section>
        <h4>{`${selectedPlayer.first_name} ${selectedPlayer.last_name}`}</h4>
        <ul>
          <li>Team: {selectedPlayer.team?.full_name}</li>
          <li>Average Assists Per Game: {selectedPlayer.stats.averageAssistsPerGame}</li>
          <li>Average Points Per Game: {selectedPlayer.stats.averagePointsPerGame}</li>
          <li>Average Blocks Per Game: {selectedPlayer.stats.averageBlocksPerGame}</li>
        </ul>
      </section>
      <span>
        <section>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" value={name} onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </section>
      </span>
      <section>
        {loading ? <h2>Loading...</h2> : null}
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>team</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.id} onClick={() => handlePlayerClick(player.id)}>
                <td>{player.id}</td>
                <td>{`${player.first_name} ${player.last_name}`}</td>
                <td>{player.team.abbreviation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}

export default App;
