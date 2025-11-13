console.log('\n=== TEST-NAVBAR.JS ===\n');

setTimeout(() => {
  console.log('STEP 1: Check if mobile or desktop');
  const cw = document.documentElement.clientWidth;
  const shouldBeMobile = cw <= 1024;
  console.log('  Width:', cw, '→ Mobile:', shouldBeMobile);
  
  console.log('\nSTEP 2: Check navbars presence');
  const mobileNavbar = document.querySelector('[data-testid="mobile-navbar"]');
  const desktopNavbar = document.querySelector('[data-testid="desktop-navbar"]');
  console.log('  Mobile navbar:', !!mobileNavbar);
  console.log('  Desktop navbar:', !!desktopNavbar);
  
  console.log('\nSTEP 3: Check hamburger');
  const hamburger = document.querySelector('[data-testid="mobile-menu-button"]');
  console.log('  Hamburger:', !!hamburger);
  if (hamburger) {
    console.log('    Size:', hamburger.offsetWidth, 'x', hamburger.offsetHeight);
  }
  
  console.log('\nSTEP 4: OPEN MOBILE MENU');
  if (hamburger && shouldBeMobile) {
    hamburger.click();
    console.log('  Menu opened!');
    
    // Wait for animation
    setTimeout(() => {
      const mobileMenu = document.querySelector('[data-testid="mobile-menu"]');
      console.log('\nSTEP 5: Check mobile menu after open');
      console.log('  Mobile menu:', !!mobileMenu);
      
      if (mobileMenu) {
        const links = mobileMenu.querySelectorAll('a[href^="/"]');
        console.log('  Links in menu:', links.length);
        links.forEach(link => {
          const text = link.textContent.trim().substring(0, 12);
          console.log(`    - ${text}: ${link.offsetWidth}x${link.offsetHeight}`);
        });
      }
      
      console.log('\n=== TEST END ===\n');
    }, 500);
  } else {
    console.log('\nSTEP 5: Desktop navbar check');
    const allLinks = document.querySelectorAll('a[href^="/"]');
    console.log('  Links found:', allLinks.length);
    if (allLinks.length > 0) {
      console.log('  First 3 links:');
      Array.from(allLinks).slice(0, 3).forEach(link => {
        console.log(`    - ${link.textContent.trim()}: ${link.offsetWidth}x${link.offsetHeight}`);
      });
    }
    
    console.log('\n=== TEST END ===\n');
  }
}, 1500);
