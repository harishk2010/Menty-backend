import { NextFunction, Request, Response } from "express";
import { BookingService } from "../../services/booking/bookingService";
import IBookingController from "../interfaces/IBookingController";
import IBookingService from "../../services/interfaces/IBookingService";
import { error } from "console";
import produce from "../../config/kafka/producer";



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
        const instructorShare=(req.body.amountPaid*0.9)
        const booking = await this.bookingService.bookSlot(
          req.body.studentId,
          req.body.slotId,
          req.body.instructorId
        );
        if(booking){

          produce('update-instructor-wallet',{instructorId:req.body.instructorId,txnid:req.body.txnid,amount:instructorShare,type:'credit',description:`Payment Received for BookingId:${booking._id}`})
          produce('add-booking',booking)
        }
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
    async getBookingsByInstructorId(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { instructorId}=req.params
        console.log(instructorId)
        if(!instructorId){
          throw new Error("No user found!")
        }

        const response=await this.bookingService.getBookingsByInstructorId(instructorId)
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

    async getBookindDataById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {

        const { bookingId}=req.params
        console.log(bookingId)
        if(!bookingId){
          throw new Error("No bookingId found!")
        }

        const response=await this.bookingService.getBookindDataById(bookingId)
        console.log(response)
        if(response){
          res.status(200).json({
            success:true,
            message:"fetched bookingData",
            data:response
          })
        }
        
      } catch (error) {
        
      }
    }
}

