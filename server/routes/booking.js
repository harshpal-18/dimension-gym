import { Router } from 'express';
import { getAvailableSlots, createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect, memberOnly } from '../middleware/auth.js';

const router = Router();

router.get('/slots', protect, getAvailableSlots);
router.post('/', protect, memberOnly, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
