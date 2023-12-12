import express, { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {CreateCustomerInputs, UserLoginInputs, EditCustomerProfileInputs} from '../dto'
import {GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, PasswordValidation, onRequestOtp} from '../utility'
import { Customer } from '../models/Customer';


export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) =>{
    const customerInputs = plainToClass(CreateCustomerInputs, req.body)
    const inputError = await validate(customerInputs, {validationError: {target: true}})
    if(inputError.length > 0){
        res.status(400).json(inputError)
    } 
    const  {email, phone, password} = customerInputs
    const salt =  await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)

    const {otp, expiry} = GenerateOTP()

    const existingCustomer = await Customer.findOne({email: email})
    if(existingCustomer !== null){
        return res.status(409).json({message: 'A customer exist with the same email'})
    }else {
        const result = await Customer.create({
            email: email,
            password: userPassword,
            salt: salt,
            firstName: '',
            lastName: '',
            address: '',
            phone: phone,
            verified: false,
            otp: otp,
            otp_expiry: expiry,
            lat: 0,
            lng: 0,
        })
    
        if(result) {
            // send otp
            await onRequestOtp(otp, phone)
    
            //generateSignature
            const signature = await GenerateSignature({
                _id: result.id,
                email: result.email,
                verified: result.verified
            })
    
            //send result to client
            return res.status(200).json({signature: signature, verified: result.verified, email: result.email})
        }
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        firstName: '',
        lastName: '',
        address: '',
        phone: phone,
        verified: false,
        otp: otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0,
    })

    if(result) {
        // send otp
        await onRequestOtp(otp, phone)

        //generateSignature
        const signature = await GenerateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
        })

        //send result to client
        return res.status(200).json({signature: signature, verified: result.verified, email: result.email})
    }
    return res.status(500).json({message: "error in signup"})
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const loginInputs = plainToClass(UserLoginInputs, req.body)
    const loginErrors =  await validate(loginInputs, {validationError: {target: false}})
    if(loginErrors.length > 0){
        res.status(400).json(loginErrors)
    } 
    
    const {email, password} = loginInputs
    const customer = await Customer.findOne({email:email })
    if(customer){
        const validation = await PasswordValidation(password, customer.password, customer.salt)
        if(validation){
             //generateSignature
            const signature = await GenerateSignature({
            _id: customer.id,
            email: customer.email,
            verified: customer.verified
        })
        //send result to client
        return res.status(200).json({signature: signature, verified: customer.verified, email: customer.email})
        }
    }
    return res.status(500).json({message: "error in login in"})

    } catch (error) {
        console.log(error)
    }
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) =>{
    const {otp} = req.body
    const customer = req.user

    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true
                const updatedCustomerResponse = await profile.save()
                const signature = GenerateSignature({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });
                return res.status(200).json({signature: signature, verified: updatedCustomerResponse.verified, email: updatedCustomerResponse.email})
            }
        }
    }
    return res.status(500).json({message: "error in  otp validation"})
}

export const RequestOTP = async (req: Request, res: Response, next: NextFunction) =>{
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){
            const {otp, expiry} = GenerateOTP()
            profile.otp = otp
            profile.otp_expiry = expiry
            await profile.save();
            await await onRequestOtp(otp, profile.phone)

            return res.status(200).json({message: "Your OTP as been sent to your registered phone number"})
        }
    }
    return res.status(500).json({message: "an error occured while requesting validation"})
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) =>{
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){
            return res.status(200).json(profile)
        }
    }
    return res.status(500).json({message: "an error occured while displaying customer profile"})
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) =>{
    const customer = req.user;
    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body)
    const profileErrors = await validate(profileInputs,{validationError: {target: false}})
    if(profileErrors.length > 0){
        return res.status(400).json(profileErrors)
    }
    

    const {firstName, lastName, address} = profileInputs

    if(customer){
        const profile = await Customer.findById(customer._id)


        if(profile){
            profile.firstName =  firstName;
            profile.lastName = lastName;
            profile.address = address

            const result = await profile.save()
            return res.status(201).json(result)

        }
    }
    return res.status(500).json({message: "an error occured while editing customer profile"})
}