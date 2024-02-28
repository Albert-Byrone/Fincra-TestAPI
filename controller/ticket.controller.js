const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ticket = new Ticket({
      title,
      description,
      createdBy: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};
