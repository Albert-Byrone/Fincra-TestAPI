const swaggerAutogen = require('swagger-autogen')();
// const userRoute = require("./routes/user.routes")
// const ticketRoute = require("./routes/ticket.routes")
// const commentRoute = require("./routes/comment.routes")

const doc = {
  info: {
    title: 'Fincra Test API Documentation',
    description: 'Customer support ticketing system API documentation'
  },
  host: 'https://fincra-testapi.onrender.com'
};

const outputFile = './swagger-output.json';
const endpointFiles = '/app.js';
const routes = ['./routes/user.routes', './routes/ticket.routes', './routes/comment.routes'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// swaggerAutogen(outputFile, routes, doc);

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./app.js'); // Your project's root file
});