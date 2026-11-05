"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");

  return (
    <main className="home">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <nav className="navbar">
        <div className="logo">
          21<span>Q</span>
        </div>
        <div className="edition">FRIENDS EDITION</div>
      </nav>

      <section className="hero">
        <div className="tag">✦ THE ULTIMATE FRIENDSHIP TEST ✦</div>

        <h1>
          HOW WELL DO
          <br />
          YOUR FRIENDS
          <br />
          <span>KNOW YOU?</span>
        </h1>

        <p>
          Think your friends know everything about you?
          It's time to put that friendship to the test.
        </p>

        <div className="create-card">
          <h2>Create your challenge</h2>
          <p>First things first. What should we call you?</p>

          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />

          <button
            onClick={() =>
              alert(`Welcome ${name}! Let's build your challenge next.`)
            }
            disabled={!name.trim()}
          >
            CREATE MY CHALLENGE →
          </button>
        </div>

        <div className="features">
          <span>🎯 21 QUESTIONS</span>
          <span>💜 FRIENDSHIP TEST</span>
          <span>🔗 SHARE WITH FRIENDS</span>
        </div>
      </section>

      <footer>
        21 QUESTIONS — FRIENDS EDITION
        <br />
        <span>Real friends. Real memories.</span>
      </footer>
    </main>
  );
}
