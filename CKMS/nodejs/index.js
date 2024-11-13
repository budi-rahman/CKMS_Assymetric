if(process.env.MODE_ENV === 'development'){
    require('dotenv').config()
}

const express = require('express');
const app = express()
const port = 3000
const router = require('./routes')

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(router)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})