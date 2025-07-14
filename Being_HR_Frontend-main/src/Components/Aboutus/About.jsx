import React from "react";
import "./about.css";



const teamImages = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Sample_User_Icon.png/100px-Sample_User_Icon.png",
  "https://images.app.goo.gl/yWLGvuGtAGCf5Mbv5",
  "https://images.app.goo.gl/QExLBQuRDaJKRjyF6",
  "https://via.placeholder.com/100?text=4",
  "https://via.placeholder.com/100?text=5",
  "https://via.placeholder.com/100?text=6",
  "https://via.placeholder.com/100?text=8",
];
const departments = [
  {
    name: "Social Media",
    head: "Head of",
    description:
      "Engage your audience on their favourite platforms to foster meaningful relationships that build trust.",
    image: "https://via.placeholder.com/100x100?text=SM",
    active: true,
  },
  {
    name: "SEO",
    head: "Head of",
    description:
      "Employ strategic SEO to increase your visibility in search results and generate a higher volume of targeted traffic.",
    image: "https://via.placeholder.com/100x100?text=SEO",
  },
  {
    name: "Paid Media",
    head: "Head of",
    description:
      "Maximise ROI on your ad spend through paid media specialists with a proven formula for multiplying revenue.",
    image: "https://via.placeholder.com/100x100?text=PM",
  },
  {
    name: "Paid Social",
    head: "Head of",
    description:
      "Extend the reach of your brand through laser-focused social ads that amplify awareness and compel sales.",
    image: "https://images.app.goo.gl/QExLBQuRDaJKRjyF6",
  },
  {
    name: "Influencer Marketing",
    head: "Head of",
    description:
      "Turbo-boost engagement and sales with strategic influencer advertising campaigns that create a big buzz around your brand across the web.",
    image: "https://via.placeholder.com/100x100?text=IM",
  },
  {
    name: "Email Marketing",
    head: "Head of",
    description:
      "Entice customers and prospects to take specific actions using personalised messaging that promotes your brand.",
    image: "https://via.placeholder.com/100x100?text=EM",
  },
];


const About = () => {
  return (
    <div>
      <section className="aboutus-section">
      <div className="aboutus-content">
        <div className="aboutus-text">
          <h1>
            <span className="gradient-text">SUBSCRIPTION–BASED</span><br />
            MARKETING FOR UNSTOPPABLE GROWTH
          </h1>
          <p>
            Design, development, content, ads and all you need in one package from a leading digital marketing company worldwide
          </p>
          <button className="cta-button">Book a demo</button>
        </div>
        <div className="glow-blob" />
      </div>


      <div className="awards">
        <div className="award">
          <h3>Clutch</h3>
          <p>Top Digital Marketing Agencies For Startups</p>
        </div>
        <div className="award">
          <h3>Sortlist</h3>
          <p>Best Advertising Agency In The US</p>
        </div>
        <div className="award">
          <h3>FINTECH DRIFT</h3>
          <p>Best Marketing Agencies For Fintech Companies</p>
        </div>
        <div className="award">
          <h3>Influencer MarketingHub</h3>
          <p>#1 Crypto Marketing Agency 2021–2023</p>
        </div>
        <div className="award">
          <h3>HOSTINGER</h3>
          <p>Best Digital Agency Worldwide</p>
        </div>
      </div>
    </section>
    <section className="marketing-hero">
      <h1>
        Get a full marketing department by <br />
        subscription in your industry
      </h1>
      <p>
        All marketing services in one package <br />
        with successful experience in your niche
      </p>
      <div className="team-images">
        {teamImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Team member ${index + 1}`}
            className="team-img"
          />
        ))}
      </div>
    </section>
     <section className="departments-section">
      <div className="departments-header">
        <h2>Or one service department which you don’t have resources for</h2>
        <p>
          We will take on all the tasks that you’ve been putting off for a long time
        </p>
      </div>

      <div className="departments-grid">
        {departments.map((dept, index) => (
          <div
            key={index}
            className={`department-card ${dept.active ? "active" : ""}`}
          >
            <div className="card-header">
              <img src={dept.image} alt={dept.name} className="head-image" />
              <div>
                <p className="head-role">{dept.head}</p>
                <h3 className="head-name">{dept.name}</h3>
              </div>
            </div>
            <button className="department-button">DEPARTMENT</button>
            <p className="department-description">{dept.description}</p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default About;
