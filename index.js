const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const logger = require('./config/logger');

let server = app.listen(process.env.PORT, () => {
	logger.info(`Server is running on port ${process.env.PORT}.`);
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);