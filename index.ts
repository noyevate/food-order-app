import express from 'express'
import App from './services/ExpressApp'
import dbConnection from './services/Database'

const startServer = async () =>{
    const app = express();
    await dbConnection()
    await App(app)

    app.listen(8080, () => {
        console.log('port running at 8080')
    })
};

startServer()