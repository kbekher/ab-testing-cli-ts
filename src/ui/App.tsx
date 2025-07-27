import React, { useState } from 'react';
import { Text, useInput, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { CreateCommandInput, StepKey } from '../types/types.js';
import { countries, variationsOptions, yesNoChoices } from '../constants/constants.js';
import SelectInput from 'ink-select-input';
import { steps } from '../config/steps.js';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import CreateStatus from '../components/CreateStatus.js';
// import { installAndRunDev } from '../utils/runDev.js';
// import Spinner from 'ink-spinner';

const App: React.FC = () => {
  const { exit } = useApp();
  const [step, setStep] = useState<StepKey>('ticket');
  const [input, setInput] = useState<string>('');
  const [data, setData] = useState<Partial<CreateCommandInput>>({});
  const [dir, setDir] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  // For goals collecting
  const [goals, setGoals] = useState<string[]>([]);

  const currentStep = steps.find(s => s.key === step);

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }
  });

  // // Run dev server when dir is set
  // useEffect(() => {
  //   if (dir) {
  //     console.log('Running installAndRunDev for', dir); // Debug
  //     setIsInstalling(true);
  //     installAndRunDev(
  //       dir,
  //       (msg: string) => setLogs(prev => [...prev, msg]),
  //       () => {
  //         setLogs(prev => [...prev, 'Exiting CLI...']);
  //         setTimeout(exit, 1000);
  //       }
  //     );
  //   }
  // }, [dir]);

  const handleSubmit = () => {
    switch (step) {
      case 'ticket':
        setData({ ...data, ticket: input || '0000' });
        setInput('');
        setStep('name');
        break;
      case 'name':
        setData({ ...data, name: input });
        setInput('');
        setStep('country');
        break;
      case 'goals':
        if (input.trim() === '') {
          // No more goals
          setData({ ...data, goals: goals.length > 0 ? goals : false });
          setStep('done');
        } else {
          setGoals([...goals, input.trim()]);
          setInput('');
        }
        break;
      default:
        break;
    }
  };

  const handleSelect = (item: { label: string; value: any }) => {
    switch (step) {
      case 'country':
        setData({ ...data, country: item.value });
        setStep('isNewControl');
        break;
      case 'isNewControl':
        setData({ ...data, isNewControl: item.value });
        setStep('variations');
        break;
      case 'variations':
        setData({ ...data, variations: item.value });
        setStep('global');
        break;
      case 'global':
        setData({ ...data, global: item.value });
        setStep('addGoals');
        break;
      case 'addGoals':
        setData({ ...data, addGoals: item.value });
        if (item.value) {
          setStep('goals');
        } else {
          setStep('done');
        }
        break;
      default:
        break;
    }
  };

  if (step === 'done') {
    return (
      <CreateStatus
        data={data as CreateCommandInput}
        // onComplete={(destinationDir: string) => {
        //   console.log('DIR set:', destinationDir); // Debug
        //   setDir(destinationDir);
        // }}
      />
    );
  }

  // if (isInstalling) {
  //   return (
  //     <Box flexDirection="column">
  //       <Text color="cyan">
  //         <Spinner type="dots" /> Installing and starting dev server...
  //       </Text>
  //       {logs.slice(-10).map((log, i) => (
  //         <Text key={i}>{log.trim()}</Text>
  //       ))}
  //     </Box>
  //   );
  // }

  return (
    <Box flexDirection="column">
      <Gradient name="retro">
        <BigText text="A/B TESTING CLI" />
      </Gradient>

      <Text>{currentStep?.question}</Text>
      {currentStep?.choices ? (
        <SelectInput
          items={
            step === 'country'
              ? countries
              : step === 'variations'
                ? variationsOptions
                : yesNoChoices
          }
          onSelect={handleSelect}
        />
      ) : (
        <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
      )}
    </Box>
  );
};

export default App;
