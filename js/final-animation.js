window.onload = () => {
  // --- 1. ELEMENT SELECTORS ---
  const body = document.body;
  const lotusScene = document.querySelector("#lotus-scene");
  const textContainer = document.querySelector("#text-container");
  const cakeScene = document.querySelector("#cake-scene");
  const cakeContainer = document.querySelector(".cake-container");
  const flame = document.querySelector("#flame");
  const blowCandlePrompt = document.querySelector("#blow-candle-prompt");
  const celebrationScene = document.querySelector("#celebration-scene");
  const confettiContainer = document.querySelector("#confetti-container");
  const birthdayText = document.querySelector("#birthday-text");
  const finalMessage = document.querySelector("#final-message");
  const letterContainer = document.querySelector("#letter-container");

  let celebrationInterval;

  finalMessage.innerHTML =
    "May this day be as bright and beautiful as your smile. Wishing you all the happiness in the world. <br>I love you, Pratigya.";

  // --- 2. SETUP INITIAL STATE ---
  function setInitialStates() {
    gsap.set(body, { backgroundColor: "rgb(253, 250, 253)" });
    gsap.set(lotusScene, { opacity: 0 }); // Start invisible for fade-in
    gsap.set([cakeScene, celebrationScene, letterContainer], {
      display: "none",
      opacity: 0,
      pointerEvents: "none",
    });
    gsap.set([finalMessage, flame, blowCandlePrompt], { opacity: 0 });
  }

  // --- 3. ANIMATION FUNCTIONS ---

  function createIntroAnimation() {
    const tl = gsap.timeline();
    const messages = [
      "And on July 8th, he wanted to make her smile like never before.",
      "It all began on May 17th... an ordinary date, until you made it unforgettable.",
      "Now, celebrating your 19th birthday together...",
      "...I know this is the first of many beautiful moments to come.",
    ];

    tl.to(lotusScene, {
      opacity: 1,
      duration: 2.5,
      ease: "power2.inOut",
      onStart: () => {
        document.querySelector(".lotus-glow").style.opacity = "1";
      },
    });

    messages.forEach((msg) => {
      const p = document.createElement("p");
      p.textContent = msg;
      textContainer.appendChild(p);
      tl.to(p, { opacity: 1, duration: 1.5 })
        .to(p, { opacity: 0, duration: 1.5 }, "+=2.5")
        .call(() => p.remove());
    });
    return tl;
  }

  function createCakeTransitionAnimation() {
    const tl = gsap.timeline();

    tl.to('.lotus-glow', { opacity: 0, duration: 1 }, "<");

    // Step 1: Fade out lotus scene completely
    tl.to(lotusScene, { opacity: 0, duration: 1.5 }).set(lotusScene, {
      display: "none",
    });

    // Step 2: SIMULTANEOUSLY darken background, show the scene, and animate in the cake/flame
    tl.set(
      cakeScene,
      { display: "flex", opacity: 1, pointerEvents: "auto" },
      "<"
    )
      .to(body, { backgroundColor: "#1a1a1a", duration: 1.5 }, "<")
      .from(
        cakeContainer,
        { y: 100, opacity: 0, duration: 1.5, ease: "power2.out" },
        "<"
      )
      .to(flame, { opacity: 1, duration: 1.5 }, "<");

    // Step 3: 0.5 seconds LATER, the prompt appears
    tl.to(blowCandlePrompt, { opacity: 1, duration: 1 }, "+=0.5");

    return tl;
  }
  // In final-animation.js, find the handleFlameClick function and REPLACE it with this:

  function handleFlameClick() {
    const celebrateTl = gsap.timeline();

    celebrateTl.to([flame, blowCandlePrompt], { opacity: 0, duration: 0.5 });

    celebrateTl
      .to(body, { backgroundColor: "#fff", duration: 1 })
      .to(cakeContainer, { y: "120vh", ease: "power2.in", duration: 1.2 }, "<")
      .set(cakeScene, { display: "none" });

    celebrateTl
      .set(celebrationScene, {
        display: "flex",
        opacity: 1,
        pointerEvents: "none",
      })
      .from(birthdayText, {
        scale: 0.3,
        opacity: 0,
        ease: "back.out(1.7)",
        duration: 0.8,
      })
      .call(() => {
        // Start DENSE continuous celebration
        celebrationInterval = setInterval(() => {
          for (let i = 0; i < 3; i++)
            createEffect("confetti-piece", 5 + Math.random() * 5);
          if (Math.random() > 0.8)
            createEffect("balloon", 9 + Math.random() * 7);
        }, 70);
      });

    // --- THIS IS THE SECTION THAT IS FIXED ---
    celebrateTl
      // 1. Fade out the birthday text as before
      .to(
        birthdayText,
        {
          opacity: 0,
          scale: 0.8,
          duration: 1.5,
          ease: "power2.in",
        },
        "+=5"
      )
      // 2. CRITICAL FIX: Instantly remove it from the layout once invisible
      .set(birthdayText, { display: "none" })
      // 3. Fade in the final message, which is now guaranteed to be visible
      .to(
        finalMessage,
        {
          opacity: 1,
          duration: 2,
        },
        "-=0.5"
      ); // Overlap for a smooth transition

    // --- The rest of the animation continues as normal ---
    celebrateTl
      .to(celebrationScene, { opacity: 0, duration: 2 }, "+=6")
      .call(() => clearInterval(celebrationInterval))
      .set(celebrationScene, { display: "none" });

    celebrateTl
      .set(letterContainer, { display: "flex", pointerEvents: "auto" }, "+=0.5")
      .to(letterContainer, { opacity: 1, duration: 1.5 });
  }
  function shootCelebrationEffects() {
    // Create an initial burst of celebration elements
    for (let i = 0; i < 80; i++)
      createEffect("confetti-piece", 5 + Math.random() * 5);
    for (let i = 0; i < 15; i++) createEffect("balloon", 8 + Math.random() * 8);
  }

  function createEffect(className, duration) {
    const piece = document.createElement("div");
    piece.className = className;
    const colors = ["#d81b60", "#f48fb1", "#fdd835", "#81c784", "#64b5f6"];
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${duration}s`;
    confettiContainer.appendChild(piece);

    // Important for performance: remove the element after its animation is done.
    piece.addEventListener("animationend", () => {
      piece.remove();
    });
  }

  // --- 4. EXECUTION ---
  setInitialStates();

  const mainTimeline = gsap.timeline();

  mainTimeline.add(createIntroAnimation()).add(createCakeTransitionAnimation());

  flame.addEventListener("click", handleFlameClick, { once: true });
};
