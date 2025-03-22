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

  // async createRecurringSlots(
  //   instructorId: string,
  //   startDate: string,
  //   endDate: string,
  //   days: number[],
  //   startTime: string,  // Local time with offset (e.g., "2025-03-22T15:00:00+05:30")
  //   endTime: string,    // Local time with offset (e.g., "2025-03-22T16:00:00+05:30")
  //   price: number,
  //   timezone: string    // Timezone offset (e.g., "+05:30")
  // ): Promise<ISlot[]> {
  //   try {
  //     console.log("Processing slots with:", { 
  //       instructorId, startDate, endDate, days, startTime, endTime, price, timezone 
  //     });
  
  //     // Parse the incoming local times with timezone
  //     const startTimeObj = new Date(startTime);
  //     const endTimeObj = new Date(endTime);
  
  //     // Check if the dates are valid
  //     if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
  //       console.error("Invalid date objects:", { startTimeObj, endTimeObj });
  //       throw new Error("Invalid start or end time provided");
  //     }
  
  //     // Generate recurring dates using rrule
  //     const rule = new RRule({
  //       freq: RRule.WEEKLY, // Weekly recurrence
  //       interval: 1, // Every week
  //       byweekday: days, // Selected days (e.g., [0, 1] for Sunday and Monday)
  //       dtstart: new Date(startDate), // Start date
  //       until: new Date(endDate), // End date
  //     });
  
  //     // Generate all dates based on the rule
  //     const slotDates = rule.all();
  //     console.log(`Generated ${slotDates.length} dates based on rule`);
  
  //     // Generate slot objects
  //     const slots = slotDates.map((date) => {
  //       const dateString = date.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)
  
  //       // Create full datetime objects in local time
  //       const startDateTime = new Date(`${dateString}T${startTime.split('T')[1]}`);
  //       const endDateTime = new Date(`${dateString}T${endTime.split('T')[1]}`);
  
  //       // Validate the datetime objects
  //       if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
  //         console.error("Created invalid datetime:", { 
  //           dateString, startTime, endTime, startDateTime, endDateTime 
  //         });
  //         throw new Error(`Invalid datetime created for date: ${dateString}`);
  //       }
  
  //       return {
  //         instructorId,
  //         startTime: startDateTime,
  //         endTime: endDateTime,
  //         price,
  //         timezone, // Store the timezone offset
  //       };
  //     });
  
  //     // Insert slots into the database
  //     const createdSlots = await Promise.all(
  //       slots.map((slot) =>
  //         this.slotRepository.create(slot as Partial<ISlot>)
  //       )
  //     );
  
  //     return createdSlots;
  //   } catch (error) {
  //     console.error("Error in createRecurringSlots:", error);
  //     throw error;
  //   }
  // }
 // In your backend service
// In your backend service
async createRecurringSlots(
  instructorId: string,
  startDate: string,
  endDate: string,
  days: number[],
  startTime: string,  // Local time with offset (e.g., "2025-03-22T19:00:00+06:30")
  endTime: string,    // Local time with offset (e.g., "2025-03-22T20:00:00+06:30")
  price: number,
  timezone: string    // Timezone offset (e.g., "+06:30")
): Promise<ISlot[]> {
  try {
    console.log("Processing slots with:", { 
      instructorId, startDate, endDate, days, startTime, endTime, price, timezone 
    });

    // Parse the incoming local times with timezone
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    // Check if the dates are valid
    if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
      console.error("Invalid date objects:", { startTimeObj, endTimeObj });
      throw new Error("Invalid start or end time provided");
    }

    // Add 1 hour to the times
    startTimeObj.setHours(startTimeObj.getHours() + 1);
    endTimeObj.setHours(endTimeObj.getHours() + 1);

    // Generate recurring dates using rrule
    const rule = new RRule({
      freq: RRule.WEEKLY, // Weekly recurrence
      interval: 1, // Every week
      byweekday: days, // Selected days (e.g., [0, 1] for Sunday and Monday)
      dtstart: new Date(startDate), // Start date
      until: new Date(endDate), // End date
    });

    // Generate all dates based on the rule
    const slotDates = rule.all();
    console.log(`Generated ${slotDates.length} dates based on rule`);

    // Generate slot objects
    const slots = slotDates.map((date) => {
      const dateString = date.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)

      // Create full datetime objects with the adjusted times
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
