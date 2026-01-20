import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function About(): JSX.Element {
  return (
    <Layout
      title="About Us"
      description="Art Loop - A curated platform for intimate art performances and meaningful gatherings">
      <main>
        <div className={styles.container} style={{ padding: '2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>About Art Loop</h1>
            
            <p style={{ fontSize: '1.3rem', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '2rem' }}>
              Art Loop was born from a simple belief:<br />
              The most powerful artistic experiences don't always happen on big stages—they happen in 
              living rooms, basements, rooftops, and shared spaces where people truly connect.
            </p>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Art Loop is a curated platform that brings intimate art performances and meaningful 
              gatherings into personal spaces. Think of it as an Airbnb for art experiences—where 
              hosts, artists, and audiences come together to create unforgettable moments.
            </p>

            <h2>What We Do</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Art Loop connects two key communities:
            </p>

            <h3>Artists & Facilitators</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              From singer-songwriters and small bands to spoken-word artists, theater plays and skits, meditation guides, and 
              yoga instructors—Art Loop helps creators:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li>Showcase their work in intimate, high-engagement settings</li>
              <li>List performance or session fees transparently</li>
              <li>Share availability through a simple calendar system</li>
            </ul>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              We believe artists deserve fair value, meaningful audiences, and spaces that feel 
              human—not transactional.
            </p>

            <h3>Hosts</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Anyone with a suitable space—be it a living room, basement, studio, or private venue—can 
              become a host. Hosts decide:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li>The type of event they want to host</li>
              <li>Setup a public or private event - just for their party</li>
              <li>Audience size and vibe</li>
            </ul>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Whether it's a house concert, a poetry evening, a meditation circle, or a yoga session, 
              hosts set the tone and Art Loop takes care of the rest.
            </p>

            <h3>Audience & Participants</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              For audiences, Art Loop offers access to authentic, close-up experiences—no crowds, 
              no barriers, just art as it's meant to be experienced. Participants can browse events, 
              purchase tickets, and discover gatherings that resonate with them.
            </p>

            <h2>So How does Art Loop Work?</h2>
            <ol style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li>Hosts list their space with events they would like to host</li>
              <li>Artists list their offerings, pricing, and availability</li>
              <li>Art Loop matches hosts with artists and opens the event to audiences</li>
              <li>Ticketing, coordination, and logistics are handled seamlessly</li>
              <li>Everyone shows up to create magic together</li>
            </ol>


            <h2>Art is more Than Performances</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Art Loop is designed to grow beyond performances. As a value-added ecosystem, we will 
              connect hosts and artists & hosts with trusted partners such as:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li>Food & beverage catering</li>
              <li>Sound engineers and equipment</li>
              <li>Furniture and décor rentals</li>
              <li>Event support services</li>
            </ul>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our goal is to remove friction—so creativity can flow freely.
            </p>

            <h2>Our Vision</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              We envision a world where:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li>Art is accessible, personal, and community-driven</li>
              <li>Homes become cultural spaces</li>
              <li>Artists thrive outside traditional venues</li>
              <li>People gather with intention, presence, and curiosity</li>
            </ul>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', fontWeight: 'bold' }}>
              Art Loop isn't just a platform—it's a movement to bring art back to human scale.
            </p>

            <h2>Join the Loop</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Whether you're a host, an artist, or someone who simply loves meaningful experiences—there's 
              a place for you in the loop.
            </p>
            <p style={{ fontSize: '1.3rem', lineHeight: '1.8', fontWeight: 'bold', textAlign: 'center', marginTop: '2rem' }}>
              Create. Host. Experience. Repeat.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
