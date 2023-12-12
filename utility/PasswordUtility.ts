import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import { Request } from 'express';
import { VendorPayload } from '../dto';
import { APP_SECRET } from '../config';
import { AuthPayload } from '../dto/Auth.dto';
//import * from '../middlewares'


export const GenerateSalt = async () =>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password:string, salt:string) =>{
    return await bcrypt.hash(password, salt)
}

export const PasswordValidation = async (enteredPassword:string, savedPassword:string, salt:string) =>{
    return await GeneratePassword(enteredPassword, salt) === savedPassword
}

export const GenerateSignature = (payload: AuthPayload) =>{
    const Signature = jwt.sign(payload, APP_SECRET, {expiresIn: '5d'})
    return Signature
}

export const ValidateSignature = async (req: Request) =>{
    const signature = req.get('Authorization')
    if(signature){
        const payload = (await jwt.verify(signature.split(' ')[1], APP_SECRET) ) as AuthPayload
        (req as any).user = payload;
        return true;
    }
}