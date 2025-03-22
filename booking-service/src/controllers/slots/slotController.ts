import { NextFunction, Request, Response } from "express";
import ISlotController from "../interfaces/ISlotController";
import ISlotService from "../../services/interfaces/ISlotService";
import { StatusCode } from "../../utils/enums";
import { SlotErrorMessages, SlotSuccessMessages } from "../../utils/constants";

export default class SlotController implements ISlotController {
  private slotService: ISlotService;
  constructor(slotService: ISlotService) {
    this.slotService = slotService;
  }

  // async createSlots(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const slots = await this.slotService.createRecurringSlots(
  //       req.body.instructorId,
  //       req.body.startDate,
  //       req.body.endDate,
  //       req.body.days,
  //       req.body.startTime,
  //       req.body.endTime,
  //       req.body.price
  //     );
  //     res
  //       .status(StatusCode.CREATED)
  //       .json({ success: true, message: SlotSuccessMessages.SLOTS_CREATED, data: slots });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
 
  async createSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract data from the request body
      const {
        instructorId,
        startDate,
        endDate,
        days,
        startTime, // Local time with offset (e.g., "2025-03-22T15:51:00+05:30")
        endTime,   // Local time with offset (e.g., "2025-03-22T15:52:00+05:30")
        price,
        timezone,  // Timezone offset (e.g., "+05:30")
      } = req.body;
  
      // Log the received data for debugging
      console.log('Received data in controller:', {
        instructorId,
        startDate,
        endDate,
        days,
        startTime,
        endTime,
        price,
        timezone,
      });
  
      // Validate required fields
      if (!instructorId || !startDate || !endDate || !days || !startTime || !endTime || !price || !timezone) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'All fields are required, including timezone.',
        });
        return;
      }
  
      // Call the service to create recurring slots
      const slots = await this.slotService.createRecurringSlots(
        instructorId,
        startDate,
        endDate,
        days,
        startTime,
        endTime,
        price,
        timezone
      );
  
      // Send success response
      res.status(StatusCode.CREATED).json({
        success: true,
        message: SlotSuccessMessages.SLOTS_CREATED,
        data: slots,
      });
    } catch (error) {
      console.error('Error in createSlots controller:', error);
      next(error); // Pass the error to the error-handling middleware
    }
  }


  async getInstructorSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { instructorId } = req.params;

      if (!instructorId) {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ success: false, message: SlotErrorMessages.INVALID_INSTRUCTOR_ID });
        return;
      }
      const response = await this.slotService.getInstructorSlots(instructorId);

      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: SlotSuccessMessages.INSTRUCTOR_SLOTS_FETCHED,
          data: response,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slotId } = req.params;

      if (!slotId) {
        res.status(StatusCode.BAD_REQUEST).json({ success: false, message: SlotErrorMessages.INVALID_SLOT_ID });
      }
      const response = await this.slotService.deleteSlot(slotId);
      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: SlotSuccessMessages.SLOT_DELETED,
          data: response,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getSlotById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slotId } = req.params;

      if (!slotId) {
        res.status(StatusCode.BAD_REQUEST).json({ success: false, message: SlotErrorMessages.INVALID_SLOT_ID });
      }

      const response = await this.slotService.getSlotById(slotId);

      if (response) {
        res.status(200).json({
          success: true,
          message: SlotSuccessMessages.SLOT_FETCHED,
          data: response,
        });
        return;
      }
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SlotErrorMessages.FETCH_SLOTS_FAILED,
        data: response,
      });
    } catch (error) {
      throw error;
    }
  }
}
