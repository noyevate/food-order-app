import express, { Request, Response, NextFunction } from 'express';
import {CreateVendor, GetVendor, GetVendorbyId} from '../controllers'
const router = express.Router()


router.post('/vendor', CreateVendor);
router.get('/vendors', GetVendor);
router.get('/vendors/:id', GetVendorbyId)

router.get('/', (req: Request, res: Response, next: NextFunction) => {


    res.json({ message: "Hello from  Admin"})

})

export {router as AdminRoute}