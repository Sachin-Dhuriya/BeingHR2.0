import React from "react";
import "./Blog.css";

const Blog = () => {
  return (
    <div className="BN-container">
      <h1 className="BN-title">Blogs and News - BeingHR Community</h1>
      <p className="BN-subtitle">
        The BeingHR Blog and Newsroom is your go-to destination for insightful articles, thought leadership, and the latest updates from the world of HR.
      </p>

      {/* Blogs Section */}
      <section className="BN-section">
        <h2 className="BN-section-title">Blogs</h2>
        <div className="BN-grid">
          {[{
            title: "The Future of DEIB: Building Truly Inclusive Workplaces",
            desc: "Discover strategies to create equitable, diverse, and inclusive work environments.",
            date: "January 2025"
          }, {
            title: "HR Analytics: Unlocking Data-Driven Decision Making",
            desc: "Learn how HR analytics can enhance recruitment, retention, and overall HR efficiency.",
            date: "December 2024"
          }, {
            title: "The Rise of Employee Well-being: Beyond Traditional Benefits",
            desc: "Explore innovative approaches to supporting employee mental health and well-being.",
            date: "November 2024"
          }, {
            title: "AI in Recruitment: Transforming Talent Acquisition",
            desc: "Understand how artificial intelligence is reshaping the hiring process for efficiency and fairness.",
            date: "October 2024"
          }].map((blog, index) => (
            <div key={index} className="BN-card">
              <h3 className="BN-card-title">{blog.title}</h3>
              <p className="BN-card-desc">{blog.desc}</p>
              <p className="BN-card-date">Published: {blog.date}</p>
              <button className="BN-button">Read More</button>
            </div>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="BN-section">
        <h2 className="BN-section-title">News</h2>
        <div className="BN-grid">
          {[{
            title: "BeingHR Partners with CHRO Confex 2025",
            desc: "We are excited to announce our collaboration with the prestigious CHRO Confex.",
            date: "January 2025"
          }, {
            title: "Launch of the DEIB Walkathon in Bangalore",
            desc: "Mark your calendars for May 1, 2025, for our first-ever walkathon.",
            date: "December 2024"
          }, {
            title: "Mumbai HR Networking Night a Huge Success",
            desc: "Over 500 HR professionals came together for a night of networking and collaboration.",
            date: "November 2024"
          }, {
            title: "Introducing the BeingHR Digital Platform",
            desc: "Seamlessly connect with HR professionals with our new digital platform launching June 2025.",
            date: "December 2024"
          }].map((news, index) => (
            <div key={index} className="BN-card">
              <h3 className="BN-card-title">{news.title}</h3>
              <p className="BN-card-desc">{news.desc}</p>
              <p className="BN-card-date">Date: {news.date}</p>
              <button className="BN-button">Read Full Story</button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="BN-cta">
        <h3 className="BN-cta-title">Ready to Stay Informed and Inspired?</h3>
        <div className="BN-cta-buttons">
          <button className="BN-button BN-button-blue">Read the Latest Blogs</button>
          <button className="BN-button BN-button-green">Explore News Updates</button>
          <button className="BN-button BN-button-purple">Contribute to Our Blog</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
