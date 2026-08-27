/**
 * TOBADEM HOMES - MASTER JAVASCRIPT
 * Includes Supabase Dynamic Property Engine, Location Filtering, Reviews Slider, Dynamic Modal Systems, and Inquiry Form Handler
 */

// ==========================================
// 1. CONTACT & SUPABASE CONFIGURATION
// ==========================================
const TOBADEM_WHATSAPP = "2348109005495";

// Configured Supabase Credentials
const SUPABASE_URL = "https://esgszouxueqpgepwpyqk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ3N6b3V4dWVxcGdlcHdweXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjE4MTYsImV4cCI6MjEwMjg5NzgxNn0.ullcb5NuaENW8577va_FyFDsGw6pO1GPDt2WfgG_6GE";

// Initialize Supabase Client using 'dbClient' to prevent global naming conflicts
const dbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let activeFilter = "All";
let properties = [];

// ==========================================
// 2. DYNAMIC PROPERTY FETCHING FROM SUPABASE
// ==========================================
async function fetchPropertiesFromSupabase() {
  if (!dbClient) {
    console.error("Supabase client is not initialized. Ensure the CDN script is included in your HTML head.");
    return [];
  }

  try {
    const { data, error } = await dbClient
      .from('properties')
      .select('*');

    if (error) {
      console.error("Error fetching properties from Supabase:", error.message);
      return [];
    }

    // Map database columns to standard property object structure
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      location: item.location,
      type: item.type,
      price: item.price,
      initialDeposit: item.initial_deposit || item.initialDeposit,
      paymentPlan: item.payment_plan || item.paymentPlan,
      features: Array.isArray(item.features) ? item.features : (item.features ? JSON.parse(item.features) : []),
      imageUrl: item.image_url || item.imageUrl
    }));
  } catch (err) {
    console.error("Unexpected error connecting to Supabase:", err);
    return [];
  }
}

// ==========================================
// 3. PROPERTY LISTING RENDERER (BADGE STRETCH FIXED)
// ==========================================
async function renderTobademProperties(containerId = "property-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show loading state and fetch from Supabase if properties array is empty
  if (properties.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Loading verified properties...</p>`;
    properties = await fetchPropertiesFromSupabase();
  }

  // 1. Create or retrieve filter container
  let filterWrapper = document.getElementById("property-filter-buttons");
  if (!filterWrapper) {
    filterWrapper = document.createElement("div");
    filterWrapper.id = "property-filter-buttons";
    filterWrapper.className = "filter-container";
    container.parentNode.insertBefore(filterWrapper, container);
  }

  // 2. Render location filter buttons
  const categories = ["All", "Lagos", "Ogun State", "Ibadan"];
  filterWrapper.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === activeFilter ? 'active' : ''}" data-location="${cat}">
      ${cat}
    </button>
  `).join('');

  filterWrapper.onclick = (e) => {
    if (e.target.classList.contains("filter-btn")) {
      activeFilter = e.target.getAttribute("data-location");
      renderTobademProperties(containerId);
    }
  };

  // 3. Filter properties list
  const filteredProps = activeFilter === "All" 
    ? properties 
    : properties.filter(p => p.location && p.location.toLowerCase().includes(activeFilter.toLowerCase()));

  // 4. Render property cards into grid
  if (filteredProps.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No properties currently found in ${activeFilter}.</p>`;
  } else {
    container.innerHTML = filteredProps.map(prop => {
      const waText = encodeURIComponent(`Hello Tobadem Homes, I want to verify the title and request inspection details for ${prop.title} (${prop.location}).`);
      const waLink = `https://wa.me/${TOBADEM_WHATSAPP}?text=${waText}`;

      return `
        <article class="property-card" data-id="${prop.id}">
          <div class="card-image-wrapper" style="position: relative; overflow: hidden;">
            <img 
              src="${prop.imageUrl}" 
              alt="${prop.title}" 
              loading="lazy" 
              class="card-img"
              onerror="this.onerror=null; this.style.display='none';"
            />
            ${prop.type ? `<span class="card-badge">${prop.type}</span>` : ''}
            
            <!-- FIXED VERIFIED TITLE BADGE POSITION & DIMENSIONS -->
            <div class="verification-seal" style="position: absolute; top: 12px; right: 12px; width: auto !important; height: auto !important; max-width: fit-content; background: #10b981; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; z-index: 2; line-height: 1;">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; min-width:14px; display:inline-block; vertical-align:middle; fill:currentColor;">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <span>Verified Title</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="card-header-info">
              <h3 class="card-title">${prop.title}</h3>
              <p class="card-location">
                <svg style="width:14px;height:14px;display:inline-block;vertical-align:middle;" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5 2.5z"/></svg>
                ${prop.location}
              </p>
            </div>

            <div class="card-pricing-block">
              <div class="price-main">
                <span class="price-label">Price / Investment</span>
                <span class="price-value">${prop.price}</span>
              </div>
              ${prop.initialDeposit ? `
                <div class="deposit-tag" style="font-size: 0.85rem; color: var(--text-dark); margin-top: 4px;">
                  <span>Initial Deposit:</span> <strong>${prop.initialDeposit}</strong>
                </div>
              ` : ''}
            </div>

            <ul class="card-features-list" style="list-style: none; padding: 0; margin: 1rem 0; font-size: 0.88rem; display: flex; flex-direction: column; gap: 0.4rem;">
              ${(prop.features || []).map(feat => `
                <li style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: var(--brand-green, #10b981); font-weight: bold;">✓</span>
                  <span>${feat}</span>
                </li>
              `).join('')}
            </ul>

            <div class="card-footer-action">
              <a 
                href="${waLink}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-verify-action"
              >
                Verify Title & Request Inspection
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}

// ==========================================
// 4. DOM LOADED & TEAM SLIDER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderTobademProperties("property-grid");
  setupSearchListeners(); 
  setupReviewsSlider();
  setupInquiryForm();

  // Mobile Menu Toggle Handler
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Team Slider Initialization
  const slider = document.getElementById('teamSlider');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (slider && nextBtn && prevBtn) {
    function getScrollStep() {
      const firstCard = slider.querySelector('.team-card');
      if (!firstCard) return 300; 
      return firstCard.offsetWidth + 20;
    }

    nextBtn.addEventListener('click', () => {
      const step = getScrollStep();
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (maxScrollLeft <= 0 || Math.ceil(slider.scrollLeft) >= maxScrollLeft - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: step, behavior: 'smooth' });
      }
    });

    prevBtn.addEventListener('click', () => {
      const step = getScrollStep();
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft <= 10) {
        slider.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });
  }
});

// ==========================================
// 5. REVIEWS SLIDER CONTROLLER
// ==========================================
function setupReviewsSlider() {
  const track = document.getElementById("reviewsTrack");
  const leftBtn = document.getElementById("slideLeft");
  const rightBtn = document.getElementById("slideRight");

  if (!track || !leftBtn || !rightBtn) return;

  const scrollAmount = 320;

  leftBtn.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

// ==========================================
// 6. INQUIRY FORM SUBMISSION HANDLER
// ==========================================
function setupInquiryForm() {
  const form = document.getElementById("inquiryForm");
  const feedback = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      message: formData.get("message")
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";
    }
    if (feedback) {
      feedback.innerText = "";
      feedback.style.color = "inherit";
    }

    try {
      if (!dbClient) {
        throw new Error("Database client is not connected.");
      }

      const { error } = await dbClient
        .from('inquiries')
        .insert([payload]);

      if (error) throw error;

      if (feedback) {
        feedback.style.color = "green";
        feedback.innerText = "Success! Your request has been sent. We will get in touch shortly.";
      }
      form.reset();

    } catch (err) {
      console.error("Submission error:", err.message);
      if (feedback) {
        feedback.style.color = "red";
        feedback.innerText = "Submission failed: " + err.message;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Request";
      }
    }
  });
}

// ==========================================
// 7. BLOG DATABASE & MODAL CONTROLLER
// ==========================================
const blogPosts = {
  "c-of-o-vs-excision": {
    category: "Land Banking",
    title: "Understanding C of O vs. Excision in Land Titles",
    date: "August 15, 2026",
    content: `
      <p class="lead-text" style="font-weight: 600; font-size: 1.1rem; color: var(--primary);">
        When acquiring land in rapidly expanding commercial and residential hubs, long-term returns aren't determined by location alone—they depend on title security. Buying a prime plot with ambiguous documentation can turn projected capital appreciation into years of costly litigation.
      </p>
      <p>Understanding the structural differences between an <strong>Excision</strong> and a <strong>Certificate of Occupancy (C of O)</strong> is the single most critical step in protecting your property portfolio.</p>
    `
  },
  "land-beats-inflation": {
    category: "Investment Strategy",
    title: "Why High-Yield Land Investments Beat Market Inflation",
    date: "August 08, 2026",
    content: `
      <p class="lead-text" style="font-weight: 600; font-size: 1.1rem; color: var(--primary);">
        When inflation steadily erodes local currency value and stock market volatility leaves traditional portfolios exposed, wealth preservation requires hard assets.
      </p>
    `
  }
};

function openBlogModal(postKey) {
  const post = blogPosts[postKey];
  if (!post) return;

  const catElem = document.getElementById("modal-category");
  const titleElem = document.getElementById("modal-title");
  const dateElem = document.getElementById("modal-date");
  const bodyElem = document.getElementById("modal-body");
  const modal = document.getElementById("blog-modal");

  if (catElem) catElem.innerText = post.category;
  if (titleElem) titleElem.innerText = post.title;
  if (dateElem) dateElem.innerHTML = `<i class="fa-regular fa-calendar"></i> ${post.date}`;
  if (bodyElem) bodyElem.innerHTML = post.content;

  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeBlogModal() {
  const modal = document.getElementById("blog-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function closePropertyModal() {
  const modal = document.getElementById("property-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Global Event Listeners for Closing Modals
window.addEventListener("click", (event) => {
  const blogModal = document.getElementById("blog-modal");
  const propertyModal = document.getElementById("property-modal");

  if (event.target === blogModal) {
    closeBlogModal();
  }
  if (event.target === propertyModal) {
    closePropertyModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBlogModal();
    closePropertyModal();
  }
});

// ==========================================
// 8. LIVE SEARCH FILTER HANDLER
// ==========================================
function setupSearchListeners() {
  const searchInput = document.getElementById('propertySearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    executePropertySearch(searchInput.value);
  });

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      executePropertySearch(searchInput.value);
    }
  });
}

function executePropertySearch(query) {
  const searchTerm = query.toLowerCase().trim();
  const gridContainer = document.getElementById('property-grid');
  if (!gridContainer) return;

  const cards = gridContainer.getElementsByClassName('property-card');
  let matchCount = 0;

  Array.from(cards).forEach(card => {
    const cardText = card.textContent.toLowerCase();
    
    if (cardText.includes(searchTerm)) {
      card.style.display = ""; 
      matchCount++;
    } else {
      card.style.display = "none"; 
    }
  });

  const existingMsg = document.getElementById('no-search-results');
  if (existingMsg) existingMsg.remove();

  if (matchCount === 0) {
    const noResultsHTML = `
      <div id="no-search-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
        <p>No properties found matching "${query}". Please try a different location or keyword.</p>
      </div>`;
    gridContainer.insertAdjacentHTML('beforeend', noResultsHTML);
  }
}
