import React, { useState, useEffect } from 'react';
import './App.css';

import PlayerListTable from './components/player-list-table';
import PlayerDetailsCard from './components/player-details-card';
import Alert from './components/alert';

function App() {
  const coby = {
    id: 666956,
    first_name: 'Coby',
    last_name: 'White',
    team: { abbreviation: 'CHI', full_name: 'Chicago Bulls' },
    stats: {
      averageAssistsPerGame: 2.44,
      averageBlocksPerGame: 0,
      averagePointsPerGame: 11.92,
    },
  };

  const [name, setName] = useState('Coby White');
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([coby]);
  const [selectedPlayer, setSelectedPlayer] = useState(coby);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    async function getAllPlayers() {
      let page = 1;
      let nextPage = 2;
      let players = [];

      while (nextPage) {
        const url = `https://www.balldontlie.io/api/v1/players?per_page=100&page=${page++}`;
        const result = await fetch(url).then(handleFetchResponse);
        nextPage = result.meta.next_page;
        players = players.concat(result.data);
        await new Promise((r) => setTimeout(r, 2000));
      }
      setLoading(false);
      setAllPlayers(players);
    }

    getAllPlayers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) await getPlayers(name);
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

  async function handleFetchResponse(r) {
    if (r.ok) {
      return await r.json();
    } else {
      setShowAlert(true);
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
        <PlayerDetailsCard player={selectedPlayer}></PlayerDetailsCard>
      </section>
      <section className="search-form">
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text" value={name} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </section>
      <section>
        {showAlert ? <Alert setShow={setShowAlert}></Alert> : null}
        <PlayerListTable players={filteredPlayers} handlePlayerClick={handlePlayerClick}></PlayerListTable>
      </section>
    </article>
  );
}

export default App;
