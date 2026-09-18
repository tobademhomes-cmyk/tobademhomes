/**
 * TOBADEM HOMES - ADMIN DASHBOARD ENGINE
 * Handles Supabase Authentication, Storage Uploads, and Database Operations
 */

const SUPABASE_URL = "https://esgszouxueqpgepwpyqk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ3N6b3V4dWVxcGdlcHdweXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjE4MTYsImV4cCI6MjEwMjg5NzgxNn0.ullcb5NuaENW8577va_FyFDsGw6pO1GPDt2WfgG_6GE";

// Initialize Supabase Client
const supabaseAdmin = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseAdmin) {
    alert("Supabase SDK failed to load. Check your script tag in admin.html.");
    return;
  }

  // Check initial login session
  checkSession();

  // Login Form Submission
  document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('loginError');

    errorMsg.innerText = "";
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (error) {
      errorMsg.innerText = error.message;
    } else {
      checkSession();
    }
  });

  // Logout Button
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabaseAdmin.auth.signOut();
    checkSession();
  });

  // Save / Update Property Form Submission
  document.getElementById('propertyForm').addEventListener('submit', handleSaveProperty);
  document.getElementById('cancelEditBtn').addEventListener('click', resetForm);
});

// Switch view based on active session
async function checkSession() {
  const { data: { session } } = await supabaseAdmin.auth.getSession();
  const authSec = document.getElementById('auth-section');
  const dashSec = document.getElementById('dashboard-section');

  if (session) {
    authSec.classList.add('hidden');
    dashSec.classList.remove('hidden');
    loadAdminProperties();
  } else {
    authSec.classList.remove('hidden');
    dashSec.classList.add('hidden');
  }
}

// Upload File to Supabase Storage ('property-images' bucket)
async function uploadImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `listings/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from('property-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) {
    throw new Error("Image upload failed: " + error.message);
  }

  // Get Public Access URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('property-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// Handle Add/Edit Form
async function handleSaveProperty(e) {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.style.color = "var(--primary, #0a192f)";
  status.innerText = "Processing...";

  try {
    const id = document.getElementById('propId').value;
    const title = document.getElementById('propTitle').value;
    const location = document.getElementById('propLocation').value;
    const type = document.getElementById('propType').value;
    const price = document.getElementById('propPrice').value;
    const initial_deposit = document.getElementById('propDeposit').value;
    
    // Convert comma-separated string to array
    const rawFeatures = document.getElementById('propFeatures').value;
    const features = rawFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0);

    let image_url = document.getElementById('propImageUrl').value;
    const fileInput = document.getElementById('propImageFile');

    // Handle File Upload if selected
    if (fileInput.files.length > 0) {
      status.innerText = "Uploading image to property-images bucket...";
      image_url = await uploadImage(fileInput.files[0]);
    }

    // Payload without payment_plan
    const payload = {
      title,
      location,
      type,
      price,
      initial_deposit,
      features,
      imageUrl: image_url
    };

    if (id) {
      // UPDATE EXISTING PROPERTY
      const { error } = await supabaseAdmin
        .from('properties')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
      status.style.color = "green";
      status.innerText = "Property updated successfully!";
    } else {
      // INSERT NEW PROPERTY
      const { error } = await supabaseAdmin
        .from('properties')
        .insert([payload]);

      if (error) throw error;
      status.style.color = "green";
      status.innerText = "Property added successfully!";
    }

    resetForm();
    loadAdminProperties();

  } catch (err) {
    status.style.color = "red";
    status.innerText = err.message;
  }
}

// Load properties list into admin table
async function loadAdminProperties() {
  const tbody = document.getElementById('adminPropertyTableBody');
  tbody.innerHTML = `<tr><td colspan="5">Loading properties...</td></tr>`;

  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:red;">Failed to load properties: ${error.message}</td></tr>`;
    return;
  }

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No properties found. Add your first listing above!</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><strong>${p.title}</strong></td>
      <td>${p.location}</td>
      <td>${p.price}</td>
      <td>
        <button onclick="editProperty(${p.id})" class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; cursor: pointer;">Edit</button>
        <button onclick="deleteProperty(${p.id})" class="btn-danger">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Populate form for Editing
window.editProperty = async function(id) {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    alert("Error fetching property: " + error.message);
    return;
  }

  document.getElementById('formTitle').innerText = "Edit Property #" + data.id;
  document.getElementById('propId').value = data.id;
  document.getElementById('propTitle').value = data.title || '';
  document.getElementById('propLocation').value = data.location || '';
  document.getElementById('propType').value = data.type || '';
  document.getElementById('propPrice').value = data.price || '';
  document.getElementById('propDeposit').value = data.initial_deposit || '';
  document.getElementById('propFeatures').value = Array.isArray(data.features) ? data.features.join(', ') : '';
  document.getElementById('propImageUrl').value = data.imageUrl || '';

  document.getElementById('cancelEditBtn').style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete Property Record
window.deleteProperty = async function(id) {
  if (!confirm(`Are you sure you want to delete property #${id}?`)) return;

  const { error } = await supabaseAdmin
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    alert("Delete failed: " + error.message);
  } else {
    loadAdminProperties();
  }
};

// Reset form back to default "Add" state
function resetForm() {
  document.getElementById('propertyForm').reset();
  document.getElementById('propId').value = "";
  document.getElementById('formTitle').innerText = "Add New Property";
  document.getElementById('cancelEditBtn').style.display = "none";
}
