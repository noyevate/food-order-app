import express, { Request, Response, NextFunction } from 'express';
import { EditVendorInput, VendorLoginInput } from '../dto';
import { FindVendor, VendorDoc } from './AdminController'; // Assuming VendorDoc is defined in AdminController
import { GenerateSignature, PasswordValidation, ValidateSignature } from '../utility';
import { Food } from '../models';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as VendorLoginInput; // Avoid type assertion, use as for better type-checking
  const existingVendor: VendorDoc | null = await FindVendor('', email);

  if (existingVendor !== null) {
    const validation = await PasswordValidation(password, existingVendor.password, existingVendor.salt);

    if (validation) {
        const signature = GenerateSignature({
            _id: existingVendor.id,
            email: existingVendor.email,
            name: existingVendor.name,
            foodTypes:existingVendor.foodType
        })
      return res.json({ message: 'Login successful', signature });
    }
  }
  res.json({ message: 'Login credentials not valid' });
  return;
};

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) =>{
  const user = (req as any).user;
  if(user){
    const existingVendor = await FindVendor(user._id)
    res.json(existingVendor);
    return;
  }


}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) =>{
  const {name, address, phone, foodType} = <EditVendorInput>req.body;
  const user = (req as any).user;
  if(user){
    const existingVendor = await FindVendor(user._id)
    if(existingVendor !== null){
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType

      const savedResult = await existingVendor.save()
      res.json({message: savedResult})

    }
    res.json(existingVendor);
    return;
  } else{
    res.json({message: "oga i no know "})
  }
}

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) =>{
  const user = (req as any).user;
  if(user){
    const vendor = await FindVendor(user._id)
    if(vendor !== null){

      const files = req.files as  [Express.Multer.File]
      const images = files.map((files: Express.Multer.File) => files.filename )
      vendor.coverImages.push(...images)
      const result = await vendor.save()
      res.json(result);
      return
    }

    return;
  } else{
    res.json({message: "something went wrong!"})
    return;
  } 
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) =>{
  const user = (req as any).user;
  if(user){
    const existingVendor = await FindVendor(user._id)
    if(existingVendor !== null){
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable
      const savedResult = await existingVendor.save()
      res.json({message: savedResult})
      return;

    }
    res.json(existingVendor);
    return;
  } else{
    res.json({message: "something went wrong!"})
    return;
  }
}

export const AddFood = async (req: Request, res: Response, next: NextFunction) =>{
  const user = (req as any).user;
  if(user){
    const {name, description, category, foodType, readyTime, price} = req.body;
    const vendor = await FindVendor(user._id)
    if(vendor !== null){

      const files = req.files as [Express.Multer.File]
      const images = files.map((files: Express.Multer.File) => files.filename )

      const createdFood = await Food.create({
        vendorId: vendor.id,
        name, 
        description, 
        category, 
        foodType, 
        readyTime,
        price,
        images: images,
        rating: 0

      });
      vendor.foods.push(createdFood)
      const result = await vendor.save()
      res.json(result);
      return
    }

    return;
  } else{
    res.json({message: "something went wrong!"})
    return;
  }
}

export const GetFood = async (req: Request, res: Response, next: NextFunction) =>{
  const user = (req as any).user;
  if(user){

    const foods = await Food.find({vendorId: user._id})

    if(foods !== null){
      res.json(foods)
      return;
    }
    return;
  } else{
    res.json({message: "something went wrong!"})
    return;
  }
}