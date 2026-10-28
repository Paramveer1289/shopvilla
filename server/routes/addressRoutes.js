// Delivery Address Routes
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');
const { validateAddress } = require('../middleware/validators');

// All address routes require authentication
router.use(protect);

router.get('/', addressController.getAddresses);
router.post('/', validateAddress, addressController.addAddress);
router.put('/:addressId', validateAddress, addressController.updateAddress);
router.delete('/:addressId', addressController.deleteAddress);
router.patch('/:addressId/default', addressController.setDefaultAddress);

module.exports = router;
