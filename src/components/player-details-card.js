import React from 'react';

import Card from 'react-bootstrap/Card';

export default function (props) {
  const player = props.player;
  return (
    <Card>
      <Card.Body>
        <Card.Title>{`${player.first_name} ${player.last_name}`}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{player.team?.full_name}</Card.Subtitle>
        <Card.Text>
          Average Assists Per Game: {player.stats.averageAssistsPerGame} <br />
          Average Points Per Game: {player.stats.averagePointsPerGame} <br />
          Average Blocks Per Game: {player.stats.averageBlocksPerGame} <br />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
