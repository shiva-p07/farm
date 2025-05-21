const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Determine command prefix based on OS
const isWindows = os.platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Function to run a command in a specific directory
function runCommand(command, args, cwd) {
  const childProcess = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows
  });

  childProcess.on('error', (error) => {
    console.error(`Error starting ${args.join(' ')}:`, error);
  });

  return childProcess;
}

// Start the server and client concurrently
console.log('Starting server and client...');

// Start the server
const serverPath = path.join(__dirname, 'server');
const serverProcess = runCommand(npmCmd, ['run', 'dev'], serverPath);

console.log('Server starting on port 3001...');

// Start the client
const clientPath = path.join(__dirname, 'client');
const clientProcess = runCommand(npmCmd, ['start'], clientPath);

console.log('Client starting on port 3000...');

// Handle shutdown
const cleanup = () => {
  if (serverProcess) {
    console.log('Shutting down server...');
    isWindows ? serverProcess.kill('SIGTERM') : serverProcess.kill();
  }
  
  if (clientProcess) {
    console.log('Shutting down client...');
    isWindows ? clientProcess.kill('SIGTERM') : clientProcess.kill();
  }
  
  process.exit(0);
};

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup); 