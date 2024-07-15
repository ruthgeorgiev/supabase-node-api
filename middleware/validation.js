const { body, validationResult } = require('express-validator');

exports.validateOrder = [
  body('price').isFloat({ gt: 0 }),
  body('date').isISO8601(),
  body('user_id').isInt({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateUser = [
  body('first_name').isString().isLength({ min: 1, max: 255 }),
  body('last_name').isString().isLength({ min: 1, max: 255 }),
  body('age').isInt({ min: 0 }),
  body('active').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
