// https://chatgpt.com/share/66f1ed89-a824-800e-b29b-f64e80654f1d
export function scrollToChild(parent: HTMLElement, child: HTMLElement) {
  // Get the bounding rectangles for parent and child
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  // Calculate the child’s position relative to the parent
  const relativeTop = childRect.top - parentRect.top;

  // Calculate the vertical center of the parent and child
  const parentCenter = parent.clientHeight / 2;
  const childCenter = childRect.height / 2;

  // Scroll the parent to bring the child into the center
  parent.scrollTo({
    top: parent.scrollTop + relativeTop - parentCenter + childCenter,
    behavior: "smooth", // Enable smooth scrolling
  });
}
