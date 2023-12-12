import express, { Request, Response, NextFunction } from 'express';
import { GetFoodAvailability, GetFoodIn30in, GetTopRestaurant, RestaurantById, SearchFoods } from '../controllers/ShoppingController';


const router = express.Router()

/*----- Available food-------*/
router.get('/:pincode', GetFoodAvailability)

/*---------Top Restaurant------------*/
router.get('/top-restaurants/:pincode', GetTopRestaurant)

/*-----Foods Available in 30min---------*/
router.get('/ready-in-30-min/:pincode', GetFoodIn30in)

/*------------------ Search Foods ----------*/
router.get('/search/:pincode', SearchFoods)

/*---------------- find Restaurant by Id----------*/ 
router.get('/restaurant/:id', RestaurantById)

export {router as ShoppingRoute}