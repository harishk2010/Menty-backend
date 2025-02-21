import { SlotRepository } from "../../repositories/slots/slotRepository";
import { RRule } from "rrule";
import ISlotService from "./ISlotService";
import { ISlot } from "../../models/slotModel";
import ISlotRepository from "../../repositories/slots/ISlotRepository";

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
  ): Promise<ISlot> {
 try {
    const rule = new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: days,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      });
  
      const slots = rule.all().map((date) => ({
        instructorId,
        startTime: new Date(`${date.toISOString().split("T")[0]}T${startTime}`),
        endTime: new Date(`${date.toISOString().split("T")[0]}T${endTime}`),
        price,
      }));
      // const createdSlots: ISlot[] = [];
      const createdSlots = await Promise.all(
          slots.map(slot => this.slotRepository.create(slot as Partial<ISlot>))
        );
      //   return createdSlots;
    return createdSlots as unknown as ISlot;
 } catch (error) {
    console.log(error)
    throw error
 }

    // return this.slotRepository.create(slots );
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
