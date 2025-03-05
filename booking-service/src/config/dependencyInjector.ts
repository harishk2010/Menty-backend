import ISlotController from "../controllers/interfaces/ISlotController"
import SlotController from "../controllers/slots/slotController"
import ISlotService from "../services/interfaces/ISlotService"
import { SlotService } from "../services/slots/slotService"
import ISlotRepository from "../repositories/interfaces/ISlotRepository"
import { SlotRepository } from "../repositories/slots/slotRepository"
import IBookingController from "../controllers/interfaces/IBookingController"
import { BookingController } from "../controllers/booking/bookingController"
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository"
import IBookingService from "../services/interfaces/IBookingService"
import { BookingService } from "../services/booking/bookingService"
import { BookingRepository } from "../repositories/booking/bookingRepository"


const slotRepository:ISlotRepository=new SlotRepository()
const slotService:ISlotService=new SlotService(slotRepository)
const slotController:ISlotController=new SlotController(slotService)

const bookingRepository:IBookingRepository=new BookingRepository()
const bookingService:IBookingService=new BookingService(bookingRepository)
const bookingController:IBookingController=new BookingController(bookingService)


export { slotController,bookingController }