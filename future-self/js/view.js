document.addEventListener('DOMContentLoaded',()=>{
  const container = document.getElementById('capsule');
  const id = location.hash.replace('#','');
  if(!id){
    container.textContent = 'No capsule selected.';
    return;
  }
  const raw = localStorage.getItem('capsule-' + id);
  if(!raw){
    container.textContent = 'Capsule not found.';
    return;
  }
  const data = JSON.parse(raw);
  container.innerHTML = `
    <h2>${escapeHtml(data.name)}</h2>
    <p><strong>Open on:</strong> ${escapeHtml(data.date)}</p>
    <article>${escapeHtml(data.message)}</article>
  `;
  function escapeHtml(s){
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }
});
