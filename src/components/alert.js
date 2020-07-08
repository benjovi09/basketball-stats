import React from 'react';

import Alert from 'react-bootstrap/Alert';

export default function (props) {
  return (
    <Alert variant="danger" onClose={() => props.setShow(false)} dismissible>
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>Try again in a minute</p>
    </Alert>
  );
}
