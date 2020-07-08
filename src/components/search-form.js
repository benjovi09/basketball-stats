import React from 'react';

export default function(props) {
    return (
      <form onSubmit={props.handleSubmit}>
        <label>
          <input type="text" value={props.name} onChange={props.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
}