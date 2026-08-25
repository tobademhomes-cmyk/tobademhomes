/**
 * TOBADEM HOMES - MASTER JAVASCRIPT
 * Includes Dynamic Supabase Property Engine, Location Filtering, and Blog Modal System
 */

// ==========================================
// 1. SUPABASE CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://esgszouxueqpgepwpyqk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ3N6b3V4dWVxcGdlcHdweXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjE4MTYsImV4cCI6MjEwMjg5NzgxNn0.ullcb5NuaENW8577va_FyFDsGw6pO1GPDt2WfgG_6GE';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. GLOBAL STATE & CONTACT CONFIG
// ==========================================
const TOBADEM_WHATSAPP = "2348109005495";
let globalProperties = []; // Stores properties fetched from Supabase
let activeFilter = "All";

// ==========================================
// 3. DYNAMIC SUPABASE PROPERTY ENGINE
// ==========================================

/**
 * Main function to fetch properties directly from your Supabase 'properties' table.
 */
async function fetchPropertiesFromSupabase(containerId = "property-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render temporary loading indicator
  container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Loading verified properties...</p>`;

  try {
    const { data, error } = await supabaseClient
      .from('properties')
      .select('*');

    if (error) {
      console.error('❌ Supabase Error:', error.message);
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red; padding: 2rem;">Failed to load properties. Please refresh or try again later.</p>`;
      return;
    }

    console.log('✅ SUCCESS! Retrieved Data from Supabase:', data);
    globalProperties = data || [];
    
    // Render the property cards and filter buttons once data arrives
    renderTobademProperties(containerId);

  } catch (err) {
    console.error('❌ Network Error:', err);
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red; padding: 2rem;">Network error fetching property data.</p>`;
  }
}

/**
 * Handles filtering and rendering HTML cards onto the DOM.
 */
function renderTobademProperties(containerId = "property-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

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

  // 3. Filter properties list from global database state
  const filteredProps = activeFilter === "All" 
    ? globalProperties 
    : globalProperties.filter(p => p.location && p.location.toLowerCase().includes(activeFilter.toLowerCase()));

  // 4. Render property cards into grid
  if (filteredProps.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No properties currently listed in ${activeFilter}.</p>`;
  } else {
    container.innerHTML = filteredProps.map(prop => {
      // Safe fallback formatting for values coming from DB
      const title = prop.title || "Featured Property";
      const location = prop.location || "Lagos, Nigeria";
      const type = prop.type || "Real Estate";
      const price = prop.price || "Price on Request";
      const initialDeposit = prop.initialDeposit || prop.initial_deposit || "Contact Agent";
      const imageUrl = prop.imageUrl || prop.image_url || "images/default-property.jpg";
      
      // Parse features (handles array or string format from database)
      let featureList = [];
      if (Array.isArray(prop.features)) {
        featureList = prop.features;
      } else if (typeof prop.features === 'string') {
        featureList = prop.features.split(',').map(f => f.trim());
      } else {
        featureList = ["Verified Title", "Prime Location"];
      }

      const waText = encodeURIComponent(`Hello Tobadem Homes, I want to verify the title and request inspection details for ${title} (${location}).`);
      const waLink = `https://wa.me/${TOBADEM_WHATSAPP}?text=${waText}`;

      return `
        <article class="property-card" data-id="${prop.id}">
          <div class="card-image-wrapper">
            <img 
              src="${imageUrl}" 
              alt="${title}" 
              loading="lazy" 
              class="card-img"
              onerror="this.onerror=null; this.style.display='none';"
            />
            <span class="card-badge">${type}</span>
            <div class="verification-seal">
              <svg viewBox="0 0 24 24" class="seal-icon"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              Verified Title
            </div>
          </div>
          
          <div class="card-body">
            <div class="card-header-info">
              <h3 class="card-title">${title}</h3>
              <p class="card-location">
                <svg class="loc-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5 2.5z"/></svg>
                ${location}
              </p>
            </div>

            <div class="card-pricing-block">
              <div class="price-main">
                <span class="price-label">Price / Investment</span>
                <span class="price-value">${price}</span>
              </div>
              <div class="deposit-tag">
                <span>Initial Deposit:</span> <strong>${initialDeposit}</strong>
              </div>
            </div>

            <ul class="card-features-list">
              ${featureList.map(feat => `
                <li>
                  <span class="check-icon">✓</span>
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
// 4. BLOG DATABASE & MODAL CONTROLLER
// ==========================================
const blogPosts = {
  "c-of-o-vs-excision": {
    category: "Land Banking",
    title: "Understanding C of O vs. Excision in Land Titles",
    date: "August 15, 2026",
    content: `
      <p class="lead-text">
        When acquiring land in rapidly expanding commercial and residential hubs, long-term returns aren't determined by location alone—they depend on title security. Buying a prime plot with ambiguous documentation can turn projected capital appreciation into years of costly litigation.
      </p>
      <p>Understanding the structural differences between an <strong>Excision</strong> and a <strong>Certificate of Occupancy (C of O)</strong> is the single most critical step in protecting your property portfolio.</p>
      
      <hr class="divider">

      <section class="blog-section">
        <h3>What is an Excision?</h3>
        <p>Under the Land Use Act of 1978, all land within a state is vested in the Governor to hold in trust for the populace. An <strong>Excision</strong> is the legal process where the state government officially carves out a specific portion of land from government acquisition and returns full legal control to the indigenous community or landowning family.</p>
        <ul class="blog-list">
          <li><strong>The Gazette:</strong> Once an excision is completed and approved, it is published in the official government record known as a <strong>Gazette</strong>.</li>
          <li><strong>Investment Profile:</strong> Excised land provides clear title while usually entering the market at a more accessible price point than land with an individual C of O. This makes it an ideal vehicle for land banking and high-margin capital appreciation.</li>
        </ul>
      </section>

      <hr class="divider">

      <section class="blog-section">
        <h3>What is a Certificate of Occupancy (C of O)?</h3>
        <p>A <strong>Certificate of Occupancy</strong> is an official leasehold document issued directly by the State Government. It certifies that the named holder has exclusive ownership rights and land use authorization for a term of up to 99 years.</p>
        <ul class="blog-list">
          <li><strong>Primary Security:</strong> A C of O can be issued directly on state land or processed independently over excised family land.</li>
          <li><strong>Institutional Leverage:</strong> Banks and financial institutions treat a C of O as prime collateral, making it easier to leverage for project financing or resale to institutional investors.</li>
        </ul>
      </section>

      <hr class="divider">

      <section class="blog-section">
        <h3>C of O vs. Excision: Key Differences</h3>
        <div class="table-wrapper">
          <table class="blog-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Excision (Gazetted)</th>
                <th>Certificate of Occupancy (C of O)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Origin</strong></td>
                <td>Government release of community land</td>
                <td>Direct state grant or perfected title</td>
              </tr>
              <tr>
                <td><strong>Tenure</strong></td>
                <td>Freehold root title granted via government release</td>
                <td>99-year state leasehold</td>
              </tr>
              <tr>
                <td><strong>Market Valuation</strong></td>
                <td>Moderate entry cost; high upside margin</td>
                <td>Premium market price</td>
              </tr>
              <tr>
                <td><strong>Banking Utility</strong></td>
                <td>Requires further perfection for institutional loans</td>
                <td>Universally accepted by financial lenders</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr class="divider">

      <section class="blog-section">
        <h3>Verification Steps Before Investing</h3>
        <ol class="blog-steps">
          <li><strong>Chart the Coordinates:</strong> Always take the land's survey plan to the state Surveyor General's office for a formal charting search to confirm the land falls within a designated excision zone and is free from committed government acquisition.</li>
          <li><strong>Cross-Check the Gazette:</strong> For excised land, verify the precise volume, page number, and boundary coordinates against official government gazette entries.</li>
          <li><strong>Align Title with Investment Timeline:</strong> If your goal is immediate development or bank leverage, prioritize land with a C of O. If you are land banking for maximum long-term yield in high-growth corridors, verified excised land offers superior capital entry points.</li>
        </ol>
      </section>

      <blockquote class="blog-takeaway">
        <p><strong>Key Takeaway:</strong> Securing your investment starts with verified paper, not promise.</p>
      </blockquote>
    `
  },
  "land-beats-inflation": {
    category: "Investment Strategy",
    title: "Why High-Yield Land Investments Beat Market Inflation",
    date: "August 08, 2026",
    content: `
      <p class="lead-text">
        When inflation steadily erodes local currency value and stock market volatility leaves traditional portfolios exposed, wealth preservation requires hard assets. Cash sitting in standard savings vehicles loses purchasing power every day, while traditional fixed-income yields often fail to keep pace with real inflation rates.
      </p>
      <p>Strategic land banking—acquiring undeveloped land in high-growth corridors before peak urbanization—stands out as one of the few asset classes that consistently outperforms inflation while delivering exponential capital appreciation.</p>

      <hr class="divider">

      <section class="blog-section">
        <h3>The Mechanics of Inflation Protection</h3>
        <p>Land is an inherently finite asset. Unlike fiat currency, state governments and developers cannot manufacture more real estate in high-demand economic hubs.</p>
        <ul class="blog-list">
          <li><strong>Scarcity-Driven Value:</strong> As population density expands into emerging corridors, land supply shrinks while demand surges. This built-in economic dynamic ensures land values reprice upward alongside inflation.</li>
          <li><strong>Intrinsic Capital Preservation:</strong> Liquid assets depreciate as consumer prices rise, but raw land maintains intrinsic structural value. It is unaffected by corporate earnings misses, management failures, or short-term market speculation.</li>
        </ul>
      </section>

      <hr class="divider">

      <section class="blog-section">
        <h3>Strategic Land Banking vs. Traditional Vehicles</h3>
        <div class="table-wrapper">
          <table class="blog-table">
            <thead>
              <tr>
                <th>Investment Asset</th>
                <th>Inflation Resistance</th>
                <th>Volatility Risk</th>
                <th>Long-Term ROI Potential</th>
                <th>Ongoing Holding Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Land Banking (Growth Corridors)</strong></td>
                <td>Exceptionally High</td>
                <td>Very Low</td>
                <td>Exponential (100%–300%+)</td>
                <td>Minimal (No structure maintenance)</td>
              </tr>
              <tr>
                <td><strong>Fixed Savings / Money Market</strong></td>
                <td>Negative (Fails to match inflation)</td>
                <td>Zero</td>
                <td>Low / Fixed</td>
                <td>None</td>
              </tr>
              <tr>
                <td><strong>Equities / Stocks</strong></td>
                <td>Moderate</td>
                <td>High</td>
                <td>Moderate to High</td>
                <td>Portfolio Management Fees</td>
              </tr>
              <tr>
                <td><strong>Developed Residential Rental</strong></td>
                <td>Moderate (Tied to rental caps)</td>
                <td>Medium</td>
                <td>Steady Cashflow</td>
                <td>High (Maintenance, tenant repairs)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr class="divider">

      <section class="blog-section">
        <h3>Why Land Outperforms Developed Property for High Yields</h3>
        <ul class="blog-list">
          <li><strong>Zero Asset Depreciation:</strong> Buildings, structural finishes, and mechanical systems degrade over time, requiring continuous capital expenditure. Raw land requires no physical maintenance, structural repairs, or tenant management.</li>
          <li><strong>Lower Entry Barriers, Higher Margins:</strong> Purchasing unmapped or newly excised plots in expanding outskirts allows investors to enter at pre-infrastructure prices. When major government infrastructure (highways, industrial parks, or transport hubs) reaches the corridor, land values experience sharp upward resets rather than gradual growth.</li>
          <li><strong>Flexible Exit Strategies:</strong> Land offers versatile options when it is time to harvest returns. You can sell directly to commercial developers, joint-venture with builders, or divide into serviced residential plots for retail buyers.</li>
        </ul>
      </section>

      <hr class="divider">

      <section class="blog-section">
        <h3>Maximizing ROI in High-Growth Corridors</h3>
        <ol class="blog-steps">
          <li><strong>Target Infrastructure Triggers:</strong> Identify regions backed by confirmed state or federal infrastructure commitments—such as new bypass roads, industrial free zones, or commercial seaports/airports.</li>
          <li><strong>Verify Titles First:</strong> High returns are only possible on secure ground. Ensure all targeted parcels have verified roots of title, clear gazette entries, or unencumbered governor’s consent before executing acquisition.</li>
        </ol>
      </section>

      <blockquote class="blog-takeaway">
        <p><strong>Key Takeaway:</strong> Building generational wealth isn't about chasing speculative short-term trends; it is about anchoring capital into hard, appreciating assets that outpace currency debasement.</p>
      </blockquote>
    `
  }
};

// Open Blog Modal Function
function openBlogModal(postKey) {
  const post = blogPosts[postKey];
  if (!post) return;

  document.getElementById("modal-category").innerText = post.category;
  document.getElementById("modal-title").innerText = post.title;
  document.getElementById("modal-date").innerHTML = `<i class="fa-regular fa-calendar"></i> ${post.date}`;
  document.getElementById("modal-body").innerHTML = post.content;

  document.getElementById("blog-modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

// Close Blog Modal Function
function closeBlogModal() {
  document.getElementById("blog-modal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Global click listener to close modal on backdrop click
window.addEventListener("click", (event) => {
  const modal = document.getElementById("blog-modal");
  if (event.target === modal) {
    closeBlogModal();
  }
});

// ==========================================
// 5. APPLICATION INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Trigger Supabase property fetch on page ready
  fetchPropertiesFromSupabase("property-grid");
});
