
import { IsEmail, IsEmpty, Length} from "class-validator";


export class CreateCustomerInputs {

    @IsEmail()
    email: string;

    @Length(7, 22)
    phone: string;

    @Length(6, 12)
    password: string;

}
export class UserLoginInputs {

    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;

}
export class EditCustomerProfileInputs {

    @Length(2, 16)
    firstName: string;

    @Length(2, 16)
    lastName: string;

    @Length(6, 16)
    address: string;

}


export interface CustomerPayload{
    _id: string;
    email: string;
    verified: boolean
}