import { BookingModel, IBooking } from "../../models/bookingModel";
import { GenericRepository } from "../GenericRepository";
import { IBookingRepository } from "../../interfaces/IBookingRepository";

export class BookingRepository extends GenericRepository<IBooking> implements IBookingRepository  {
  constructor() {
    super(BookingModel);
  }
}
