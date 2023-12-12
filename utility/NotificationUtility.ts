




//otp
export const GenerateOTP =  () =>{
    const otp = Math.floor(1000000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    return {otp, expiry}
}

export const onRequestOtp = async (otp: number, toPhoneNumber: string) =>{
    const accoutSid = 'AC5c770f30b9231270488f1815d34030eb';
    const authToken = 'e88c0a8f94345756e15ed2c57614902a';
    const client = require('twilio')(accoutSid,authToken)
    const response = await client.messages.create({
        body: `Your otp is ${otp}`,
        from: "+12058392557",
        to: `+234${toPhoneNumber}`
    });
    return response;
}
