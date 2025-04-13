class Membership {
  constructor(pool) {
    this.pool = pool;
  }

  async getUserMemberships(userId) {
    const [rows] = await this.pool.query(
      `SELECT m.*, c.name as club_name, c.description as club_description, c.logo as club_logo 
       FROM memberships m 
       JOIN clubs c ON m.club_id = c.id 
       WHERE m.user_id = ?`,
      [userId]
    );
    return rows;
  }

  async joinClub(userId, clubId) {
    // Check if already a member
    const [existing] = await this.pool.query(
      'SELECT * FROM memberships WHERE user_id = ? AND club_id = ?',
      [userId, clubId]
    );
    
    if (existing.length > 0) {
      throw new Error('User is already a member of this club');
    }

    await this.pool.query(
      'INSERT INTO memberships (user_id, club_id) VALUES (?, ?)',
      [userId, clubId]
    );
    
    return this.getMembership(userId, clubId);
  }

  async leaveClub(userId, clubId) {
    const [result] = await this.pool.query(
      'DELETE FROM memberships WHERE user_id = ? AND club_id = ?',
      [userId, clubId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('Membership not found');
    }
    
    return { message: 'Successfully left the club' };
  }

  async getMembership(userId, clubId) {
    const [rows] = await this.pool.query(
      'SELECT * FROM memberships WHERE user_id = ? AND club_id = ?',
      [userId, clubId]
    );
    return rows[0];
  }
}

module.exports = Membership;