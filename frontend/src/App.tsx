import { useState } from 'react';
import './App.css';

interface Event {
  id: number;
  title: string;
  category: 'Movies' | 'Concerts' | 'Sports' | 'Drama';
  date: string;
  location: string;
  price: number;
  image: string;
  rating: number;
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Neon Horizon World Tour',
    category: 'Concerts',
    date: 'Aug 24, 2026',
    location: 'Grand Arena, NY',
    price: 85,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Cyberpunk: Retribution',
    category: 'Movies',
    date: 'Aug 18, 2026',
    location: 'PVR IMAX Screen 4',
    price: 18,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Championship Finals 2026',
    category: 'Sports',
    date: 'Sep 02, 2026',
    location: 'Metropolitan Stadium',
    price: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'The Phantom Opera',
    category: 'Drama',
    date: 'Sep 10, 2026',
    location: 'Royal Broadway Theater',
    price: 65,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
  },
];

const CATEGORIES = ['All', 'Movies', 'Concerts', 'Sports', 'Drama'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = SAMPLE_EVENTS.filter((event) => {
    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="logo-icon">🎟️</span>
          <h2>Vindowiev</h2>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies, concerts, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <nav className="nav-links">
          <a href="#events" className="active">Explore</a>
          <a href="#bookings">My Bookings</a>
          <div className="user-profile">
            <span className="avatar">JD</span>
            <span className="username">John Doe</span>
          </div>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="badge">Featured Event</span>
          <h1>Experience Live Events Like Never Before 🎭</h1>
          <p>Book tickets for movies shows, music concerts, sports matches, and theater dramas instantly!</p>
          <button className="btn-primary">Pre book now</button>
        </div>
      </section>

      {/* Main Content Dashboard */}
      <main className="dashboard-content">
        <div className="content-header">
          <h2>Upcoming Events</h2>
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="card-image-wrapper">
                  <img src={event.image} alt={event.title} />
                  <span className="category-tag">{event.category}</span>
                </div>
                <div className="card-body">
                  <div className="rating">⭐ {event.rating}</div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-info">📅 {event.date}</p>
                  <p className="event-info">📍 {event.location}</p>
                  <div className="card-footer">
                    <span className="event-price">${event.price}</span>
                    <button className="btn-secondary">Book Ticket</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}