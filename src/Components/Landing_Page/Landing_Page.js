import React from 'react';
import './Landing_Page.css';
function LandingPage() {
    const videoRef = React.createRef();
    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoRef.current.requestFullscreen().catch((err) => {
            console.log('Error attempting to enable full-screen mode:', err);
          });
        }
      };

      const playNormalVideo = () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        videoRef.current.style.width = '100%'; 
      };
  return (
    <div>
      <header>
      <nav className="navbar">
      <div className="logoo">
        <img src={process.env.PUBLIC_URL + '/dataease-logo.png'} alt="Logo" />
      </div>
      <ul className="nav-list">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact Us</a></li>
        <a className="buttonn" href="/login">See Demo</a>
      </ul>
    </nav>
        {/* <h1>Bankereaze</h1>
        <p>Banking Compliance Chatbot</p> */}
      </header>

      <section id="home" className="container">
      <div className="content">
        {/* <h2>Home</h2> */}
        <b>BankerEaze: Banking Compliance Chatbot</b>
        <p>
          Welcome to Bankereaze, your banking compliance chatbot solution. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit leo a velit consectetur egestas.
        </p>
        <a className="button" href="/login">Watch a demo</a>
      </div>
      <div className="video">
     
        <video controls autoPlay loop>
          <source src={process.env.PUBLIC_URL + '/New UX.mp4'} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* <div className="video-controls">
          <button onClick={toggleFullScreen}>Toggle Full-Screen</button>
          <button onClick={playNormalVideo}>Normal View</button>
        </div> */}
      </div>
    </section>

      <section id="about" className="container">
        {/* <h2>About Us</h2> */}
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit leo a velit consectetur egestas. Suspendisse ac turpis non tortor efficitur ultrices.</p>
      </section>

      <section id="contact" className="container">
      {/* <div className="contact-content">
        <b>Get in touch with us</b>
        </div>
        
      <div className="contact-form">
      <div className="contact-details">
        <div className="contact-image">
        <img src={process.env.PUBLIC_URL + '/contact-image.jpg'} alt="Contact Image" />
      </div>
      </div>
      <div className="form">
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <input type="submit" value="Submit" />
        </form>
        </div>
        </div> */}
        <div class="contact-us">
  <div class="contact-details">
    <strong>Let's Get in Touch</strong>
    <img src="/contactus.png" alt="Contact Image" />
  </div>
  
  <div class="contact-form">
    {/* <h1>Let's Get in Touch</h1> */}
    <form>
      <div class="form-group">
        <input type="text" class="form__inputtext" placeholder="Your Name" />
      </div>
      <div class="form-group">
        <input type="email" class="form__inputtext" placeholder="Your Email" />
      </div>
      <div class="form-group">
        <textarea class="form__inputtext" rows="4" placeholder="Your Message"></textarea>
      </div>
      <button class="form__submitbtn" type="submit">Submit</button>
    </form>
  </div>
</div>

      </section>
    </div>
  );
}

export default LandingPage;
