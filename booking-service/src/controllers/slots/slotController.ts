import { NextFunction, Request, Response } from "express";
import { SlotService } from "../../services/slots/slotService";
import ISlotController from "./ISlotController";
import ISlotService from "@/services/slots/ISlotService";



export default class  SlotController implements ISlotController{
    private slotService:ISlotService
    constructor(slotService:ISlotService){
        this.slotService=slotService
    }

    async createSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body.instructorId,
                req.body.startDate,
                req.body.endDate,
                req.body.days,
                req.body.startTime,
                req.body.endTime,
                req.body.price)
            const slots = await this.slotService.createRecurringSlots(
              req.body.instructorId,
              req.body.startDate,
              req.body.endDate,
              req.body.days,
              req.body.startTime,
              req.body.endTime,
              req.body.price
            );
            res.status(201).json({ success: true,message:"added slots", data:slots });
          } catch (error) {
            console.log(error)
            throw error
          }
    }
    async getInstructorSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { instructorId}=req.params
            console.log(instructorId)
            if(!instructorId){
                res.status(401).json({success:false,message:"No Instructor found"})
                return
            }
            const response=await this.slotService.getInstructorSlots(instructorId)
            console.log(response,"all slots")
            if(response){
                res.status(200).json({
                    success:true,
                    message:"Fetched all the slots",
                    data:response
                })
            }
            
        } catch (error) {
            console.log(error)
            throw error 
        }
    }
    
    async deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slotId}=req.params
            console.log(slotId ,"slotid")
            if(!slotId){
                res.status(401).json({success:false,message:"No Slot Id found"})
            }
            const response=await this.slotService.deleteSlot(slotId)
            if(response){
                res.status(200).json({
                    success:true,
                    message:"deleted slot!",
                    data:response
                })
            }
            
        } catch (error) {
            console.log(error)
            throw error 
            
        }
    }
    
    async getSlotById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slotId}=req.params
            console.log(slotId)
            if(!slotId){
                res.status(401).json({success:false,message:"No Slot Id found"})
            }

            const response=await this.slotService.getSlotById(slotId)
            console.log(response)
            if(response){
                res.status(200).json({
                    success:true,
                    message:"fetched slot!",
                    data:response
                })
                return
            }
            res.status(500).json({
                success:false,
                message:"error fetching slot!",
                data:response
            })

            
        } catch (error) {
            console.log(error)
            throw error 
            
        }
    }
}