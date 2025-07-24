

All logs
Search
Search

Jul 24, 2:35 AM - 2:38 AM
MDT
Menu

==> Cloning from https://github.com/pasurk44/slack-hr-bot
==> Checking out commit bb53793a71aedb339004750a551b99b6d178b2b4 in branch main
==> Requesting Node.js version 18.x
==> Using Node.js version 18.20.8 via /opt/render/project/src/package.json
==> Node.js version 18.20.8 has reached end-of-life.
==> Upgrade to a maintained version to receive important security updates.
==> Information on maintained Node.js versions: https://nodejs.org/en/about/previous-releases
==> Docs on specifying a Node.js version: https://render.com/docs/node-version
==> Using Bun version 1.1.0 (default)
==> Docs on specifying a Bun version: https://render.com/docs/bun-version
==> Running build command 'npm install'...
added 217 packages, and audited 218 packages in 7s
82 packages are looking for funding
  run `npm fund` for details
found 0 vulnerabilities
==> Uploading build...
==> Uploaded in 2.9s. Compression took 1.3s
==> Build successful 🎉
==> Deploying...
==> Running 'npm start'
> slack-hr-bot@1.0.0 start
> node app.js
/opt/render/project/src/app.js:195
app.receiver.router.get('/health', (req, res) => {
                    ^
TypeError: Cannot read properties of undefined (reading 'get')
    at Object.<anonymous> (/opt/render/project/src/app.js:195:21)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
    at Module._load (node:internal/modules/cjs/loader:1019:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
    at node:internal/main/run_main_module:28:49
Node.js v18.20.8
==> Exited with status 1
==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys
==> Running 'npm start'
> slack-hr-bot@1.0.0 start
> node app.js
/opt/render/project/src/app.js:195
app.receiver.router.get('/health', (req, res) => {
                    ^
TypeError: Cannot read properties of undefined (reading 'get')
    at Object.<anonymous> (/opt/render/project/src/app.js:195:21)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
    at Module._load (node:internal/modules/cjs/loader:1019:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
    at node:internal/main/run_main_module:28:49
Node.js v18.20.8
