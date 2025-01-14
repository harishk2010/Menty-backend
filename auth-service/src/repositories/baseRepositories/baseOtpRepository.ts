import { Iotp } from "../../interface/otp";
import otpModel from "../../models/otpModel";
import { Document, Model } from "mongoose";

export default class baseOtpRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async saveOtp(email: string, otp: string): Promise<Iotp | null> {
    try {
      const output = await otpModel.findOneAndUpdate(
        { email },
        {
          email,
          otp,
        },
        {
          upsert: true,
          new: true,
        }
      );
      setTimeout(async () => {
        if (output?._id) {
          await otpModel.findByIdAndDelete(output._id);
        }
      }, 1200000);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async findOtp(email:string):Promise<Iotp | null >{
    try {
      const response= await otpModel.findOne({email:email})
      console.log(email,response,"Found OTP")
      return response
      
    } catch (error) {
      throw error
      
    }
  }
  async deleteOtp(email:string):Promise<Iotp | null >{
    try {
      const response= await otpModel.findOneAndDelete({email:email})
      console.log(email,response,"deleted OTP")
      return response
      
    } catch (error) {
      throw error
      
    }
  }
}
