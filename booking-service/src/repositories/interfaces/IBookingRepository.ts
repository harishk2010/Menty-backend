import { IBooking } from "../../models/bookingModel";
import { GenericRepository } from "../GenericRepository";

export interface IBookingRepository extends GenericRepository<IBooking> {}
