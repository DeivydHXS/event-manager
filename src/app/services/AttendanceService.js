// src/app/services/AttendanceService.js

const Event = require('../models/Event');
const User = require('../models/User');
const AppError = require('../errors/AppError');

class AttendanceService {
  /**
   * Inscreve um usuário em um evento.
   * @param {number} eventId - ID do evento.
   * @param {number} userId - ID do usuário.
   * @param {boolean} isAdmin - Se o usuário é um administrador.
   */
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

    // Verifica se o usuário já está inscrito (opcional, mas boa prática)
    const isAlreadyAttending = await event.hasAttendee(user);
    if (isAlreadyAttending) {
      throw new AppError('User is already attending this event.');
    }

    await event.addAttendee(user);
  }

  /**
   * Cancela a inscrição de um usuário em um evento.
   * @param {number} eventId - ID do evento.
   * @param {number} userId - ID do usuário.
   */
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
