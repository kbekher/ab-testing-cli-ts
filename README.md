# Douglas AB-Testing CLI with Kameleoon API

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A command-line interface (CLI) tool built with **TypeScript** and **Ink**, designed to streamline the creation of A/B test boilerplate code, as well as the creation and management of experiments in Kameleoon.

With this tool, you can quickly generate the necessary structure and components needed to set up A/B tests for your projects — saving time and ensuring consistency.

---

## 🚀 Features

- Full integration with the [Kameleoon API](https://developers.kameleoon.com/)
- CLI-based experiment creation, goal setup, and variation assignment
- Auto-generated folders and dev environment
- Webpack-based builds that automatically update your Kameleoon scripts
- Compatible with [@douglas.onsite.experimentation/douglas-ab-testing-toolkit](https://www.npmjs.com/package/@douglas.onsite.experimentation/douglas-ab-testing-toolkit)

---

## 📦 Installation

### Prerequisites
- **Node.js v18+** (tested with v21.7.3)
- **npm** (comes with Node)
- A valid **Kameleoon account** and API credentials (see [Kameleoon API Configuration](#-kameleoon-api-configuration))


### 1. Clone the repository

```bash
git clone https://github.com/kbekher/ab-testing-cli-ts.git
cd ab-testing-cli-ts
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build and link the CLI globally

This compiles the TypeScript code into dist/ and links the ab-test command to your system’s global path:

```bash
npm run build:link
```

### 4. Verify installation

Run the following to check that the CLI is available globally:

```bash
ab-test create
```

This will trigger the experiment creation flow. 🚀

### Re-run the CLI (Quick Method)

To refresh your CLI after making changes:

```bash
# Remove old symlink and rebuild
npm run build:link

# Create a new test
ab-test create
```

In case you get an error, try: 

```bash
# Remove existing CLI binary
rm ~/.nvm/versions/node/v21.7.3/bin/ab-test

# Rebuild the project
npm run build

# Link the CLI globally
npm link

# Create a new test
ab-test create
```

## 🔐 Kameleoon API Configuration

Before using the CLI, configure your Kameleoon API credentials via a `.kameleoon_env` file in your home directory.

### Steps to Create a `.kameleoon_env` File in the Home Directory:

1. **Open Terminal** and navigate to your home directory:
   ```bash
   cd ~

2. **Create or edit the .env file** in your home directory::
   ```bash
   nano .kameleoon_env

3. **Add your Kameleoon credentials** (Kameleoon Profile > See my API credentials):
   ```bash
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret

4. **Save the file**:
   - Press `CTRL + O`, then press `Enter` to save.
   - Press `CTRL + X` to exit the editor.

Now, the CLI will read your Kameleoon credentials from the `.kameleoon_env` file in your home directory to obtain Kameleoon access token whenever it's executed. 😉


## ⚙️ CLI Workflow and Webpack Capabilities

Running `abtest create` will:
   * Create a local folder for your experiment
   * Automatically create an experiment in Kameleoon
   * Install all necessary packages, including:
      * [`@douglas.onsite.experimentation/douglas-ab-testing-toolkit`](https://www.npmjs.com/package/@douglas.onsite.experimentation/douglas-ab-testing-toolkit), version ^2.0.0


### Start development:
```bash
npm run dev
```
### For production-ready code, use one of the following commands:
```bash
npm run build // local build
npm run build-dev // build with logs and Kameleoon uploads
npm run build-prod // build without logs and with Kameleoon uploads
```

All build commands generate a `dist` folder with minified scripts and update the corresponding Kameleoon experiment. 🚀


## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and feature updates.

## 📄 License

This project is licensed under the [MIT License](./LICENSE) © 2025 Kristina Bekher.