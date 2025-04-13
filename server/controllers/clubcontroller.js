// Club membership handling
exports.joinClub = async (req, res) => {
    try {
      const { userId, clubId } = req.body;
      
      // Check existing membership
      const existing = await ClubMembership.findOne({ where: { userId, clubId } });
      if(existing) return res.status(400).json({ error: 'Already a member' });
  
      const membership = await ClubMembership.create({ userId, clubId });
      // Send email notification logic here
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Get user's clubs
  exports.getUserClubs = async (req, res) => {
    try {
      const memberships = await ClubMembership.findAll({
        where: { userId: req.params.userId },
        include: ['club']
      });
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };