import express, { Request, Response, NextFunction } from 'express';
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOTP } from '../controllers/CustomerController';
import {Authenticate} from '../middlewares'
const router = express.Router()

/*-------------- Create Customer -----------*/
router.post('/signup', CustomerSignup)
/*-------------- Login -----------*/
router.post('/login', CustomerLogin)


//Authentication
router.use(Authenticate)
/*-------------- Verify Customer Account -----------*/
router.patch('/verify', CustomerVerify)
/*-------------- Requesting OTP -----------*/
router.get('/otp', RequestOTP)
/*-------------- Customer Profile -----------*/
router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)
/*-------------- Cart -----------*/

/*-------------- order -----------*/

/*-------------- payment -----------*/




export {router as CustomerRoute}