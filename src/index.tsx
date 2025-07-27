#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import App from './ui/App.js';

const program = new Command();

program
  .name('abtest')
  .description('CLI to create and manage A/B tests')
  .version('1.0.0');

// abtest create
program
  .command('create')
  .description('Create a new A/B Test project')
  .action(() => {
    render(<App />);
  });

// default help command included
program.parse(process.argv);