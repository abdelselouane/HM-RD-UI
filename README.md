# RepairDepot UI 
RepairDepot UI application built in React.

## Getting Started 

Download or clone the repo, and cd into the root directory. In your terminal, run the following to:

1. Install project dependencies  
```
$ npm install
```
 
2. Start the development server
```
$ npm run start:watch 
```

Your OS' default should launch at: `http://localhost.homedepot.com:3000`
 
## Testing

Running `$ npm test` in your terminal will start Jest testing framework. There is no configuration need to start using Jest.
Jest will look for and test any files with a `.spec.js` extension.

Running `$ npm run test:e2e` will initiate end to end testing using the json-server with mock data. The mock data server is necessary for functional tests to pass correctly.

# Jest Useful Commands

Show debug from shallow/mounted components 

`wrapper.debug()`  
 
# Debugging Concourse

To hijack into a concourse box during a task and play with the files,  use the following commands:

`fly -t <NAME_OF_PIPELINE> login -c <URL_OF_CONCOURSE_SERVER>`
`fly -t <NAME_OF_PIPELINE> builds`
`fly -t <NAME_OF_PIPELINE> hijack -b <ID_OF_JOB/BUILD>`


# Testing library in the Local machine during development

Step1:
run this command from your package/lib
sudo npm link
/usr/local/lib/node_modules/repair-parts-admin -> /Users/Shared/workspace/react-admin-parts-management

Step2:

run this command from your project
npm link repair-parts-admin 
/Users/Shared/workspace/RepairDepot-UI/node_modules/repair-parts-admin -> /usr/local/lib/node_modules/repair-parts-admin -> /Users/Shared/workspace/react-admin-parts-management
