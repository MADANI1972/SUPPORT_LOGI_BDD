#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
};

const deployToVercel = () => {
  console.log('\n🚀 Starting deployment to Vercel...\n');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('Vercel CLI not found. Installing...');
    if (!runCommand('npm install -g vercel')) {
      console.error('Failed to install Vercel CLI. Please install it manually with: npm install -g vercel');
      process.exit(1);
    }
  }

  // Build the project
  console.log('\n📦 Building project...');
  if (!runCommand('npm run build')) {
    console.error('Build failed. Please fix the errors and try again.');
    process.exit(1);
  }

  // Deploy to Vercel
  console.log('\n🚀 Deploying to Vercel...');
  rl.question('Do you want to deploy to production? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      runCommand('vercel --prod');
    } else {
      runCommand('vercel');
    }
    
    console.log('\n✅ Deployment process completed!');
    rl.close();
  });
};

deployToVercel();