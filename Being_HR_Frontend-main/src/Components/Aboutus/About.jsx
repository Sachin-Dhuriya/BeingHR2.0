import React from "react";
import "./about.css";

function About() {
  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">Welcome to BeingHR Community</h1>
          <p className="subtitle">
            India’s largest and most vibrant community of HR professionals.
          </p>
        </div>
      </header>

      <main className="main-container">
        {/* About Section */}
        <section className="section about-us">
          <div className="content">
            <h2>Who We Are</h2>
            <p>
              BeingHR is India’s largest and most vibrant community of HR
              professionals, dedicated to empowering individuals and
              organizations to transform the way they approach human resources.
              With over 60,000 members from diverse industries, we are redefining the role of HR.
            </p>
          </div>
          <img
            className="section-image"
            src="https://th.bing.com/th/id/OIP.MS-7QjG_HHGqDG-A5E9RDAHaEn?rs=1&pid=ImgDetMain/500x300"
            alt="Who We Are"
          />
        </section>

        {/* Vision Section */}
        <section className="section vision">
          <img
            className="section-image"
            src="https://th.bing.com/th/id/OIP.cvXfpmfU5g7ANQCCHdT6uAHaE1?rs=1&pid=ImgDetMain/500x300"
            alt="Our Vision"
          />
          <div className="content">
            <h2>Our Vision</h2>
            <p>
              “To redefine the role of HR as a driver of business success by
              building a future where HR is at the forefront of innovation,
              diversity, and collaboration.”
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="section services">
          {/* <h2 className="section-title-about">Our Services</h2> */}
          <div className="services-grid">
            <div className="service-card">
              <img
                src="https://th.bing.com/th/id/OIP.drkTIdQLmajPhqWeTZ13NwHaEK?rs=1&pid=ImgDetMain/300x200"
                alt="Networking Opportunities"
              />
              <h3>Networking Opportunities</h3>
              <p>
                Connect with HR professionals in your city, participate in
                events, and join specialized WhatsApp groups.
              </p>
            </div>

            <div className="service-card">
              <img
                src="https://th.bing.com/th/id/OIP.FkBBmqbn4J8-kHuXVja_TQHaHQ?rs=1&pid=ImgDetMain/300x200"
                alt="Learning & Development"
              />
              <h3>Learning & Development</h3>
              <p>
                Stay updated through workshops, webinars, and curated content
                designed for HR professionals.
              </p>
            </div>

            <div className="service-card">
              <img
                src="https://th.bing.com/th/id/OIP.inouiJYYuKbFDzvX9WEFwAHaEK?rs=1&pid=ImgDetMain/300x200"
                alt="Exclusive Events"
              />
              <h3>Exclusive Events</h3>
              <p>
                Join HR conclaves, conferences, mock interview programs, and
                industry-leading panel discussions.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="section cta">
          <h2>Join Our Community</h2>
          <p>
            Become a part of a movement redefining HR in India. Join the
            BeingHR Community today!
          </p>
          <button className="cta-button">Join Now</button>
        </section>
      </main>
    </div>
  );
}

export default About;
