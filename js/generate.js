document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('capsuleForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fd = new FormData(form);
    const payload = {
      id: Date.now().toString(),
      name: fd.get('name'),
      message: fd.get('message'),
      date: fd.get('date'),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('capsule-' + payload.id, JSON.stringify(payload));
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'alert alert-success alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <strong>Success!</strong> Your time capsule has been saved.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);
    
    // Redirect to view page
    setTimeout(() => {
      location.href = 'view.html#' + payload.id;
    }, 1000);
  });
});
