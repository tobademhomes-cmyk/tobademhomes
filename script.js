/* ==========================================================================
   TOBADEM HOMES - MASTER APPLICATION SCRIPT
   - Dynamic Supabase Property Engine (Fetches Live DB Records)
   - Dynamic Team Carousel
   - Dynamic Blog Reader Modal Engine
   - Client Reviews Navigation
   - Formspree Contact Form Handler
   ========================================================================== */

// 1. SUPABASE CLIENT INITIALIZATION
// Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://esgszouxueqpgepwpyqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ3N6b3V4dWVxcGdlcHdweXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjE4MTYsImV4cCI6MjEwMjg5NzgxNn0.ullcb5NuaENW8577va_FyFDsGw6pO1GPDt2WfgG_6GE';

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('Supabase SDK not loaded. Check index.html script tag.');
}

// 2. DOM CONTENT LOADED ENTRY POINT
document.addEventListener('DOMContentLoaded', () => {
  initLiveProperties();
  initTeamCarousel();
  initReviewsSlider();
  initContactForm();
});

/* ==========================================================================
   3. DYNAMIC SUPABASE PROPERTY LISTINGS ENGINE
   ========================================================================== */
async function initLiveProperties() {
  const gridContainer = document.getElementById('property-grid');
  if (!gridContainer) return;

  // CRITICAL: Clear all static HTML placeholders completely
  gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading verified properties...</p>';

  if (!supabaseClient) {
    gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to connect to property database.</p>';
    return;
  }

  try {
    const { data: properties, error } = await supabaseClient
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Clear loading message
    gridContainer.innerHTML = '';

    if (!properties || properties.length === 0) {
      gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No properties currently available. Check back shortly!</p>';
      return;
    }

    // Render live dynamic cards directly from Supabase
    properties.forEach((prop) => {
      const card = document.createElement('article');
      card.className = 'card property-card';

      const formattedPrice = prop.price ? `₦${Number(prop.price).toLocaleString()}` : 'Price on Request';
      const imageSrc = prop.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
      const location = prop.location || 'Lagos / Ogun State';
      const title = prop.title || 'Verified Property Asset';
      const category = prop.category || 'Investment';
      const description = prop.description ? `${prop.description.substring(0, 110)}...` : 'Verified title security with fast capital growth projections.';

      card.innerHTML = `
        <div class="card-img-wrapper" style="position: relative; overflow: hidden;">
          <img src="${imageSrc}" alt="${title}" style="width: 100%; height: 220px; object-fit: cover;">
          <span class="category" style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.75); color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem;">${category}</span>
        </div>
        <div class="card-body" style="padding: 1.25rem;">
          <span class="category" style="color: #d97706; font-size: 0.85rem; font-weight: 600;"><i class="fa-solid fa-location-dot"></i> ${location}</span>
          <h3 style="margin: 0.5rem 0; font-size: 1.2rem;">${title}</h3>
          <p class="price" style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${formattedPrice}</p>
          <p style="font-size: 0.9rem; color: #64748b; line-height: 1.4;">${description}</p>
          <a href="https://wa.me/2348109005495?text=Hello%20TOBADEM%20HOMES,%20I%20am%20interested%20in%20${encodeURIComponent(title)}" target="_blank" class="btn-primary" style="display: block; text-align: center; margin-top: 1rem; text-decoration: none;">Inquire on WhatsApp</a>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Supabase fetch error:', err.message);
    gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 2rem;">Unable to load properties dynamically (${err.message}).</p>`;
  }
}

/* ==========================================================================
   4. DYNAMIC TEAM MEMBERS CAROUSEL ENGINE
   ========================================================================== */
const teamMembers = [
  {
    name: "Adelugbin Michael Tobi",
    role: "Founder & CEO",
    image: "images/ceo-photo.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Legal Advisory Team",
    role: "Property Title Verification",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    fallbackImage: ""
  },
  {
    name: "Acquisitions & Surveying",
    role: "Land Banking Strategy",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    fallbackImage: ""
  }
];

function initTeamCarousel() {
  const teamTrack = document.getElementById('teamTrack');
  const nextBtn = document.getElementById('teamNextBtn');
  if (!teamTrack) return;

  teamTrack.innerHTML = '';

  teamMembers.forEach((member) => {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.style.cssText = 'min-width: 280px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-right: 1.5rem; flex-shrink: 0;';
    
    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}" onerror="this.onerror=null; this.src='${member.fallbackImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}';" style="width: 100%; height: 260px; object-fit: cover;">
      <div style="padding: 1rem; text-align: center;">
        <h3 style="margin: 0; font-size: 1.1rem; color: #0f172a;">${member.name}</h3>
        <p style="margin: 0.25rem 0 0; color: #d97706; font-size: 0.9rem; font-weight: 500;">${member.role}</p>
      </div>
    `;
    teamTrack.appendChild(card);
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      teamTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   5. CLIENT REVIEWS SLIDER ENGINE
   ========================================================================== */
function initReviewsSlider() {
  const reviewsTrack = document.getElementById('reviewsTrack');
  const slideLeft = document.getElementById('slideLeft');
  const slideRight = document.getElementById('slideRight');

  if (!reviewsTrack) return;

  if (slideLeft) {
    slideLeft.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  if (slideRight) {
    slideRight.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   6. DYNAMIC BLOG READER MODAL ENGINE
   ========================================================================== */
const blogPosts = {
  'c-of-o-vs-excision': {
    category: 'Land Banking',
    title: 'Understanding C of O vs. Excision in Land Titles',
    date: 'August 15, 2026',
    content: `
      <p>When investing in real estate across Lagos and Ogun State, understanding legal land documentation is your primary protection against property disputes.</p>
      <h4>1. Certificate of Occupancy (C of O)</h4>
      <p>Issued directly by the State Government, a C of O grants the holder official ownership rights for a term of 99 years. It is one of the safest titles for both commercial and residential acquisitions.</p>
      <h4>2. Excision & Gazette</h4>
      <p>Excision is the process where the government releases a portion of land back to the indigenous village or original family owners. Once gazetted, the land title is legally verified and safe for private acquisition.</p>
      <p><strong>TOBADEM HOMES Guarantee:</strong> Every land banking project in our portfolio undergoes thorough charting at the Ministry of Lands to ensure zero encumbrances.</p>
    `
  },
  'land-beats-inflation': {
    category: 'Investment Strategy',
    title: 'Why High-Yield Land Investments Beat Market Inflation',
    date: 'August 08, 2026',
    content: `
      <p>Inflation rapidly diminishes purchasing power when capital is kept in conventional savings accounts. Strategic land banking remains the definitive wealth preservation strategy in Nigeria.</p>
      <h4>Key Drivers of Land Capital Growth:</h4>
      <ul>
        <li><strong>Infrastructure Expansion:</strong> Proximity to major highways, industrial zones, and new airport corridors drives automatic appreciation.</li>
        <li><strong>Scarcity Factor:</strong> Land is a finite resource in rapidly urbanizing regions like Lagos and Ogun State.</li>
        <li><strong>Currency Protection:</strong> Tangible real estate assets adjust upward in value alongside market inflation, safeguarding your net worth.</li>
      </ul>
    `
  }
};

function openBlogModal(postSlug) {
  const modal = document.getElementById('blog-modal');
  const post = blogPosts[postSlug];

  if (!modal || !post) return;

  document.getElementById('modal-category').innerText = post.category;
  document.getElementById('modal-title').innerText = post.title;
  document.getElementById('modal-date').innerText = post.date;
  document.getElementById('modal-body').innerHTML = post.content;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside content wrapper
window.addEventListener('click', (event) => {
  const modal = document.getElementById('blog-modal');
  if (event.target === modal) {
    closeBlogModal();
  }
});

/* ==========================================================================
   7. CONTACT FORM SUBMISSION ENGINE (FORMSPREE / WHATSAPP FALLBACK)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Sending Request...';
    submitBtn.disabled = true;

    // Build fallback direct WhatsApp payload
    const whatsappMessage = `Hello TOBADEM HOMES,%0A%0A*Advisory Request*%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Details:* ${encodeURIComponent(message)}`;

    try {
      // Optional: Post directly to Formspree endpoint if integrated
      // await fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: new FormData(contactForm) });

      alert('Thank you! Redirecting your advisory request to our team on WhatsApp...');
      window.open(`https://wa.me/2348109005495?text=${whatsappMessage}`, '_blank');
      contactForm.reset();
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Network error. Opening WhatsApp directly...');
      window.open(`https://wa.me/2348109005495?text=${whatsappMessage}`, '_blank');
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}
