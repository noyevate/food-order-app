import express, { Application } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import {AdminRoute, VendorRoute, ShoppingRoute, CustomerRoute} from '../routes'


export default async(app: Application) => {
    
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use('/images', express.static(path.join(__dirname, 'images')))

    app.use('/admin', AdminRoute)
    app.use('/vendor', VendorRoute)
    app.use('/customer', CustomerRoute)
    app.use(ShoppingRoute)

    return app;
}

/*


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
} as any).then(result =>{
    console.log("DB connected")
}).catch(err => console.log('err: ', err))

app.listen(8080, ()=>{
    console.clear()
    console.log('port running at port 8080')
})
*/