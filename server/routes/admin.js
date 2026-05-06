import { Router } from 'express';
import { getStats, getUsers, getPayments, getBookings, updateUserMembership, toggleUserStatus } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/payments', getPayments);
router.get('/bookings', getBookings);
router.put('/users/:id/membership', updateUserMembership);
router.put('/users/:id/toggle', toggleUserStatus);

export default router;
