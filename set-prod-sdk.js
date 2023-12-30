const fs = require('fs');
const path = require('path');
const { spawnSync } = require('node:child_process');

const sdk = { version: '0.0.22' };

const org = '@newstart-online';

const modulePath = path.join(__dirname, './node_modules', org);

const { stdout, error } = spawnSync('npm', ['show', '@newstart-online/sdk', 'version']);

if (error) {
  console.error(`stderr: ${error} `, stdout.toString(), error);

  process.exit(1);
}

const version = stdout.toString().replace('\n', '');

sdk.version = version;

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

const { stdout: pOut, error: pError } = spawnSync('yarn', ['add', `@newstart-online/sdk@^${sdk.version}`], {
  stdio: 'inherit',
});

if (pError) {
  console.error('[RESTORE ERROR]' + pError);
  process.exit(1);
}

console.info(pOut);
