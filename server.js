const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { system, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data?.content?.[0]?.text;

    if (!reply) {
      console.error("Anthropic error:", JSON.stringify(data));
      return res.status(500).json({ error: "No reply from Claude", details: data });
    }

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

app.get("/", (req, res) => res.send("WebCraft Chat API is running ✅"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));