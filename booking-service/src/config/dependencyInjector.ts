import ISlotController from "../interfaces/ISlotController"
import SlotController from "../controllers/slots/slotController"
import ISlotService from "../interfaces/ISlotService"
import { SlotService } from "../services/slots/slotService"
import ISlotRepository from "../interfaces/ISlotRepository"
import { SlotRepository } from "../repositories/slots/slotRepository"
import IBookingController from "../interfaces/IBookingController"
import { BookingController } from "../controllers/booking/bookingController"
import { IBookingRepository } from "../interfaces/IBookingRepository"
import IBookingService from "../interfaces/IBookingService"
import { BookingService } from "../services/booking/bookingService"
import { BookingRepository } from "../repositories/booking/bookingRepository"


const slotRepository:ISlotRepository=new SlotRepository()
const slotService:ISlotService=new SlotService(slotRepository)
const slotController:ISlotController=new SlotController(slotService)

const bookingRepository:IBookingRepository=new BookingRepository()
const bookingService:IBookingService=new BookingService(bookingRepository)
const bookingController:IBookingController=new BookingController(bookingService)


export { slotController,bookingController }