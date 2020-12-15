const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json(true)
});

module.exports = router;