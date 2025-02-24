import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { slotController } from "../config/dependencyInjector";
import express, { Router } from "express";


const router = Router();

router
.route('/createSlots')
.post(authenticateToken, slotController.createSlots.bind(slotController));

router
.route('/slots/:instructorId')
.get(authenticateToken, slotController.getInstructorSlots.bind(slotController));
router
.route('/slot/:slotId')
.get(authenticateToken,slotController.getSlotById.bind(slotController))
router
.route('/deleteSlot/:slotId')
.delete(authenticateToken, slotController.deleteSlot.bind(slotController));


const slotRoutes=router
export default slotRoutes;
