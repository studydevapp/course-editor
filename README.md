# StudyDev Course Editor

### Requirements
* node & npm
* git

### Known Issues
* Windows marks the already built electron app as dangerous because the exe was not signed with a code signing certificate. If you have any concerns, you can build the project yourself from source code or use it in a virtual machine.
* API Keys won't persist after updating the app.

### Run from source

```bash
  > pnpm i
  > pnpm run start
```



## Development
### Publish new version
* Update app/package.json version
* git commit -m "vX.X.X"
* git tag vX.X.X
* git push --follow-tags
