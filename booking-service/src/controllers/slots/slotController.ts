import { NextFunction, Request, Response } from "express";
import ISlotController from "../interfaces/ISlotController";
import ISlotService from "../../services/interfaces/ISlotService";
import { StatusCode } from "@/utils/enums";
import { SlotErrorMessages, SlotSuccessMessages } from "@/utils/constants";

export default class SlotController implements ISlotController {
  private slotService: ISlotService;
  constructor(slotService: ISlotService) {
    this.slotService = slotService;
  }

  async createSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const slots = await this.slotService.createRecurringSlots(
        req.body.instructorId,
        req.body.startDate,
        req.body.endDate,
        req.body.days,
        req.body.startTime,
        req.body.endTime,
        req.body.price
      );
      res
        .status(StatusCode.CREATED)
        .json({ success: true, message: SlotSuccessMessages.SLOTS_CREATED, data: slots });
    } catch (error) {
      throw error;
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
