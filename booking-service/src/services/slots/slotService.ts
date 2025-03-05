import { SlotRepository } from "../../repositories/slots/slotRepository";
import { RRule } from "rrule";
import ISlotService from "../interfaces/ISlotService";
import { ISlot } from "../../models/slotModel";
import ISlotRepository from "../../repositories/interfaces/ISlotRepository";

export class SlotService implements ISlotService {
  private slotRepository: ISlotRepository;

  constructor(slotRepository: ISlotRepository) {
    this.slotRepository = slotRepository;
  }

  async createRecurringSlots(
    instructorId: string,
    startDate: string,
    endDate: string,
    days: number[],
    startTime: string,
    endTime: string,
    price: number
  ): Promise<ISlot[]> {
    try {
      const rule = new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: days,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      });
  
      const slotDates = rule.all();
  
      // Generate slot objects
      const slots = slotDates.map((date) => ({
        instructorId,
        startTime: new Date(`${date.toISOString().split("T")[0]}T${startTime}`),
        endTime: new Date(`${date.toISOString().split("T")[0]}T${endTime}`),
        price,
      }));
  
      // **Check for existing slots before inserting**
      const existingSlots = await this.slotRepository.findAll({
        instructorId,
        startTime: { $in: slots.map(slot => slot.startTime) },
        endTime: { $in: slots.map(slot => slot.endTime) }
      });
  
      // Filter out duplicates
      const newSlots = slots.filter(slot =>
        !existingSlots.some(existingSlot =>
          existingSlot.startTime.getTime() === slot.startTime.getTime() &&
          existingSlot.endTime.getTime() === slot.endTime.getTime()
        )
      );
  
      // Insert only new (non-duplicate) slots
      const createdSlots = await Promise.all(
        newSlots.map(slot => this.slotRepository.create(slot as Partial<ISlot>))
      );
  
      return createdSlots;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  

  async getInstructorSlots(instructorId: string): Promise<ISlot[]> {
      try {

        return await this.slotRepository.findAll({instructorId})
        
      } catch (error) {
        console.log(error)
        throw error
    }
}

async deleteSlot(slotId: string): Promise<ISlot | null> {
    try {
        return await this.slotRepository.delete(slotId)
        
        
    } catch (error) {
          console.log(error)
          throw error
        
      }
    }
    
    async getSlotById(slotId: string): Promise<ISlot | null> {
      try {
          return await this.slotRepository.findById(slotId)
          
          
      } catch (error) {
            console.log(error)
            throw error
          
        }
      
  }
}
