// import { spawn } from 'child_process';

// export const installAndRunDev = (
//   destinationDir: string,
//   onLog: (msg: string) => void,
//   onExit: () => void
// ) => {
//   onLog('Installing dependencies...\n');

//   const install = spawn('npm', ['install'], { cwd: destinationDir });

//   install.stdout?.on('data', (data) => {
//     onLog(data.toString());
//   });

//   install.stderr?.on('data', (data) => {
//     onLog(data.toString());
//   });

//   install.on('exit', (code) => {
//     if (code === 0) {
//       onLog('\nDependencies installed. Starting development server...\n');
//       const dev = spawn('npm', ['run', 'dev'], { cwd: destinationDir });

//       dev.stdout?.on('data', (data) => {
//         onLog(data.toString());
//       });

//       dev.stderr?.on('data', (data) => {
//         onLog(data.toString());
//       });

//       dev.on('exit', (code) => {
//         onLog(`Dev server exited with code ${code}\n`);
//         onExit();
//       });
//     } else {
//       onLog(`npm install failed with code ${code}\n`);
//       onExit();
//     }
//   });
// };
