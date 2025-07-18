import React, { useState } from 'react';
import { Text, useInput, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { CreateCommandInput, StepKey } from '../types/types.js';
import { countries, variationsOptions, yesNoChoices } from '../constants/constants.js';
import SelectInput from 'ink-select-input';
import { steps } from '../config/steps.js';

const App: React.FC = () => {
  const { exit } = useApp();
  const [step, setStep] = useState<StepKey>('ticket');
  const [input, setInput] = useState<string>('');
  const [data, setData] = useState<Partial<CreateCommandInput>>({});

  // For goals collecting
  const [goals, setGoals] = useState<string[]>([]);

  const currentStep = steps.find(s => s.key === step);


  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }
  });

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
    // TODO: Here you can trigger your create logic or pass data somewhere
    // For now, let's just print the summary and exit

    setTimeout(() => {
      exit();
    }, 3000);

    return (
      <Box flexDirection="column">
        <Text color="green">Generated config for "{data.name}"!</Text>
        <Text>Details:</Text>
        <Text>{JSON.stringify(data, null, 2)}</Text>
        <Text>(Exiting...)</Text>
      </Box>
    );
  }



  return (
    <Box flexDirection="column">
      {step === 'ticket' && (
        <Text>WELCOME TO AB-TESTING CLI 🚀</Text>
      )}
      
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
