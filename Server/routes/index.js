const UserController = require("../controllers/UserController");
const errorHandler = require("../middlewares/errorHandler");

const router = require("express").Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(errorHandler)


module.exports = router;