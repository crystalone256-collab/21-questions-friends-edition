"use client";

import { useState } from "react";
import { questions } from "../lib/questions";

export default function Home() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState(Array(21).fill(null));
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState("");

  const current = questions[index];
  const progress = ((index + 1) / 21) * 100;

  function selectAnswer(optionIndex) {
    const updated = [...answers];
    updated[index] = optionIndex;
    setAnswers(updated);
  }

  async function createChallenge() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (answers.some((answer) => answer === null)) {
      setError("Please answer all 21 questions.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_name: name.trim(),
          answers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Challenge creation failed.");
      }

      setShareLink(`${window.location.origin}/play/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (shareLink) {
    return (
      <main className="home">
        <section className="hero">
          <div className="tag">✦ CHALLENGE CREATED ✦</div>
          <h1>YOUR CHALLENGE<br />IS <span>READY!</span></h1>
          <p>Now send your link to your friends and discover who knows you best.</p>
          <div className="create-card">
            <h2>Your challenge link</h2>
            <input readOnly value={shareLink} />
            <button onClick={() => {
              navigator.clipboard.writeText(shareLink);
              alert("Challenge link copied!");
            }}>
              COPY CHALLENGE LINK
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="home">
      <nav className="navbar">
        <div className="logo">21<span>Q</span></div>
        <div className="edition">FRIENDS EDITION</div>
      </nav>

      <section className="hero">
        <div className="tag">✦ THE ULTIMATE FRIENDSHIP TEST ✦</div>
        <h1>HOW WELL DO<br />YOUR FRIENDS<br /><span>KNOW YOU?</span></h1>
        <p>Create your personal challenge. Let's find out who really pays attention!</p>

        <div className="create-card">
          <h2>Create your challenge</h2>
          <p>Enter your name to get started.</p>

          <input
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />

          <div style={{ margin: "25px 0", textAlign: "left" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              fontSize: 12
            }}>
              <span>QUESTION {index + 1} OF 21</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{
              height: 7,
              background: "#302747",
              borderRadius: 20,
              overflow: "hidden"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "#a78bfa",
                transition: ".3s"
              }} />
            </div>
          </div>

          <h2 style={{ textAlign: "left", fontSize: 19 }}>
            {current.question}
          </h2>

          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            {current.options.map((option, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                style={{
                  textAlign: "left",
                  background: answers[index] === i ? "#6035a1" : "#0c0919",
                  border: answers[index] === i ? "2px solid #a78bfa" : "1px solid #40345d",
                  borderRadius: 10,
                  padding: 15,
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14
                }}
              >
                {String.fromCharCode(65 + i)}. {option}
                {answers[index] === i ? " ✓" : ""}
              </button>
            ))}
          </div>

          {error && <p style={{ color: "#fb7185", marginTop: 15 }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 25 }}>
            {index > 0 && (
              <button style={{ background: "#302747", flex: 1 }}
                onClick={() => {
                  setIndex(index - 1);
                  setError("");
                }}>
                ← BACK
              </button>
            )}

            {index < 20 ? (
              <button style={{ flex: 2 }}
                disabled={answers[index] === null}
                onClick={() => {
                  setIndex(index + 1);
                  setError("");
                }}>
                NEXT QUESTION →
              </button>
            ) : (
              <button style={{ flex: 2 }}
                disabled={loading || answers.some(a => a === null)}
                onClick={createChallenge}>
                {loading ? "CREATING..." : "CREATE MY CHALLENGE 🎯"}
              </button>
            )}
          </div>
        </div>

        <div className="features">
          <span>🎯 21 QUESTIONS</span>
          <span>💜 FRIENDSHIP TEST</span>
          <span>🏆 LEADERBOARD</span>
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
