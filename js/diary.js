document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Fade scroll prompt
  gsap.to("#scroll-prompt", {
    scrollTrigger: {
      trigger: "#page-content",
      start: "top top",
      end: "top+=50",
      toggleActions: "play none none none",
    },
    opacity: 0,
    duration: 0.5,
  });

  // Pin & animate title block
  gsap.fromTo(
    "#title-block",
    {
      opacity: 0,
      y: 50,
    },
    {
      scrollTrigger: {
        trigger: "#title-block",
        start: "top top",
        end: "+=300", // Shorter pin distance
        pin: true,
        scrub: true,
        onLeave: () => {
          // After title unpins, smooth scroll to section 1
          document
            .querySelector("#content-1")
            .scrollIntoView({ behavior: "smooth" });
        },
      },
      opacity: 1,
      y: 0,
      duration: 0.8, // Faster animation
      ease: "power2.out",
    }
  );

  // Snap to each section cleanly
  const sections = gsap.utils.toArray(".content-section");
  sections.forEach((section, index) => {
    const blocks = section.querySelectorAll(".text-block, .image-block");

    // Reveal content with fade-in
    gsap.fromTo(
      blocks,
      {
        opacity: 0,
        y: 80,
      },
      {
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
      }
    );

    // Fake snapping by adding section spacing
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      snap: 1,
    });
  });

   gsap.to("#final-cta", {
    scrollTrigger: {
      trigger: "#final-cta",
      start: "top bottom", 
      end: "bottom bottom",
      toggleActions: "play none none none",
    },
    opacity: 1,
    visibility: "visible",
    y: 0,
    duration: 1.5,
  });

  // Set the initial state of the final button (for the slide-up animation)
  gsap.set("#final-cta", { y: 50 });


});
