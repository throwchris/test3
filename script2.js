document.getElementById('start-btn').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Sorry, your browser does not support speech recognition.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.start();

    recognition.onstart = () => {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        // Only alert the user of the spoken command
        console.log(`You said: ${transcript}`);
        
        if (transcript.toLowerCase().startsWith("find")) {
            const searchTerm = transcript.substring(4).trim();
            const count = highlightWords(searchTerm);
            if (count > 0) {
                alert(`Found ${count} occurrence(s) of "${searchTerm}".`);
                scrollToFirstHighlight();
            } else {
                alert(`No occurrences of "${searchTerm}" found.`);
            }
        } else {
            alert("Please start with 'find'.");
        }
    };

    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ' + event.error);
    };

    recognition.onend = () => {
        console.log('Voice recognition ended.');
    };
});

// Limit search/highlight to the visible text area
const searchContainer = document.getElementById('font');

// Remove all existing highlights
function clearHighlights() {
  if (!searchContainer) return;

  const highlights = searchContainer.querySelectorAll('span.search-highlight');
  highlights.forEach(span => {
    const parent = span.parentNode;

    // Move text out of the span back into the parent
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }

    parent.removeChild(span);
    parent.normalize(); // merge adjacent text nodes
  });
}

// Highlight all occurrences of a term (case-insensitive) in text nodes only
function highlightTerm(term) {
  clearHighlights();
  if (!searchContainer) return;
  if (!term || !term.trim()) return;

  const termLower = term.toLowerCase();
  const walker = document.createTreeWalker(
    searchContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let firstHighlight = null;

  while (walker.nextNode()) {
    let node = walker.currentNode;
    let text = node.nodeValue;
    let textLower = text.toLowerCase();
    let currentIndex = 0;

    while (true) {
      const matchIndex = textLower.indexOf(termLower, currentIndex);
      if (matchIndex === -1) break;

      // Split text node into [before][match][after]
      const before = node.splitText(matchIndex);
      const after = before.splitText(term.length);

      const highlightSpan = document.createElement('span');
      highlightSpan.className = 'search-highlight';
      highlightSpan.textContent = before.nodeValue;

      before.parentNode.replaceChild(highlightSpan, before);

      if (!firstHighlight) {
        firstHighlight = highlightSpan;
      }

      // Continue searching in the "after" part
      node = after;
      text = node.nodeValue;
      textLower = text.toLowerCase();
      currentIndex = 0;
    }
  }

  // Scroll to the first highlight if found
  if (firstHighlight) {
    const rect = firstHighlight.getBoundingClientRect();
    const offset = 120; // account for the fixed navbar height
    const scrollY = window.scrollY + rect.top - offset;

    window.scrollTo({
      top: scrollY,
      behavior: 'smooth'
    });
  } else {
    alert('No matches found.');
  }
}

// Called when you click the "find_in_page" icon in navbar
function myFunction4() {
  const term = prompt('Search for a word:');
  if (!term) return;
  highlightTerm(term);
}

// Hook up the "remove highlight" (sun) button
document.addEventListener('DOMContentLoaded', () => {
  const unhighlightBtn = document.getElementById('unhighlight-btn');
  if (unhighlightBtn) {
    unhighlightBtn.addEventListener('click', clearHighlights);
  }
});

