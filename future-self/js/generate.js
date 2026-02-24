document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('capsuleForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      id: Date.now().toString(),
      name: fd.get('name'),
      message: fd.get('message'),
      date: fd.get('date')
    };
    localStorage.setItem('capsule-' + payload.id, JSON.stringify(payload));
    // Redirect to view page with id in hash
    location.href = 'view.html#' + payload.id;
  });
});
