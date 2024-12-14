const express = require("express");
require("../database/db")
const app = express();
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const cors = require('cors');
const morgan = require('morgan')
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())
app.use('/auth', authRoutes);
app.use('/api', taskRoutes)

// localhost:4000/auth/register

const port = 4000;

app.listen(port, () => {
  console.log(`server is running on port, ${port}`);
});
