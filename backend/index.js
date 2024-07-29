const connectToMongo=require('./db');

const express = require('express')

connectToMongo();

// const app = express()
const port = 5000
var cors = require('cors')
var app = express()

app.use(cors())

app.use(express.json())
// available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNOTEBOOK Backend app listening on port ${port}`)
})