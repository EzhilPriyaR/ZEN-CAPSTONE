const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors')
const port  = PROCESS.ENV.PORT || 3030;


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', routes)

app.listen(port, () => {
    console.log(`Server Started at http://localhost:${port}`);
})
