const Event = require('../models/Event');
const User = require('../models/User');

class AttendanceController {
  async store(req, res) {
    if (req.isAdmin) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Administrators cannot attend events.' });
    }

    const { eventId } = req.params;
    const { userId } = req;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await event.addAttendee(user);

    return res
      .status(201)
      .json({ message: 'Successfully subscribed to the event.' });
  }

  async delete(req, res) {
    const { eventId } = req.params;
    const { userId } = req;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await event.removeAttendee(user);

    return res.status(204).send();
  }
}

module.exports = new AttendanceController();
