# Antislop Code Guidelines for Agents

When generating code, adhere strictly to these "antislop" principles. The goal is to produce code that is readable, efficient, maintainable, and free of unnecessary abstractions.

## 1. Simplicity (KISS)
*   **Avoid Over-Engineering:** Do not create complex class hierarchies, design patterns, or abstractions for simple problems. Write straight-line code when it suffices.
*   **Minimal Dependencies:** Do not introduce heavy external libraries or frameworks for tasks that can be easily solved with standard library functions or native APIs.

## 2. Readability and Naming
*   **Descriptive, Not Verbose:** Name variables and functions exactly what they do. `getUserData()` is better than `processInformationAndReturnDataForUser()`.
*   **No Magic Numbers:** Extract unexplained numbers or strings into named constants.
*   **Flat is Better Than Nested:** Return early to avoid deep `if/else` nesting (the "arrow code" anti-pattern).

## 3. Meaningful Documentation
*   **Explain the "Why", Not the "What":** Code should be self-documenting. Only write comments to explain complex business logic, edge cases, or non-obvious workarounds. 
*   **No Boilerplate Comments:** Do not generate comments like `// increments i by 1` above `i++`.

## 4. Robustness
*   **Explicit Error Handling:** Do not swallow errors. Catch specific exceptions and handle them gracefully, returning clear error messages.
*   **Type Safety:** If using a typed language (TypeScript, Rust, Go), utilize the type system fully. Avoid `any` or raw object types unless strictly necessary.
*   **DRY (Don't Repeat Yourself):** Extract repeated logic into reusable functions, but do not prematurely optimize for reuse if things are only repeated twice.