import React from 'react';
import './Landing_Page.css';
function LandingPage() {
  return (
    <div>
      <header>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <a href="/login">See Demo</a>
        </nav>
        <h1>Bankereaze</h1>
        <p>Banking Compliance Chatbot</p>
      </header>

      <section id="home" className="container">
        <h2>Home</h2>
        <p>Welcome to Bankereaze, your banking compliance chatbot solution. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit leo a velit consectetur egestas.</p>
        <a className="button" href="/login">See Demo</a>
      </section>

      <section id="about" className="container">
        <h2>About Us</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit leo a velit consectetur egestas. Suspendisse ac turpis non tortor efficitur ultrices.</p>
      </section>

      <section id="contact" className="container">
        <h2>Contact Us</h2>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="4" required></textarea>
          <input type="submit" value="Submit" />
        </form>
      </section>
    </div>
  );
}

export default LandingPage;
