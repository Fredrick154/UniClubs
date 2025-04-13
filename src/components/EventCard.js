function EventCard({ event, onRegister }) {
    return (
      <div className="event-card">
        <h3>{event.title}</h3>
        <p>{new Date(event.event_date).toLocaleString()}</p>
        <p>Location: {event.location}</p>
        <button onClick={onRegister}>Register</button>
      </div>
    );
  }
  
  export default EventCard;