import { slotController } from "../config/dependencyInjector";
import express, { Router } from "express";


const router = Router();

router
.route('/createSlots')
.post( slotController.createSlots.bind(slotController));

router
.route('/slots/:instructorId')
.get( slotController.getInstructorSlots.bind(slotController));
router
.route('/slot/:slotId')
.get(slotController.getSlotById.bind(slotController))
router
.route('/deleteSlot/:slotId')
.delete( slotController.deleteSlot.bind(slotController));


const slotRoutes=router
export default slotRoutes;
