// POST /api/send-email
app.post('/api/send-email', async (req, res) => {
    const { email, type, clubName } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your@email.com',
        pass: 'yourpassword'
      }
    });
  
    const mailOptions = {
      from: 'your@email.com',
      to: email,
      subject: 'Membership Approved',
      text: `Congratulations! You have been approved to join the ${clubName} club at Zetech University.`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  });
  