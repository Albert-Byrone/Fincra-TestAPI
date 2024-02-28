const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Fincra Test API Documentation',
    description: 'Customer support ticketing system API documentation'
  },
  host: 'fincra-testapi.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger-output.json';
const endpointFiles = ['./app.js']; // Ensure this is an array of file paths

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
  require('./app.js'); // Your project's root file
});