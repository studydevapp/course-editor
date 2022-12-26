import * as cp from 'child_process';
import * as fs from 'fs';

// create minor update for package.json
cp.execSync(`cd ./app && npm version minor`);

// get new version
const p = JSON.parse(fs.readFileSync('./app/package.json', 'utf8'));

const version = 'v' + p.version;

// commit and tag
cp.execSync(`git add . && git commit -am ${version} && git tag ${version}`);

// push changes
cp.execSync(`git push && git push --tags`);

console.log('done');
