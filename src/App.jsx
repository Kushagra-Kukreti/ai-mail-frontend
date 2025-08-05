import { useState } from "react";

export default function App() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, prompt }),
      });
      const data = await res.json();
      setGeneratedEmail(data.email);
    } catch (err) {
      console.error("Error generating email:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, emailContent: generatedEmail }),
      });
      const data = await res.json();
      alert(data.message || "Email sent!");
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>AI Email Sender</h1>

      <label>Recipients (comma-separated)</label>
      <input
        type="text"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Prompt for AI</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Email"}
      </button>

      {generatedEmail && (
        <>
          <h3>Edit Generated Email</h3>
          <textarea
            value={generatedEmail}
            onChange={(e) => setGeneratedEmail(e.target.value)}
            style={{ width: "100%", height: "200px", marginBottom: "10px" }}
          />
          <button onClick={handleSend}>Send Email</button>
        </>
      )}
    </div>
  );
}
