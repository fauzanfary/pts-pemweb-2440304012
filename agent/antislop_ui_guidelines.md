# Antislop UI Guidelines for Agents

When generating or designing User Interfaces (UI), adhere strictly to these "antislop" principles. The goal is to create interfaces that are highly functional, fast, and devoid of unnecessary bloat.

## 1. Function Over Form
*   **Prioritize Clarity:** Every UI element must have a clear, immediate purpose. If an element does not help the user achieve their goal, remove it.
*   **No "Flash" for the Sake of Flash:** Avoid unnecessary animations, heavy gradients, or complex shadows unless they directly improve usability (e.g., loading states).

## 2. Minimalist Structure
*   **Information Density:** Balance whitespace with information. Do not clutter the screen, but do not make the user scroll endlessly for a single piece of data.
*   **Standardized Layouts:** Stick to predictable navigation patterns (e.g., top nav, sidebar). Do not reinvent the wheel for basic structural elements.

## 3. Performance & Accessibility First
*   **Semantic HTML:** Use standard HTML elements (`<button>`, `<nav>`, `<dialog>`) instead of custom `<div>` constructions whenever possible.
*   **Zero-Bloat CSS:** Use utility classes (like Tailwind) or minimal vanilla CSS. Avoid generating massive, highly specific CSS files for simple layouts.
*   **Contrast & Sizing:** Ensure text has high contrast and interactive elements (buttons, links) have appropriately sized click targets.

## 4. Text and Copy
*   **Direct Language:** Use concise, actionable text for buttons and labels (e.g., "Save" instead of "Click here to save your current progress").
*   **Avoid AI Verbosity:** Do not generate overly polite or conversational UI text unless explicitly requested for a specific persona.