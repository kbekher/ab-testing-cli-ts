import React, { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import Spinner from 'ink-spinner';
import { CreateCommandInput } from '../types/types.js';
import create from '../commands/create.js';
import { deploy } from '../commands/deploy.js';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

interface Props {
  data: CreateCommandInput;
}

const CreateStatus: React.FC<Props> = ({ data }) => {
  const { exit } = useApp();
  const [statuses, setStatuses] = useState<string[]>(['Initializing directory...']);
  const [done, setDone] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await create(data);
        setStatuses(prev => [...prev, 'Directory was created successfully.']);

        setStatuses(prev => [...prev, 'Starting deploy...']);
        setTimeout(async () => {
          await deploy(result, (update: any) => {

            setStatuses(prev => [...prev, update.message]);

            if (update.done) {
              setDone(true);
              setTimeout(() => {
                exit();
              }, 1000);
            }
          });
        }, 1000);
      } catch (err: any) {
        setStatuses(prev => [...prev, err.message || 'Error creating directory']);
        setDone(true);
        setHasError(true);
        setTimeout(() => exit(), 3000);
      }
    };

    run();
  }, []);

  return (
    <Box flexDirection="column">
      {statuses.map((msg, i) => (
        <Text key={i}>
          {i === statuses.length - 1 && !done ? (
            <>
              <Text color={hasError ? 'red' : done ? 'green' : 'grey'}>
                <Spinner type="dots" />
              </Text>{' '}
              {msg}
            </>
          ) : (
            msg
          )}
        </Text>
      ))}

      {done && !hasError && (
        <>
          <Text color="green">✅ Project was created successfully!</Text>
          <Gradient name="retro">
            <BigText text="Time to A/B Test" />
          </Gradient>
        </>
      )}
    </Box>
  );
};

export default CreateStatus;
