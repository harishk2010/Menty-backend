import { NextFunction, Request, Response } from "express";
import { BookingService } from "../../services/booking/bookingService";
import IBookingController from "./IBookingController";
import IBookingService from "@/services/booking/IBookingService";
import { error } from "console";



export class BookingController implements IBookingController{

    private bookingService:IBookingService
    constructor(bookingService:IBookingService){
        this.bookingService=bookingService
    }

    async  bookSlot  (req: Request, res: Response ,next:NextFunction):Promise<void>{
      try {

        console.log(req.body)
        const response=await this.bookingService.getBookingBySlotId(req.body.slotId)
        if(response){
          res.json({success:false})
          return
        }
        const booking = await this.bookingService.bookSlot(
          req.body.studentId,
          req.body.slotId,
          req.body.instructorId
        );
        
        console.log(booking,"booked")
        res.status(201).json({ success: true, message:"booked!",data:booking });
      } catch (error) {
        throw error
        // res.status(500).json({ success: false, message: error.message });
      }
    };
    
    async getBookingsByStudentId(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { studentId}=req.params
        console.log(studentId)
        if(!studentId){
          throw new Error("No user found!")
        }

        const response=await this.bookingService.getBookingsByStudentId(studentId)
        console.log(response)
        if(response){
          res.status(200).json({
            success:true,
            message:"fetched student Slots",
            data:response
          })
        }
        
      } catch (error) {
        throw error
        
      }
    }
}

