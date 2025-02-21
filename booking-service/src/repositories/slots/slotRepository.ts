import { SlotModel, ISlot } from "../../models/slotModel";
import { GenericRepository } from "../GenericRepository";
import ISlotRepository from "./ISlotRepository";

export class SlotRepository extends GenericRepository<ISlot>  implements ISlotRepository{
  constructor() {
    super(SlotModel);
  }
}
