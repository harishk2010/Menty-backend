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

  // async createRecurringSlots(
  //   instructorId: string,
  //   startDate: string,
  //   endDate: string,
  //   days: number[],
  //   startTime: string,
  //   endTime: string,
  //   price: number
  // ): Promise<ISlot[]> {
  //   try {
  //     const rule = new RRule({
  //       freq: RRule.WEEKLY,
  //       interval: 1,
  //       byweekday: days,
  //       dtstart: new Date(startDate),
  //       until: new Date(endDate),
  //     });

  //     const slotDates = rule.all();

  //     // Generate slot objects
  //     const slots = slotDates.map((date) => ({
  //       instructorId,
  //       startTime: new Date(`${date.toISOString().split("T")[0]}T${startTime}`),
  //       endTime: new Date(`${date.toISOString().split("T")[0]}T${endTime}`),
  //       price,
  //     }));

  //     // **Check for existing slots before inserting**
  //     const existingSlots = await this.slotRepository.findAll({
  //       instructorId,
  //       startTime: { $in: slots.map((slot) => slot.startTime) },
  //       endTime: { $in: slots.map((slot) => slot.endTime) },
  //     });

  //     // Filter out duplicates
  //     const newSlots = slots.filter(
  //       (slot) =>
  //         !existingSlots.some(
  //           (existingSlot) =>
  //             existingSlot.startTime.getTime() === slot.startTime.getTime() &&
  //             existingSlot.endTime.getTime() === slot.endTime.getTime()
  //         )
  //     );

  //     // Insert only new (non-duplicate) slots
  //     const createdSlots = await Promise.all(
  //       newSlots.map((slot) =>
  //         this.slotRepository.create(slot as Partial<ISlot>)
  //       )
  //     );

  //     return createdSlots;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async createRecurringSlots(
    instructorId: string,
    startDate: string,
    endDate: string,
    days: number[],
    startTime: string,  // Expecting ISO format (UTC)
    endTime: string,    // Expecting ISO format (UTC)
    price: number
  ): Promise<ISlot[]> {
    try {
      console.log("Processing slots with:", { 
        instructorId, startDate, endDate, days, startTime, endTime, price 
      });
  
      // Parse the incoming ISO date strings as UTC
      const startTimeObj = new Date(startTime);
      const endTimeObj = new Date(endTime);
  
      // Check if the dates are valid
      if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
        console.error("Invalid date objects:", { startTimeObj, endTimeObj });
        throw new Error("Invalid start or end time provided");
      }
  
      // Extract time portion in HH:MM:SS format (UTC)
      const startTimeString = startTimeObj.toISOString().split('T')[1].slice(0, 8);
      const endTimeString = endTimeObj.toISOString().split('T')[1].slice(0, 8);
  
      console.log("Extracted time strings (UTC):", { startTimeString, endTimeString });
  
      const rule = new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: days,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      });
  
      const slotDates = rule.all();
      console.log(`Generated ${slotDates.length} dates based on rule`);
  
      // Generate slot objects
      const slots = slotDates.map((date) => {
        const dateString = date.toISOString().split('T')[0];
  
        // Create full datetime objects in UTC
        const startDateTime = new Date(`${dateString}T${startTimeString}Z`);
        const endDateTime = new Date(`${dateString}T${endTimeString}Z`);
  
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.error("Created invalid datetime:", { 
            dateString, startTimeString, endTimeString, startDateTime, endDateTime 
          });
          throw new Error(`Invalid datetime created for date: ${dateString}`);
        }
  
        return {
          instructorId,
          startTime: startDateTime,
          endTime: endDateTime,
          price,
        };
      });
  
      // Check for existing slots before inserting
      const existingSlots = await this.slotRepository.findAll({
        instructorId,
        startTime: { $in: slots.map((slot) => slot.startTime) },
        endTime: { $in: slots.map((slot) => slot.endTime) },
      });
  
      // Filter out duplicates
      const newSlots = slots.filter(
        (slot) =>
          !existingSlots.some(
            (existingSlot) =>
              existingSlot.startTime.getTime() === slot.startTime.getTime() &&
              existingSlot.endTime.getTime() === slot.endTime.getTime()
          )
      );
  
      console.log(`Found ${existingSlots.length} existing slots. Creating ${newSlots.length} new slots.`);
  
      // Insert only new (non-duplicate) slots
      const createdSlots = await Promise.all(
        newSlots.map((slot) =>
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
