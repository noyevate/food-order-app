import express, { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';
import mongoose, { Document, Schema } from 'mongoose';

 export interface VendorDoc extends Document {
    coverImages: [any];
    serviceAvailable: boolean;
    phone: string;
    address: string;
    foodType: [string];
    name: string;
    // Your VendorDoc properties here
    email: string;
    password: string;
    salt: string;
    foods: any;
    //pincode: any
  }

  export const FindVendor = async (id: string | undefined, email?: string): Promise<VendorDoc | null> => {
    try {
      if (email) {
        // Using find() returns an array, so consider using findOne() for a single document
        return await Vendor.findOne({ email: email }).exec();
      } else if (id) {
        return await Vendor.findById(id).exec();
      }
      return null; // Handle the case when neither id nor email is provided
    } catch (error) {
      console.error('Error in FindVendor:', error);
      return null;
    }
  };

export const CreateVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name,
        ownerName,
        foodType,
        pincode,
        phone,
        address,
        email,
        password
    } = <CreateVendorInput>req.body;

    const existingVendor = await FindVendor('', email);
    if(existingVendor !== null){
        res.json({message: 'Vendor exists with this email'})
        return
    }
    
    //generating a salt
    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)
    //encrypt password

    const createvendor = await Vendor.create({
        name,
        ownerName,
        foodType,
        pincode,
        phone,
        address,
        email,
        password: userPassword,
        rating:0,
        salt: salt,
        serviceAvailable: false,
        coverImages: [],
        foods: []

    })
    res.json({createvendor})
    return
};

export const GetVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const vendors = await Vendor.find()
    if(vendors !==  null){
        res.json(vendors)
        return;
    }
    res.json({message: "Vendor data not found!"})
    return;
};

export const GetVendorbyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const vendorId = req.params.id;
    const vendors = await FindVendor(vendorId)
    if(vendors !==  null){
        res.json(vendors)
        return;
    }
    res.json({message: "Vendor data not found!"})
    return;

};

