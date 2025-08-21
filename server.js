import express from "express";
import fetch from "node-fetch";

const app = express();

// Proxy route
app.get("/*", async (req, res) => {
  try {
    const targetUrl = req.url.substring(1); // hapus "/" di depan
    if (!targetUrl.startsWith("http")) {
      return res.status(400).send("❌ Invalid URL, harus diawali http/https");
    }

    console.log("Proxying:", targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
      }
    });

    // Teruskan status, headers, dan body ke client
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("⚠️ Proxy Error: " + err.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ Proxy server running...");
});
