const express = require('express')
const session = require('express-session')
//const mongoose = require('mongoose') 
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi= require('swagger-ui-express')
const { connectToMongo } = require('./mongo/dbconfig')

const app = express()

connectToMongo()

const openApiSpecs= swaggerJsdoc({
    definition:{
        openapi:'3.0.0',
        info:{
            description:"bank api for creating accounts and taking action - transfer money ",
            title:'Open Bank API',
            version:'1.0.0',
            
        },
        
        tags:['Account','Actions','Data']
    },
    
    apis:['./routes/*.js']
})

app.use(express.json())
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecs))


app.use(session({
    secret: "SEcreT",
    resave: false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000*60*60*24*29
    }
}))
app.use('/api/account', require('./routes/account'))
app.use('/api/action', require('./routes/action'))
app.use('/api/data', require('./routes/data'))



app.listen(8080, () => { console.log("Server is up an runing on port 8080")})

