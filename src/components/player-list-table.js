import React from 'react';
import { Table } from 'react-bootstrap';

export default function (props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>team</th>
        </tr>
      </thead>
      <tbody>
        {props.players?.map((player) => (
          <tr key={player.id} onClick={() => props.handlePlayerClick(player.id)}>
            <td>{player.id}</td>
            <td>{`${player.first_name} ${player.last_name}`}</td>
            <td>{player.team.abbreviation}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
