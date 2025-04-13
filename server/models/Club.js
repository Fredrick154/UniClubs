class Club {
    constructor(pool) {
      this.pool = pool;
    }
  
    async getAllClubs() {
      const [rows] = await this.pool.query('SELECT * FROM clubs');
      return rows;
    }
  
    async getClubById(id) {
      const [rows] = await this.pool.query('SELECT * FROM clubs WHERE id = ?', [id]);
      return rows[0];
    }
  
    async createClub(clubData) {
      const { name, description, category, logo, meetingSchedule, presidentId } = clubData;
      const [result] = await this.pool.query(
        'INSERT INTO clubs (name, description, category, logo, meeting_schedule, president_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, category, logo, meetingSchedule, presidentId]
      );
      return this.getClubById(result.insertId);
    }
  }
  
  module.exports = Club;