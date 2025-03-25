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
  price: number,
  timezone: string   
): Promise<ISlot[]> {
  try {
    console.log("Processing slots with:", { 
      instructorId, startDate, endDate, days, startTime, endTime, price, timezone 
    });

    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
      console.error("Invalid date objects:", { startTimeObj, endTimeObj });
      throw new Error("Invalid start or end time provided");
    }

    startTimeObj.setHours(startTimeObj.getHours() + 1);
    endTimeObj.setHours(endTimeObj.getHours() + 1);

    
    const rule = new RRule({
      freq: RRule.WEEKLY, 
      interval: 1, 
      byweekday: days, 
      dtstart: new Date(startDate), 
      until: new Date(endDate),
    });

    // Generate all dates based on the rule
    const slotDates = rule.all();
    console.log(`Generated ${slotDates.length} dates based on rule`);

    const slots = slotDates.map((date) => {
      const dateString = date.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)

      const startDateTime = new Date(`${dateString}T${startTimeObj.toISOString().split('T')[1]}`);
      const endDateTime = new Date(`${dateString}T${endTimeObj.toISOString().split('T')[1]}`);

      // Validate the datetime objects
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.error("Created invalid datetime:", { 
          dateString, startTime, endTime, startDateTime, endDateTime 
        });
        throw new Error(`Invalid datetime created for date: ${dateString}`);
      }

      return {
        instructorId,
        startTime: startDateTime,
        endTime: endDateTime,
        price,
        timezone, // Store the timezone offset
      };
    });

    // Insert slots into the database
    const createdSlots = await Promise.all(
      slots.map((slot) =>
        this.slotRepository.create(slot as Partial<ISlot>)
      )
    );

    return createdSlots;
  } catch (error) {
    console.error("Error in createRecurringSlots:", error);
    throw error;
  }
}
  async getInstructorSlots(instructorId: string): Promise<ISlot[]> {
    try {
      return await this.slotRepository.findAll({ instructorId });
    } catch (error) {
      throw error;
    }
  }

  async deleteSlot(slotId: string): Promise<ISlot | null> {
    try {
      return await this.slotRepository.delete(slotId);
    } catch (error) {
      throw error;
    }
  }

  async getSlotById(slotId: string): Promise<ISlot | null> {
    try {
      return await this.slotRepository.findById(slotId);
    } catch (error) {
      throw error;
    }
  }
}
