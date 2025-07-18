import React, { useState } from 'react';
import { Text, useInput, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';

const App = () => {
  const { exit } = useApp();
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // useInput((input, key) => {
  // 	if (input === 'q') {
  // 		// Exit program
  // 	}

  // 	if (key.leftArrow) {
  // 		// Left arrow key pressed
  // 	}
  // });

  const handleSubmit = () => {
    setSubmitted(true);
  }


  return (
    <Box flexDirection="column">
      {!submitted ? (
        <>
          <Text>What is your test name?</Text>
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={() => setSubmitted(true)}
          />
        </>
      ) : (
        <Text color="green">Generated config for "{value}"!</Text>
      )}
    </Box>
  );
};

export default App;
