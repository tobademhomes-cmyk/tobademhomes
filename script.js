/**
 * TOBADEM HOMES - MASTER JAVASCRIPT
 * Includes Property Listing Engine, Team Gallery Engine, Location Filtering, Reviews Slider, and Dynamic Modal Systems
 */

// ==========================================
// 1. CONTACT CONFIGURATION
// ==========================================
const TOBADEM_WHATSAPP = "2348109005495";

// ==========================================
// 2. TEAM MEMBERS DATABASE (EDIT NAMES, TITLES, & IMAGE PATHS HERE)
// ==========================================
const teamMembers = [
  {
    id: 1,
    name: "Adelugbin Michael Tobi",
    designation: "CEO & Founder",
    imageUrl: "images/ceo-photo.jpeg" // <--- Update image path here
  },
  {
    id: 2,
    name: "Legal Advisory Team",
    designation: "Property Title Verification",
    imageUrl: "images/team-legal.jpeg" // <--- Update image path here
  },
  {
    id: 3,
    name: "Acquisitions Team",
    designation: "Land Banking Strategy",
    imageUrl: "images/team-acquisitions.jpeg" // <--- Update image path here
  }
];

// ==========================================
// 3. PROPERTY DATABASE
// ==========================================
const properties = [
  {
    id: 1,
    title: "3-Bedroom Semi-Detached Duplex",
    location: "BlueStone Estate, Mowe Ofada, Ogun State",
    type: "Smart Homes",
    price: "₦165,000,000",
    initialDeposit: "₦33,000,000",
    paymentPlan: "Flexible Spread Available",
    features: ["Prime Expressway Frontage", "High ROI Commercial Corridor", "Instant Physical Allocation"],
    imageUrl: "images/fortune-pairs.jpeg"
  },
  {
    id: 2,
    title: "3-Bedroom Bungalow with a Room BQ (Semi-finished)",
    location: "BlueStone Estate, Mowe Ofada, Ogun State",
    type: "3-Bedroom Bungalow + BQ",
    price: "₦65,000,000 (Land)",
    initialDeposit: "₦5,000,000",
    paymentPlan: "Up to 12 Months",
    features: ["Secure Perimeter Fencing", "Paved Estate Road Network", "Dedicated Electricity Infrastructure"],
    imageUrl: "images/3-bedroom-bluestone.jpeg"
  },
  {
    id: 3,
    title: "2-Bedroom Apartment (Semi-Finished)",
    location: "Treasure Island Phase 1, Mowe Ofada, Ogun State",
    type: "Smart Homes",
    price: "₦25,000,000",
    initialDeposit: "₦2,500,000",
    paymentPlan: "6 - 12 Months",
    features: ["Secure Perimeter Fencing", "C of O", "Rapid Capital Growth Zone"],
    imageUrl: "images/treasure2.jpeg"
  },
  {
    id: 4,
    title: "2-Bedroom Bungalow",
    location: "Mowe Ofada, Ogun State",
    type: "Smart Homes",
    price: "₦47,000,000",
    initialDeposit: "₦5,000,000",
    paymentPlan: "Flexible Installments",
    features: ["Gated Security Community", "24/7 Monitored Surveillance", "Fully Paved Access Roads"],
    imageUrl: "images/queen1.jpeg"
  },
  {
    id: 5,
    title: "1-Bedroom Apartment",
    location: "Abijo, Lekki, Lagos",
    type: "Smart Apartments & Terraces",
    price: "₦65,000,000",
    initialDeposit: "₦5,000,000",
    paymentPlan: "Up to 18 Months",
    features: ["Full Smart Home Automation", "Solar Energy Integration", "Biometric & Keyless Security"],
    imageUrl: "images/avocado1.jpeg"
  },
  {
    id: 6,
    title: "Arámìdé Bungalow",
    location: "Aiyetoro, Ibeju-Lekki, Lagos",
    type: "3-Bedroom Bungalow + BQ",
    price: "₦75,000,000",
    initialDeposit: "₦3,000,000",
    paymentPlan: "Outright (₦75M) | 6M (₦80M) | 12M (₦85M)",
    features: ["Integrated Rooftop Solar Panels", "Recyclable Eco Finishes", "Fully Fitted Appliances"],
    imageUrl: "images/aramide1.jpeg"
  },
  {
    id: 7,
    title: "Luxury Suite Apartments",
    location: "Ilasamaja Road, Mushin, Lagos",
    type: "Luxury 2-Bedroom Apartment",
    price: "₦85,000,000",
    initialDeposit: "Flexible Terms",
    paymentPlan: "0-3M Outright | 3-6M | 6-12M Installments",
    features: ["Smart Door Locks & Automation", "Dedicated Inverter System", "Italian Marble Kitchen Counters"],
    imageUrl: "images/mushin1.jpeg"
  },
  {
    id: 8,
    title: "Cocoa RepubliQ",
    location: "Shapala, Obafemi Owode, Ogun State",
    type: "Agro-Real Estate & Land Banking",
    price: "₦4,000,000 per Acre",
    initialDeposit: "₦500,000",
    paymentPlan: "0-3 Months Interest-Free | 6 Months (₦4.5M)",
    features: ["Fully Managed Cocoa Farm Asset", "Passive Retirement Yield", "Est. ₦5M-₦8M Annual Dividend"],
    imageUrl: "images/cocoa1.jpeg"
  },
  {
    id: 9,
    title: "The Bolton Height",
    location: "The Nest, Lekki Phase 1, Lagos",
    type: "Luxury 2-Bedroom Apartment",
    price: "₦270,000,000",
    initialDeposit: "₦20,000,000",
    paymentPlan: "12 Months Interest-Free",
    features: ["Electric Vehicle Charging Ports", "Automated Smart Home Controls", "Olympic Swimming Pool & Gym"],
    imageUrl: "images/bolton1.jpeg"
  },
  {
    id: 10,
    title: "Champions Court",
    location: "Igbodu, Epe, Lagos",
    type: "500sqm Land Plot",
    price: "₦14,000,000 (All-Inclusive)",
    initialDeposit: "₦2,000,000",
    paymentPlan: "Balance Spread Over 6 Months",
    features: ["Full Perimeter Fencing", "24/7 Live CCTV Network", "Adjacent to Lagos Film City & Food Hub"],
    imageUrl: "images/champions-court1.jpeg"
  },
  {
    id: 11,
    title: "Glamour Estate",
    location: "Epe Corridor, Lagos",
    type: "500sqm Land Plot",
    price: "₦5,000,000 (Valued at ₦6,000,000)",
    initialDeposit: "₦1,000,000",
    paymentPlan: "Balance Spread Over 6 Months",
    features: ["Access Card Gate House System", "Eco-Friendly Infrastructure", "Opposite St. Augustine University"],
    imageUrl: "images/glamour1.jpeg"
  },
  {
    id: 12,
    title: "Co-Buy to Resell 3.0 (RECBCOOP)",
    location: "Prime Lagos & Ogun Asset Portfolios",
    type: "Real Estate Cashback",
    price: "₦1,000,000 Minimum Entry",
    initialDeposit: "Full Equity Contribution",
    paymentPlan: "12 Months Investment Tenor",
    features: ["35% Annual Yield (₦1M - ₦100M)", "37% Annual Yield (₦101M - ₦1B)", "Fully Asset-Backed Capital Growth"],
    imageUrl: "images/co-buy1.jpeg"
  }
];

let activeFilter = "All";

// ==========================================
// 4. TEAM MEMBERS RENDERER (SIDE-BY-SIDE LAYOUT)
// ==========================================
function renderTeamMembers(containerId = "teamTrack") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Apply horizontal side-by-side flex layout directly
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.gap = "1.5rem";
  container.style.overflowX = "auto";
  container.style.padding = "1rem 0";
  container.style.scrollBehavior = "smooth";

  container.innerHTML = teamMembers.map(member => `
    <article class="team-card" style="flex: 0 0 280px; max-width: 280px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #e2e8f0;">
      <div class="team-image-wrapper" style="width: 100%; height: 280px; overflow: hidden; background: #f8fafc;">
        <img 
          src="${member.imageUrl}" 
          alt="${member.name}" 
          loading="lazy" 
          style="width: 100%; height: 100%; object-fit: cover; display: block;"
          onerror="this.onerror=null; this.src='images/ceo-photo.jpeg';"
        />
      </div>
      <div class="team-card-body" style="padding: 1.25rem 1rem;">
        <h3 class="team-name" style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem;">${member.name}</h3>
        <p class="team-designation" style="font-size: 0.9rem; color: #2563eb; font-weight: 600; margin: 0;">${member.designation}</p>
      </div>
    </article>
  `).join('');
}

// ==========================================
// 5. PROPERTY LISTING RENDERER
// ==========================================
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

  // 3. Filter properties list
  const filteredProps = activeFilter === "All" 
    ? properties 
    : properties.filter(p => p.location.toLowerCase().includes(activeFilter.toLowerCase()));

  // 4. Render property cards into grid
  if (filteredProps.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No properties currently listed in ${activeFilter}.</p>`;
  } else {
    container.innerHTML = filteredProps.map(prop => {
      const waText = encodeURIComponent(`Hello Tobadem Homes, I want to verify the title and request inspection details for ${prop.title} (${prop.location}).`);
      const waLink = `https://wa.me/${TOBADEM_WHATSAPP}?text=${waText}`;

      return `
        <article class="property-card" data-id="${prop.id}">
          <div class="card-image-wrapper">
            <img 
              src="${prop.imageUrl}" 
              alt="${prop.title}" 
              loading="lazy" 
              class="card-img"
              onerror="this.onerror=null; this.style.display='none';"
            />
            <span class="card-badge">${prop.type}</span>
            <div class="verification-seal">
              <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              Verified Title
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
              <div class="deposit-tag" style="font-size: 0.85rem; color: var(--text-dark); margin-top: 4px;">
                <span>Initial Deposit:</span> <strong>${prop.initialDeposit}</strong>
              </div>
            </div>

            <ul class="card-features-list" style="list-style: none; padding: 0; margin: 1rem 0; font-size: 0.88rem; display: flex; flex-direction: column; gap: 0.4rem;">
              ${prop.features.map(feat => `
                <li style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: var(--brand-green); font-weight: bold;">✓</span>
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
// 6. REVIEWS SLIDER CONTROLLER
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
      
      <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-color);">

      <section>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">What is an Excision?</h3>
        <p>Under the Land Use Act of 1978, all land within a state is vested in the Governor to hold in trust for the populace. An <strong>Excision</strong> is the legal process where the state government officially carves out a specific portion of land from government acquisition and returns full legal control to the indigenous community or landowning family.</p>
        <ul style="margin: 0.8rem 0 1rem 1.5rem;">
          <li><strong>The Gazette:</strong> Once an excision is completed and approved, it is published in the official government record known as a <strong>Gazette</strong>.</li>
          <li><strong>Investment Profile:</strong> Excised land provides clear title while usually entering the market at a more accessible price point than land with an individual C of O. This makes it an ideal vehicle for land banking and high-margin capital appreciation.</li>
        </ul>
      </section>

      <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-color);">

      <section>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">What is a Certificate of Occupancy (C of O)?</h3>
        <p>A <strong>Certificate of Occupancy</strong> is an official leasehold document issued directly by the State Government. It certifies that the named holder has exclusive ownership rights and land use authorization for a term of up to 99 years.</p>
        <ul style="margin: 0.8rem 0 1rem 1.5rem;">
          <li><strong>Primary Security:</strong> A C of O can be issued directly on state land or processed independently over excised family land.</li>
          <li><strong>Institutional Leverage:</strong> Banks and financial institutions treat a C of O as prime collateral, making it easier to leverage for project financing or resale to institutional investors.</li>
        </ul>
      </section>

      <blockquote style="background: var(--bg-light); border-left: 4px solid var(--accent); padding: 1rem; margin-top: 1.5rem; border-radius: 4px;">
        <p><strong>Key Takeaway:</strong> Securing your investment starts with verified paper, not promise.</p>
      </blockquote>
    `
  },
  "land-beats-inflation": {
    category: "Investment Strategy",
    title: "Why High-Yield Land Investments Beat Market Inflation",
    date: "August 08, 2026",
    content: `
      <p class="lead-text" style="font-weight: 600; font-size: 1.1rem; color: var(--primary);">
        When inflation steadily erodes local currency value and stock market volatility leaves traditional portfolios exposed, wealth preservation requires hard assets. Cash sitting in standard savings vehicles loses purchasing power every day, while traditional fixed-income yields often fail to keep pace with real inflation rates.
      </p>
      <p>Strategic land banking—acquiring undeveloped land in high-growth corridors before peak urbanization—stands out as one of the few asset classes that consistently outperforms inflation while delivering exponential capital appreciation.</p>

      <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-color);">

      <section>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">The Mechanics of Inflation Protection</h3>
        <p>Land is an inherently finite asset. Unlike fiat currency, state governments and developers cannot manufacture more real estate in high-demand economic hubs.</p>
        <ul style="margin: 0.8rem 0 1rem 1.5rem;">
          <li><strong>Scarcity-Driven Value:</strong> As population density expands into emerging corridors, land supply shrinks while demand surges. This built-in economic dynamic ensures land values reprice upward alongside inflation.</li>
          <li><strong>Intrinsic Capital Preservation:</strong> Liquid assets depreciate as consumer prices rise, but raw land maintains intrinsic structural value. It is unaffected by corporate earnings misses, management failures, or short-term market speculation.</li>
        </ul>
      </section>

      <blockquote style="background: var(--bg-light); border-left: 4px solid var(--accent); padding: 1rem; margin-top: 1.5rem; border-radius: 4px;">
        <p><strong>Key Takeaway:</strong> Building generational wealth isn't about chasing speculative short-term trends; it is about anchoring capital into hard, appreciating assets that outpace currency debasement.</p>
      </blockquote>
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

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  renderTobademProperties("property-grid");
  renderTeamMembers("teamTrack"); // Renders team cards side-by-side into #teamTrack
  setupReviewsSlider();
});
