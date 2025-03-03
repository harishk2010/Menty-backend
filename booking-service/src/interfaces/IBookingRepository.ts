import { IBooking } from "../models/bookingModel";
import { GenericRepository } from "../repositories/GenericRepository";


export interface IBookingRepository extends GenericRepository<IBooking>{}