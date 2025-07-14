// src/app/controllers/AttendanceController.js

const AttendanceService = require('../services/AttendanceService');

class AttendanceController {
  async store(req, res) {
    await AttendanceService.create(req.params.eventId, req.userId, req.isAdmin);
    return res
      .status(201)
      .json({ message: 'Successfully subscribed to the event.' });
  }

  async delete(req, res) {
    await AttendanceService.delete(req.params.eventId, req.userId);
    return res.status(204).send();
  }
}

module.exports = new AttendanceController();
