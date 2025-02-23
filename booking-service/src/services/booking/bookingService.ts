import { IBookingRepository } from "../../repositories/booking/IBookingRepository";
import { IBooking } from "../../models/bookingModel";
import { BookingRepository } from "../../repositories/booking/bookingRepository";
import IBookingService from "./IBookingService";
import { SlotModel } from "../../models/slotModel";

export class BookingService implements IBookingService{
  private bookingRepository: IBookingRepository;

  constructor(bookingRepository: IBookingRepository) {
    this.bookingRepository = bookingRepository
  }

  async bookSlot(studentId: string, slotId: string, instructorId: string):Promise<IBooking | null> {
    try {
      // return this.bookingRepository.updateOne({slotId},{
      //   studentId,
        
      //   instructorId,
      //   status: "confirmed",
      // });
      const response=await this.bookingRepository.create({studentId,slotId,instructorId,status:"confirmed"})
      await SlotModel.findByIdAndUpdate(slotId,{isBooked:true})
      return response
    } catch (error) {
      throw error
    }
  }
  async getBookingBySlotId(slotId: string): Promise<IBooking | null> {
    try {
      return await this.bookingRepository.findOne({slotId})
      
    } catch (error) {
      throw error
      
    }
  }
  async getBookingsByStudentId(studentId: string): Promise<IBooking[] | null> {
    try {
      return await this.bookingRepository.findAll({studentId})
      
    } catch (error) {
      throw error
      
    }
    
  }
  async getBookingsByInstructorId(instructorId: string): Promise<IBooking[] | null> {
    try {
      return await this.bookingRepository.findAll({instructorId})
      
    } catch (error) {
      throw error
      
    }
    
  }
  async getBookindDataById(bookingId: string): Promise<IBooking | null> {
    try {
      return await this.bookingRepository.findById(bookingId)
      
    } catch (error) {
      throw error
      
    }
  }
}
