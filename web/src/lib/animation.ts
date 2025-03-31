export function fadeIn(element: HTMLElement, duration: number = 300): void {
  element.style.opacity = "0";
  element.style.display = "block";

  requestAnimationFrame(() => {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = "1";
  });
}

export function fadeOut(element: HTMLElement, duration: number = 300): void {
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.style.opacity = "0";

  setTimeout(() => {
    element.style.display = "none";
  }, duration);
}

export function slideIn(
  element: HTMLElement,
  direction: "up" | "down" | "left" | "right" = "up",
  duration: number = 300
): void {
  const distance =
    direction === "up" || direction === "down"
      ? element.offsetHeight
      : element.offsetWidth;
  const startPosition =
    direction === "up" || direction === "left" ? -distance : distance;
  const endPosition = 0;

  element.style.transform = `translate${
    direction === "up" || direction === "down" ? "Y" : "X"
  }(${startPosition}px)`;
  element.style.opacity = "0";
  element.style.display = "block";

  requestAnimationFrame(() => {
    element.style.transition = `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;
    element.style.transform = `translate${
      direction === "up" || direction === "down" ? "Y" : "X"
    }(${endPosition}px)`;
    element.style.opacity = "1";
  });
}

export function slideOut(
  element: HTMLElement,
  direction: "up" | "down" | "left" | "right" = "up",
  duration: number = 300
): void {
  const distance =
    direction === "up" || direction === "down"
      ? element.offsetHeight
      : element.offsetWidth;
  const endPosition =
    direction === "up" || direction === "left" ? -distance : distance;

  element.style.transition = `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;
  element.style.transform = `translate${
    direction === "up" || direction === "down" ? "Y" : "X"
  }(${endPosition}px)`;
  element.style.opacity = "0";

  setTimeout(() => {
    element.style.display = "none";
  }, duration);
}

export function scaleIn(element: HTMLElement, duration: number = 300): void {
  element.style.transform = "scale(0.8)";
  element.style.opacity = "0";
  element.style.display = "block";

  requestAnimationFrame(() => {
    element.style.transition = `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;
    element.style.transform = "scale(1)";
    element.style.opacity = "1";
  });
}

export function scaleOut(element: HTMLElement, duration: number = 300): void {
  element.style.transition = `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;
  element.style.transform = "scale(0.8)";
  element.style.opacity = "0";

  setTimeout(() => {
    element.style.display = "none";
  }, duration);
}

export function rotateIn(element: HTMLElement, duration: number = 300): void {
  element.style.transform = "rotate(-180deg)";
  element.style.opacity = "0";
  element.style.display = "block";

  requestAnimationFrame(() => {
    element.style.transition = `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;
    element.style.transform = "rotate(0deg)";
    element.style.opacity = "1";
  });
}

export function rotateOut(element: HTMLElement, duration: number = 300): void {
  element.style.transition = `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;
  element.style.transform = "rotate(180deg)";
  element.style.opacity = "0";

  setTimeout(() => {
    element.style.display = "none";
  }, duration);
}

export function bounce(element: HTMLElement, duration: number = 300): void {
  element.style.transform = "scale(1)";
  element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;

  requestAnimationFrame(() => {
    element.style.transform = "scale(1.2)";
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, duration / 2);
  });
}

export function shake(element: HTMLElement, duration: number = 300): void {
  const keyframes = [
    { transform: "translateX(0)" },
    { transform: "translateX(-10px)" },
    { transform: "translateX(10px)" },
    { transform: "translateX(-10px)" },
    { transform: "translateX(10px)" },
    { transform: "translateX(-10px)" },
    { transform: "translateX(10px)" },
    { transform: "translateX(0)" },
  ];

  element.animate(keyframes, {
    duration,
    easing: "ease-in-out",
  });
}
