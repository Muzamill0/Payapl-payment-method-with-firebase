const express = require('express');
const Router = require('./src/routes/index');
const errorHandler = require('./src/middleware/ErrorHandler');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

app.use('/api/', Router);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});