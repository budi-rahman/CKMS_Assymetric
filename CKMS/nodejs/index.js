if(process.env.MODE_ENV === 'development'){
    require('dotenv').config()
}

const express = require('express');
const app = express()
const port = 3000
const router = require('./routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})