import React from 'react';

import { Alert, Button } from 'react-bootstrap';

export default function (props) {
  return (
    <Alert variant="danger" onClose={() => props.setShow(false)} dismissible>
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>Try again in a minute</p>
    </Alert>
  );
}
