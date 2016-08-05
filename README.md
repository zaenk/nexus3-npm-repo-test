# Set up Nexus with Docker

- start docker
- `docker pull sonatype/nexus3`
- `docker run -d -p 8081:8081 --name nexus sonatype/nexus3`
- visit nexus gui
    + `docker-macine ip default` (machine IP, default 192.168.99.100)
    + `docker ps` (container port, default 8081)
    + browse `192.168.99.100:8081`
- sing in as admin
    + admin, admin123
- create npm repositories
    + `npm-hosted`, hosted, for private packages
    + `npm-3rdparty`, hosted, for 3rd party packages (inspinia)
    + `npm-npmjs`, proxy, https://registry.npmjs.org
    + `npm-public`, group, for the 3 above
        * URL will be sth like: `http://192.168.99.100:8081/repository/npm-npmjs/`
- in Nexus `Administration > Security > Realms` add `npm bearer Security Token Realm`

# Set up npm locally

- `mkdir private-hello`
- `cd private-hello`
- `npm init`
    + promt everithing
- add `index.js`

    ```javascript
    exports.hello = funtions(name) { return 'Hello ' + (name ? name : 'world') + '!'; };
    ```

- add mirror (npm-group) URL to `.npmrc`

    ```ini
    registry = http://192.168.99.100:8081/repository/npm-public/
    ```

    + you can verify it with `npm config get registry`
- add private deployment repository URL (npm-hosted) to `package.json`

    ```json
    {
      "name": "private-hello",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "publishConfig": {
            "registry" : "http://192.168.99.100:8081/repository/npm-hosted/"
        },
      "author": "",
      "license": "ISC"
    }
    ```

- set up user with `npm login --registry=http://192.168.99.100:8081/repository/npm-hosted/`, enter nexus credentials
- publish it: `npm publish`

# Test repository

- `mkdir test`
- `cd test`
- `npm init`
- `echo "registry = http://192.168.99.100:8081/repository/npm-public/" > .npmrc`
- set up user `npm login`, enter Nexus credentials
- `npm install private-hello --save`
- create `index.js`

    ```javascript
    var hello = require('private-hello').hello;
    console.log(hello());
    console.log(hello('Zaenk'));
    ```

- run it: `node index.js`

# Related Guides

- https://github.com/sonatype/docker-nexus3
- https://books.sonatype.com/nexus-book/3.0/reference/npm.html
- https://docs.npmjs.com/files/npmrc
- https://docs.npmjs.com/misc/config
- http://browsenpm.org/package.json#publishConfig
- https://docs.npmjs.com/getting-started/creating-node-modules