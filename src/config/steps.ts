/**
 * This file defines the CLI steps with their:
 * - key (used internally and for typing)
 * - question (string prompt)
 * - choices (optional, for select questions)
 * 
 * To add a new step:
 * 1. Add a new entry here with the key and question
 * 2. Add the type for the value if choices exist
 * 3. Update CreateCommandInput to reflect the new key
 * 4. Update handlers in App.tsx 
 */

import { countries, variationsOptions, yesNoChoices } from "../constants/constants.js";

export const steps = [
  {
    key: 'ticket',
    question: 'Enter Ticket Number (or leave blank for 0000):',
  },
  {
    key: 'name',
    question: 'Enter Test Name:',
  },
  {
    key: 'country',
    question: 'Select Country:',
    choices: countries,
  },
  {
    key: 'isNewControl',
    question: 'Do you need a New Control?',
    choices: yesNoChoices,
  },
  {
    key: 'variations',
    question: 'Select Number of variations:',
    choices: variationsOptions,
  },
  {
    key: 'global',
    question: 'Do you need a global.js?',
    choices: yesNoChoices,
  },
  {
    key: 'addGoals',
    question: 'Do you need to add custom goals?',
    choices: yesNoChoices,
  },
  {
    key: 'goals',
    question: 'Enter Custom Goal Name (leave empty to finish):',
  },
];
