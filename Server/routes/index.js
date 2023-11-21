const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");
const errorHandler = require("../middlewares/errorHandler");

const router = require("express").Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(authentication)
router.get('/', UserController.test)

router.use(errorHandler)


module.exports = router;