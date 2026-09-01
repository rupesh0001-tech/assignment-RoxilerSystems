// Navbar Scroll Effect and Mobile Menu Toggle
const navbar = document.getElementById('navbar');
const navbarLogo = document.getElementById('navbar-logo');
const getStartedBtn = document.getElementById('get-started-btn');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Class presets
const unscrolledNav = ['md:px-16', 'lg:px-24', 'xl:px-32', 'w-full'];
const scrolledNav = ['md:w-5xl', 'w-[calc(100vw-14px)]', 'bg-white/60', 'backdrop-blur-2xl', 'rounded-full', 'mt-4', 'pl-6', 'shadow'];
const unscrolledBtn = ['bg-zinc-50', 'text-zinc-800', 'hover:bg-zinc-200', 'rounded-md'];
const scrolledBtn = ['bg-zinc-900', 'text-white', 'hover:bg-zinc-800', 'rounded-full'];

// Scroll Event Listener
window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 50;
    if (isScrolled) {
        navbar.classList.remove(...unscrolledNav);
        navbar.classList.add(...scrolledNav);
        navbarLogo.classList.add('invert', 'opacity-80');
        navLinks.forEach(link => {
            link.classList.remove('text-white', 'hover:text-white/90');
            link.classList.add('text-zinc-800', 'hover:text-zinc-600');
        });
        mobileNavLinks.forEach(link => {
            link.classList.remove('text-white', 'hover:text-white/90');
            link.classList.add('text-zinc-800', 'hover:text-zinc-600');
        });
        getStartedBtn.classList.remove(...unscrolledBtn);
        getStartedBtn.classList.add(...scrolledBtn);
        mobileMenuToggle.classList.remove('text-white');
        mobileMenuToggle.classList.add('text-zinc-800');
    } else {
        navbar.classList.remove(...scrolledNav);
        navbar.classList.add(...unscrolledNav);
        navbarLogo.classList.remove('invert', 'opacity-80');
        navLinks.forEach(link => {
            link.classList.remove('text-zinc-800', 'hover:text-zinc-600');
            link.classList.add('text-white', 'hover:text-white/90');
        });
        mobileNavLinks.forEach(link => {
            link.classList.remove('text-zinc-800', 'hover:text-zinc-600');
            link.classList.add('text-white', 'hover:text-white/90');
        });
        getStartedBtn.classList.remove(...scrolledBtn);
        getStartedBtn.classList.add(...unscrolledBtn);
        mobileMenuToggle.classList.remove('text-zinc-800');
        mobileMenuToggle.classList.add('text-white');
    }
}, { passive: true });
// Mobile Menu Toggles
const openMenu = () => {
    mobileMenuOverlay.classList.remove('w-0');
    mobileMenuOverlay.classList.add('w-full');
};
const closeMenu = () => {
    mobileMenuOverlay.classList.remove('w-full');
    mobileMenuOverlay.classList.add('w-0');
};
mobileMenuToggle.addEventListener('click', openMenu);
mobileMenuClose.addEventListener('click', closeMenu);
mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

// Horizontal Scroll Effect for Gallery Section
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("gallery-container");
  const track = document.getElementById("gallery-track");

  if (!container || !track) return;

  const handleScroll = () => {
    const rect = container.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const totalHeight = rect.height;
    const scrolled = -rect.top;
    const maxScroll = totalHeight - viewHeight;

    if (maxScroll <= 0) return;

    // Clamped scroll progress (0 to 1)
    const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

    // Calculate limit (total scrollable horizontal width)
    const limit = Math.max(0, track.scrollWidth - window.innerWidth);

    // Apply horizontal transform on the track
    track.style.transform = `translateX(-${progress * limit}px)`;
  };

  // Attach event listeners
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  // Initial trigger after repaint / images loaded
  setTimeout(handleScroll, 100);
});

// Why Choose Us Data
const whyChooseUsData = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 text-zinc-600"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    title: "Verified Property Listings",
    description: "Access a curated database of verified, high-quality properties, ensuring transparency and security in every transaction.",
    image: "assets/house.png"
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 text-zinc-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    title: "Expert Local Market Insights",
    description: "Make informed decisions with the help of our experienced agents who provide detailed analysis and neighborhood trends.",
    image: "assets/galleryImage1.png"
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9.167 14.17 1.666 1.666a1.766 1.766 0 0 0 2.5 0 1.77 1.77 0 0 0 0-2.5" stroke="#52525c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m11.667 11.667 2.083 2.083a1.768 1.768 0 1 0 2.5-2.5l-3.233-3.233a2.5 2.5 0 0 0-3.533 0l-.734.733a1.768 1.768 0 1 1-2.5-2.5l2.342-2.34a4.825 4.825 0 0 1 5.883-.725l.392.233c.355.214.777.289 1.183.208l1.45-.291" stroke="#52525c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m17.5 2.5.833 9.167h-1.666M2.5 2.5l-.833 9.167 5.416 5.416a1.767 1.767 0 1 0 2.5-2.5M2.5 3.336h6.667" stroke="#52525c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: "Seamless Buying & Selling Process",
    description: "We guide you through every stage of your real estate transaction, from initial listing or search to final closing.",
    image: "assets/galleryImage2.png"
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 text-zinc-600"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 2 7 22 7"/><path d="M5 22v-4h14v4"/></svg>`,
    title: "Mortgage & Financing Support",
    description: "Find competitive financing options and custom mortgage structures through our network of trusted lending partners.",
    image: "assets/galleryImage3.png"
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 9.164H5a1.667 1.667 0 0 1 1.667 1.667v2.5A1.666 1.666 0 0 1 5 14.997h-.833A1.667 1.667 0 0 1 2.5 13.331zm0 0a7.5 7.5 0 1 1 15 0m0 0v4.167a1.666 1.666 0 0 1-1.667 1.666H15a1.666 1.666 0 0 1-1.667-1.666v-2.5A1.667 1.667 0 0 1 15 9.164z" stroke="#52525c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 13.336v1.667a3.333 3.333 0 0 1-3.333 3.333H10" stroke="#52525c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: "Dedicated Client Service",
    description: "Our team is available round-the-clock to address your questions and deliver personalized, professional support.",
    image: "assets/galleryImage4.png"
  }
];

// Accordion Functionality
document.addEventListener("DOMContentLoaded", () => {
  const accordionContainer = document.getElementById("accordion-container");
  const imageFrame = document.getElementById("image-frame");
  if (!accordionContainer || !imageFrame) return;

  // 1. Generate & Insert the Default Base Image
  const defaultImg = Object.assign(document.createElement("img"), {
    id: "image-default",
    src: "assets/house.png",
    alt: "Luxury Residential Home",
    className: "accordion-img visible-img"
  });
  imageFrame.appendChild(defaultImg);

  // 2. Loop through data to build accordion headers, descriptions and associated absolute images
  whyChooseUsData.forEach((item, index) => {
    const sideImg = Object.assign(document.createElement("img"), {
      id: `image-${index}`,
      src: item.image,
      alt: item.title,
      className: "accordion-img hidden-img"
    });
    imageFrame.appendChild(sideImg);

    const accordionItem = document.createElement("div");
    accordionItem.className = "bg-white rounded-sm border border-zinc-100/50 overflow-hidden";
    accordionItem.innerHTML = `
      <button class="w-full flex items-center justify-between p-4 md:py-4 md:px-6 text-left hover:bg-zinc-50/30 transition cursor-pointer" data-index="${index}">
        <div class="flex items-center gap-4">
          <div>${item.icon}</div>
          <span class="text-sm md:text-base text-zinc-600">${item.title}</span>
        </div>
        <div class="toggle-icons">
          <svg class="size-4 text-zinc-700 plus-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <svg class="size-4 text-zinc-700 minus-icon hidden" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
        </div>
      </button>
      <div class="accordion-content">
        <div class="overflow-hidden">
          <p class="p-4 md:px-10 pt-0 text-xs md:text-sm text-zinc-500 leading-relaxed bg-zinc-50/10">${item.description}</p>
        </div>
      </div>
    `;
    accordionContainer.appendChild(accordionItem);
  });

  // 3. Add Accordion Event Listener
  let openIndex = null;
  const headers = accordionContainer.querySelectorAll("button[data-index]");
  const allImages = imageFrame.querySelectorAll(".accordion-img");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const clickedIndex = parseInt(header.getAttribute("data-index"), 10);
      openIndex = openIndex === clickedIndex ? null : clickedIndex;

      // Update active classes for all accordion headers
      headers.forEach((h, i) => {
        const isOpen = openIndex === i;
        const item = h.closest(".bg-white");
        item.querySelector(".accordion-content").classList.toggle("is-open", isOpen);
        item.querySelector(".plus-icon").classList.toggle("hidden", isOpen);
        item.querySelector(".minus-icon").classList.toggle("hidden", !isOpen);
      });

      // Update active classes for all images
      allImages.forEach((img) => {
        const isTarget = (openIndex === null && img === defaultImg) || (openIndex !== null && img.id === `image-${openIndex}`);
        img.classList.toggle("visible-img", isTarget);
        img.classList.toggle("hidden-img", !isTarget);
      });
    });
  });
});

// Testimonials Data
const testimonialsCol1 = [
  {
    name: "Michael Anderson",
    location: "Austin, Texas",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80",
    text: "The entire buying process was seamless. We found our dream home faster than expected."
  },
  {
    name: "Sarah Thompson",
    location: "Miami, Florida",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80",
    text: "Professional, responsive, and incredibly knowledgeable. They helped us secure the perfect waterfront property."
  },
  {
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80",
    text: "From property tours to closing, everything was handled professionally. I couldn't have asked for experience."
  }
];

const testimonialsCol2 = [
  {
    name: "David Wilson",
    location: "Chicago, Illinois",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80",
    text: "Their local market expertise made all the difference. We sold our home above asking price within days."
  },
  {
    name: "Daniel Kim",
    location: "Seoul, South Korea",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=120&h=120&q=80",
    text: "From property tours to closing, everything was handled professionally. I couldn't have asked for experience."
  },
  {
    name: "James Parker",
    location: "Denver, Colorado",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=120&h=120&q=80",
    text: "As a first-time homebuyer, I felt supported throughout the entire journey. Highly recommended."
  }
];

// Testimonials Carousel Functionality
document.addEventListener("DOMContentLoaded", () => {
  const col1Container = document.getElementById("marquee-col-1");
  const col2Container = document.getElementById("marquee-col-2");

  // Helper function to build star rating and card template
  const createCardHTML = (item) => `
    <div class="bg-white p-6 rounded-xl flex flex-col gap-4 w-70 sm:w-[320px] select-none">
      <div class="flex items-center gap-3">
        <img src="${item.avatar}" alt="${item.name}" class="size-11 rounded-full object-cover shrink-0" />
        <div class="flex flex-col">
          <span class="text-sm font-medium text-zinc-800">${item.name}</span>
          <span class="text-sm text-zinc-600 mt-0.5">${item.location}</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        ${Array(5).fill('<svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.746.346a.5.5 0 0 1 .95 0l.89 2.739a.5.5 0 0 0 .476.345h2.88a.5.5 0 0 1 .293.905L7.906 6.028a.5.5 0 0 0-.182.559l.89 2.738a.5.5 0 0 1-.77.56L5.516 8.191a.5.5 0 0 0-.588 0l-2.33 1.693a.5.5 0 0 1-.77-.559l.89-2.738a.5.5 0 0 0-.181-.56L.207 4.336a.5.5 0 0 1 .294-.905h2.88a.5.5 0 0 0 .475-.345z" fill="#ff8904"/></svg>').join('')}
      </div>
      <p class="text-sm leading-relaxed text-zinc-500">${item.text}</p>
    </div>
  `;

  // Render cards twice in each marquee track for a seamless loop
  if (col1Container) {
    col1Container.innerHTML = [...testimonialsCol1, ...testimonialsCol1].map(createCardHTML).join("");
  }
  if (col2Container) {
    col2Container.innerHTML = [...testimonialsCol2, ...testimonialsCol2].map(createCardHTML).join("");
  }
});
