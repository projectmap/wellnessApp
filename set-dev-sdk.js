const fs = require('fs');
const path = require('path');
const { spawnSync } = require('node:child_process');

const org = '@newstart-online';

const sdk = path.join(__dirname, '../sdk');
const sdkPath = path.join(sdk, 'dist');

const modulePath = path.join(__dirname, './node_modules', org);

if (!fs.existsSync(sdk)) {
  console.info('Please clone newstart sdk on same dir');
  process.exit(1);
}

if (!fs.existsSync(sdkPath)) {
  console.info('\n Please build newstart sdk first\n');

  process.exit(1);
}

function restoreModule() {
  if (fs.existsSync(modulePath)) {
    const { stdout, stderr } = spawnSync('rm', ['-rf', modulePath], {
      stdio: 'inherit',
    });

    if (stderr) {
      console.error('[DELETE ERROR]' + stderr);
      process.exit(1);
    }

    console.info(stdout);
  }

  const { stdout, stderr } = spawnSync('yarn', ['add', sdkPath], {
    stdio: 'inherit',
  });

  if (stderr) {
    console.error('[RESTORE ERROR]' + stderr);
    process.exit(1);
  }

  console.info(stdout);
}

restoreModule();
