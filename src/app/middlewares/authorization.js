const Event = require('../models/Event');

const canManageEvent = async (req, res, next) => {
  const { id: eventId } = req.params;
  const { userId } = req;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  if (event.user_id !== userId) {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
    }
  }

  return next();
};

module.exports = { canManageEvent };