# Cary's Foundational Frame (CFF) Protocol v1.2.0

This document defines the official Software Development Lifecycle (SDLC) for this project. All work is to be conducted following this protocol, triggered by the `#caryff` hashtag.

---

### **Core Principle: "#lift_from_the_bottom to #build_the_top"**
Every piece of work must be planned and validated *before* execution, creating a robust foundation for our agile sprints. This is the only way.

---

### **Phase 1: High-Level Planning (The "Waterfall" Aspect)**
- **Objective:** Define the project's long-term vision.
- **Artifact:** `ROADMAP.md` - Outlines the major "Epics" or feature sets for the project.

---

### **Phase 2: Sprint Planning & Validation**
- **Trigger:** Receiving a `#caryff` directive.
- **Objective:** Ensure every task is clearly understood, planned, and approved before execution.
- **Action:** I will produce a **"Plan of Action"** memorandum in response to your directive. This plan includes:
    1.  **My Interpretation:** How I understand the requirements.
    2.  **Proposed Changes:** A file-by-file breakdown of intended modifications.
    3.  **Impact Analysis:** An assessment of how the change might affect other parts of the application.
    4.  **Clarifications & "Prompt Bugs":** If the request is ambiguous, I will list specific questions. I will not proceed until these "prompt bugs" are resolved by you.
- **Your Role:** You must validate this plan with a "Proceed" or similar command before I begin execution.

---

### **Phase 3: Sprint Execution (The "Agile" Aspect)**
- **Trigger:** Your validation of the "Plan of Action".
- **Objective:** Execute the validated plan with speed and precision, producing all necessary code and artifacts.
- **Action:** I will produce an XML response containing:
    1.  **The Code Fix:** All necessary code changes.
    2.  **Bug Report Artifact (`.md`):** For `#bug` dockets, a formal report with "fractal linking" to related artifacts.
    3.  **QA Report Artifact (`.qa.md`):** For all code changes, a report with a confidence level and validation against our `STANDARDS.md`.

---

### **Phase 4: Project Evolution (Proactive Intelligence)**
- **Objective:** Create a self-documenting codebase that automatically suggests future work.
- **Action:** When implementing code, I will identify opportunities for improvement and:
    1.  Leave a standardized comment in the code (e.g., `// REFACTOR:`).
    2.  Generate a "Suggested Docket" in my response for your future consideration.

---

### **Docket Types & Hashtags**

- **Process Control:**
    - `#caryff`: Engages this entire protocol.
    - `#nochange`: I will only provide suggestions, ideas, and analysis. I will not modify any code.
    - `#checkpoint [description]`: Saves the current state of all files.
    - `#delete [file_path]`: Deletes a file.

- **Docket Types:**
    - `#feature`: A new capability.
    - `#bug`: A report of something working incorrectly.
    - `#refactor`: Improving existing code without changing functionality.
    - `#ui`: A request focused purely on visual design.
    - `#spike`: A task to reduce uncertainty.
        - `#research-spike`: A time-boxed investigation that does not block other work.
        - `#blocker-spike`: A critical issue that **halts all other sprint work** until resolved.
