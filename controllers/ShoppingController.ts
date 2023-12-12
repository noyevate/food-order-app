import express, { Request, Response, NextFunction } from 'express';
import {FoodDoc, Vendor} from '../models'
import { FindVendor, VendorDoc } from './AdminController'

export const GetFoodAvailability = async (req: Request, res:Response, next:NextFunction) =>{
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({pincode: pincode, serviceAvailable: true})
        .sort([['rating', 'descending']])
        .populate('foods')
        console.log(result)
    
    if(result.length > 0){
        res.status(200).json(result)
        return;
    } else{
        res.status(404).json({message: "Data not found"})
    }
    } catch (error) {
        console.log(error)
    }
}

export const GetTopRestaurant = async (req: Request, res:Response, next:NextFunction) =>{
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({pincode: pincode, serviceAvailable: true})
        .sort([['rating', 'descending']]).limit(10)
        console.log(result)
    
    if(result.length > 0){
        res.status(200).json(result)
        return;
    } else{
        res.status(404).json({message: "Data not found"})
    }
    } catch (error) {
        console.log(error)
    }
}

export const GetFoodIn30in = async (req: Request, res:Response, next:NextFunction) =>{
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({pincode: pincode, serviceAvailable: true}).populate('foods')
        console.log(result)
    
        if(result.length > 0){
            let foodresult: any = [];
            result.map(vendor => {
                const foods = vendor.foods as [FoodDoc]
                foodresult.push(...foods.filter(food => food.readyTime <= 30))
            })
            res.status(200).json({foodresult})
            return;
    } else{
        res.status(404).json({message: "Data not found"})
    }
    } catch (error) {
        console.log(error)
    }
}

export const SearchFoods = async (req: Request, res:Response, next:NextFunction) =>{
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({pincode: pincode, serviceAvailable: true}).populate('foods')
        console.log(result)
    
        if(result.length > 0){
            let foodresult: any = []
            result.map( item =>foodresult.push(...item.foods))
            res.status(200).json({foodresult})
            return;
    } else{
        res.status(404).json({message: "Data not found"})
    }
    } catch (error) {
        console.log(error)
    }
}

export const RestaurantById = async (req: Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params.id;
        const result = await Vendor.findById(id).populate('foods')
        console.log(result)
    
    if(result){
        res.status(200).json(result)
        return;
    } else{
        res.status(404).json({message: "Data not found"})
    }
    } catch (error) {
        console.log(error)
    }
}