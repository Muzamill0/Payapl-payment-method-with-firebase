const express = require('express');
const Router = require('./src/routes/index');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

//routes
app.use('/api/', Router);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});