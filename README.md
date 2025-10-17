# Property Scout AI

**Property Scout AI** is a sophisticated, AI-powered web application designed to provide a comprehensive, data-driven analysis of real estate investment opportunities. By leveraging Google's Gemini API with search grounding, it gives users an instant verdict on whether a property is a "Good Deal," "Borderline," or a "Bad Deal."

This project is not only a functional application but also a demonstration of a world-class, simulated software development lifecycle, managed by an AI, following the principles of **Cary's Foundational Frame (CFF)**.

---

## Key Features

- **AI-Powered Analysis:** Get a detailed report covering market trends, affordability, ownership costs, location scores, and more.
- **Data-Driven Verdict:** The AI provides a clear, concise verdict with a list of pros and cons for each property.
- **Interactive Experience:** The UI is built with our "Principles of Delightful Interaction," featuring meaningful animations and tactile feedback.
- **User Personalization:** Logged-in users can save their analyses to a personal dashboard, view their history, and compare properties side-by-side.
- **Resilient Architecture:** The application features a "Dual-Mode" backend, allowing it to function seamlessly in a live, cloud-connected mode or a fully offline simulation mode.

---

## How to Run (Simulated)

This project is designed to run in a sandboxed web environment.

1.  **Dependencies:** All dependencies are loaded via script tags in `index.html`. No `npm install` is required.
2.  **API Keys:** The application requires API keys for Google Gemini and Firebase.
    - The **Gemini API Key** should be set as an environment variable (`process.env.API_KEY`).
    - The **Firebase Credentials** should be placed in `src/firebaseConfig.ts`.
3.  **Running in Simulation Mode:** If either API key is missing or invalid, the application will automatically start in "Simulation Mode," using mock data and `localStorage`. It will remain 100% functional.
4.  **Launch:** Open `index.html` in a modern web browser.

---

## Our Development Process: Cary's Foundational Frame (CFF)

This project is built following a rigorous, simulated software development lifecycle called **Cary's Foundational Frame (CFF)**. This process, defined in `dockets/CFF_PROTOCOL.md`, ensures that every piece of work is planned, validated, and documented to the highest professional standard.

- **Our Core Principle:** "#lift_from_the_bottom to #build_the_top." We ensure our foundation is unshakeably solid before building upon it.
- **Artifacts:** Every change is accompanied by formal artifacts, including bug reports and QA reports, which are stored in the `dockets/` directory.
- **Standards:** All code is held accountable to the high standards of excellence defined in `dockets/STANDARDS.md`.

This disciplined approach is how we achieve a "#100s" state of quality.
