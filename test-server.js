#!/usr/bin/env node

// Simple test script to validate the MCP server
import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing Motion MCP Server...\n');

// Check if API key is set
if (!process.env.MOTION_API_KEY) {
  console.error('❌ Error: MOTION_API_KEY environment variable is not set');
  console.log('\nPlease set your Motion API key:');
  console.log('export MOTION_API_KEY=your_api_key_here');
  process.exit(1);
}

console.log('✅ API key found');

// Start the server
const serverPath = join(__dirname, 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env
});

// Handle server output
server.stderr.on('data', (data) => {
  const message = data.toString();
  if (message.includes('Motion MCP server running')) {
    console.log('✅ Server started successfully');
    console.log('\n📋 Available tools:');
    console.log('  - list_motion_tasks: List tasks from Motion');
    console.log('\nThe server is now ready to accept MCP connections.');
    console.log('Press Ctrl+C to stop the server.');
  }
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Server exited with code ${code}`);
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\nStopping server...');
  server.kill();
  process.exit(0);
});