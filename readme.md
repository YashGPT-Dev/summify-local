# Summify Local

A modern privacy-first text summarizer that works entirely inside your browser.

No servers.
No API keys.
No uploads.

Your text never leaves your device.

---

## Features

- Local extractive text summarization
- Smart sentence ranking using word-frequency analysis
- Sentence length normalization
- Duplicate sentence filtering
- Title-aware sentence weighting
- Summary length presets
- Adjustable summary length slider
- Keyword extraction
- Reading statistics
- Compression percentage
- Reading time estimation
- Character counter
- Copy summary to clipboard
- Export as TXT
- Export as Markdown
- Dark / Light theme
- Responsive dashboard UI

---

## Screenshots

Add screenshots here after uploading them.

Example:

```
assets/screenshot-light.png
assets/screenshot-dark.png
```

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome

---

## How It Works

The summarizer uses an extractive summarization approach.

### Pipeline

1. Parse the input text into sentences
2. Remove common stop words
3. Calculate word frequencies
4. Score each sentence
5. Apply title-aware weighting
6. Normalize scores based on sentence length
7. Remove duplicate sentences using Jaccard similarity
8. Select the highest scoring sentences
9. Restore the original reading order
10. Generate the final summary

Everything runs locally inside the browser.

---

## Project Structure

```
summify-local/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Future Improvements

- PDF document support
- DOCX support
- Multi-language summarization
- Highlight extracted sentences
- AI-powered summarization using Transformers.js
- Progressive Web App (PWA)
- Offline caching

---

## Running Locally

Clone the repository

```bash
git clone https://github.com/YashGPT-Dev/summify-local.git
```

Open

```
index.html
```

in your browser.

No installation required.

---


## Author

Yash Gupta
