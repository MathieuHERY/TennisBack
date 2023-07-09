const express = require("express");
const router = express.Router();

const indexController = require("../controllers/index");

/* GET homepage. */

router.post("/score", function (req, res, next) {
  const response = indexController.drawScore(JSON.parse(req.body.matchDescription),JSON.parse(req.body.players) );
  res.json(response);
});

module.exports = router;