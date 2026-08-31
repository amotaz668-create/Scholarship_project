const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
    getCountries,
    createCountry,
    getCountryById,
    updateCountry,
    deleteCountry
} = require("../controller/country_controller");

router.get("/", getCountries);
router.post("/", authenticate, authorize("employee", "admin"), createCountry);
router.get("/:id", getCountryById);
router.patch("/:id", authenticate, authorize("employee", "admin"), updateCountry);
router.delete("/:id", authenticate, authorize("employee", "admin"), deleteCountry);

module.exports = router;