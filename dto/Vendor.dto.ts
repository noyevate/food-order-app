export interface CreateVendorInput {
    name:string,
    ownerName:string,
    foodType:string,
    pincode:string,
    phone:string,
    address:string,
    email:string,
    password:string
}

export interface VendorLoginInput {
    email: string
    password: string
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodTypes:[string]
}

export interface EditVendorInput{
    name: string;
    address: string;
    phone: string;
    foodType:[string]
}