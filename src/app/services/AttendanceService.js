// src/app/services/AttendanceService.js

const Event = require('../models/Event');
const User = require('../models/User');
const AppError = require('../errors/AppError');

class AttendanceService {
  async create(eventId, userId, isAdmin) {
    if (isAdmin) {
      throw new AppError(
        'Forbidden: Administrators cannot attend events.',
        403
      );
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    const user = await User.findByPk(userId);

    const isAlreadyAttending = await event.hasAttendee(user);
    if (isAlreadyAttending) {
      throw new AppError('User is already attending this event.');
    }

    await event.addAttendee(user);
  }

  async delete(eventId, userId) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    const user = await User.findByPk(userId);

    await event.removeAttendee(user);
  }
}

module.exports = new AttendanceService();
