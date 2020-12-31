import errorHandler from 'errorhandler';

import app from './app';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    );
    console.log('Press CTRL-C to stop\n');
});

process.on('uncaughtException', function(err) {
    console.error(`Uncaught error ${err}`);
    console.log(err.stack);
});
export default server;
module.exports = server;