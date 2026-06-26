// --- Core App Settings and Elements ---
const themeToggle = document.getElementById("themeToggle");
const inputText = document.getElementById("inputText");
const charCounter = document.getElementById("charCounter");
const summaryLengthSlider = document.getElementById("summaryLength");
const lengthVal = document.getElementById("lengthVal");
const summarizeBtn = document.getElementById("summarizeBtn");
const outputText = document.getElementById("outputText");
const keywordsList = document.getElementById("keywordsList");
const actionButtons = document.getElementById("actionButtons");

// Stats DOM Elements
const statCompression = document.getElementById("statCompression");
const statWords = document.getElementById("statWords");
const statTime = document.getElementById("statTime");
const statText = document.getElementById("statText");

// Presets Config
const presets = { short: 2, medium: 5, detailed: 9 };

// --- Theme Toggling Operations ---
themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
});

// --- Dynamic Interactive Observers ---
inputText.addEventListener("input", () => {
  charCounter.innerText = `${inputText.value.length} chars`;
});

summaryLengthSlider.addEventListener("input", (e) => {
  lengthVal.innerText = e.target.value;
});

// Handle Preset Switches
// Paste this working code block:
document.querySelectorAll('input[name="lengthPreset"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const value = presets[e.target.value];
    summaryLengthSlider.value = value;
    lengthVal.innerText = value;
  });
});

// --- Main Trigger Action ---
summarizeBtn.addEventListener("click", () => {
  const text = inputText.value.trim();
  if (!text) {
    alert("Please enter valid text to summarize.");
    return;
  }

  // Toggle button UI to processing state (visual loading window feedback)
  const btnText = summarizeBtn.querySelector(".btn-text");
  const spinner = summarizeBtn.querySelector(".spinner");
  btnText.style.opacity = "0.5";
  spinner.classList.remove("hidden");
  summarizeBtn.disabled = true;

  // Simulate localized delay processing block for standard responsive flow
  setTimeout(() => {
    executeSummarizationPipeline(text);

    // Reverse processing indicators
    btnText.style.opacity = "1";
    spinner.classList.add("hidden");
    summarizeBtn.disabled = false;
  }, 450);
});

// --- Execution Pipeline Structure ---
function executeSummarizationPipeline(text) {
  const maxSentences = parseInt(summaryLengthSlider.value);

  // Parse individual units
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const titleParagraph = paragraphs[0] || "";
  const sentences = text
    .match(/[^.!?]+[.!?]*\s*/g)
    ?.filter((s) => s.trim()) || [text];
  // Fallback security filter bounds
  if (sentences.length <= maxSentences) {
    renderOutput(text, text, [], sentences.length, sentences.length);
    return;
  }

  // Stopword Dictionary Matrix setup
  const stopWords = new Set([
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
  ]);

  // Word Frequency Construction
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const frequencyMap = {};
  words.forEach((word) => {
    if (!stopWords.has(word) && word.length > 2) {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }
  });

  // Score evaluation execution
  const scoredSentences = sentences.map((sentenceStr, index) => {
    const cleanSentence = sentenceStr.trim();
    const sentenceWords = cleanSentence.toLowerCase().match(/\b\w+\b/g) || [];

    let sentenceScore = 0;
    sentenceWords.forEach((word) => {
      if (frequencyMap[word]) {
        let weight = frequencyMap[word];

        // Algorithmic Rule: Boost matching title/first-paragraph terms
        if (titleParagraph.toLowerCase().includes(word)) {
          weight *= 1.4;
        }
        sentenceScore += weight;
      }
    });

    // Algorithmic Rule: Sentence Length Normalization
    // Prevents disproportionate scaling weight on hyper-long sentences
    const normalizedScore =
      sentenceWords.length > 0
        ? sentenceScore / Math.sqrt(sentenceWords.length)
        : 0;

    return { index, text: cleanSentence, score: normalizedScore };
  });

  // Algorithmic Rule: Deduplication via Vector Check (Cosine-lite similarity filter)
  const uniqueSelectedSentences = [];
  const sortedCandidates = [...scoredSentences].sort(
    (a, b) => b.score - a.score,
  );

  for (const candidate of sortedCandidates) {
    if (uniqueSelectedSentences.length >= maxSentences) break;

    // Match similarity against accepted nodes
    let isDuplicate = false;
    for (const accepted of uniqueSelectedSentences) {
      if (calculateSimilarity(candidate.text, accepted.text) > 0.55) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniqueSelectedSentences.push(candidate);
    }
  }

  // Re-order sorting back to tracking line indices sequence
  uniqueSelectedSentences.sort((a, b) => a.index - b.index);
  const summaryResult = uniqueSelectedSentences.map((s) => s.text).join(" ");

  // Extract Top descriptive terms
  const sortedKeywords = Object.keys(frequencyMap)
    .sort((a, b) => frequencyMap[b] - frequencyMap[a])
    .slice(0, 6);

  renderOutput(text, summaryResult, sortedKeywords);
}

// Jaccard Token-distance engine for structural deduplication checks
function calculateSimilarity(str1, str2) {
  const set1 = new Set(str1.toLowerCase().match(/\b\w+\b/g) || []);
  const set2 = new Set(str2.toLowerCase().match(/\b\w+\b/g) || []);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// --- Metrics Mapping and UI Injection ---
function renderOutput(originalText, summaryText, keywords) {
  // 1. Output string generation
  outputText.classList.remove("placeholder-text");
  outputText.innerText = summaryText;

  // 2. Metrics engine tracking
  const origWordCount = (originalText.match(/\b\w+\b/g) || []).length;
  const summWordCount = (summaryText.match(/\b\w+\b/g) || []).length;
  const charCount = originalText.length;
  const sentenceCount =
    originalText.match(/[^.!?]+[.!?]*\s*/g)?.filter((s) => s.trim()).length ||
    1;

  const compressionPercent = Math.max(
    0,
    Math.round(((origWordCount - summWordCount) / origWordCount) * 100),
  );

  // WPM Average Calculation Standard (225 words/min)
  const originalTime = Math.max(1, Math.round(origWordCount / 225));
  const summaryTime = Math.max(1, Math.round(summWordCount / 225));

  // UI Panel Values Assignments
  statCompression.innerText = `${compressionPercent}%`;
  statWords.innerText = `${origWordCount} → ${summWordCount}`;
  statTime.innerText = `${originalTime}m → ${summaryTime}m`;
  statText.innerText = `${charCount}C | ${origWordCount}W | ${sentenceCount}S`;

  // 3. Keyword parsing tags generation
  keywordsList.innerHTML = "";
  if (keywords.length === 0) {
    keywordsList.innerHTML =
      '<span class="placeholder-tag">None extracted</span>';
  } else {
    keywords.forEach((word) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.innerText = word;
      keywordsList.appendChild(tag);
    });
  }

  // Display export functional tool actions layout group
  actionButtons.classList.remove("hidden");
}

// --- Utilities Integration Modules (Copy & Export Engine) ---
document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard
    .writeText(outputText.innerText)
    .then(() => alert("Summary copied to clipboard!"))
    .catch(() => alert("Failed to copy text."));
});

document.getElementById("downloadTxt").addEventListener("click", () => {
  triggerFileDownload(outputText.innerText, "summary.txt", "text/plain");
});

document.getElementById("downloadMd").addEventListener("click", () => {
  const markdownTemplate = `# Article Summary\n\n> Generated via SummifyLocal\n\n## Key Summary\n${outputText.innerText}\n\n## Analytics\n- **Reduction:** ${statCompression.innerText}\n- **Words Scale:** ${statWords.innerText}`;
  triggerFileDownload(markdownTemplate, "summary.md", "text/markdown");
});

function triggerFileDownload(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
