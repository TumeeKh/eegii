// ===== TAB SWITCHING =====
function switchTab(id) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  const pane = document.getElementById('tab-' + id);
  if (pane) pane.classList.add('active');
  document.querySelectorAll('[data-tab="' + id + '"]').forEach(el => el.classList.add('active'));
}

// ===== AI =====
async function askAI(question) {
  if (!question || !question.trim()) return;
  const result = document.getElementById('ai-result');
  const dot = document.getElementById('ai-dot');
  const btn = document.getElementById('ai-send');
  const input = document.getElementById('ai-input');

  dot.classList.add('thinking');
  btn.disabled = true;
  input.value = '';
  result.innerHTML = '<div class="thinking-dots"><span></span><span></span><span></span></div>';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `Du bist der KI-Assistent von "Германд.мн" – einer Plattform für mongolische Menschen, die nach Deutschland kommen möchten, um zu arbeiten, zu studieren oder sich zu integrieren. Beantworte Fragen auf Mongolisch UND Deutsch – erst die mongolische Antwort, dann die deutsche Zusammenfassung. Sei klar, praktisch und ehrlich. Format:

**Хариулт / Antwort:** kurze Erklärung

**Алхамууд / Schritte:**
• Schritt 1
• Schritt 2

**Auf Deutsch:** kurze deutsche Zusammenfassung

**Анхаар / Wichtig:** ein konkreter Hinweis

Bei Unsicherheit: "Bitte direkt bei der deutschen Botschaft oder zuständigen Behörde nachfragen."`,
        messages: [{ role: 'user', content: question }]
      })
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || '').join('') || 'Хариулт авч чадсангүй. / Keine Antwort erhalten.';
    result.innerHTML = formatAI(text);
  } catch (e) {
    result.innerHTML = '<p style="color:var(--red-text)">Холболтын алдаа / Verbindungsfehler. Bitte erneut versuchen.</p>';
  } finally {
    dot.classList.remove('thinking');
    btn.disabled = false;
  }
}

function formatAI(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, m => '<ul style="padding-left:16px;margin:6px 0;">' + m + '</ul>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px;">')
    .replace(/\n/g, '<br>');
}

function sendQ(q) {
  document.getElementById('ai-input').value = q;
  askAI(q);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('ai-input');
  const btn = document.getElementById('ai-send');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAI(input.value); } });
  if (btn) btn.addEventListener('click', () => askAI(document.getElementById('ai-input').value));
  switchTab('visa');
});
