# Property Scout: Project Standards & Practices (v1.1.0)

This document contains the official policies and procedures for the Property Scout project. All code changes will be validated against these standards.

---

### **Principle of Proactive Intelligence (AIX)**
*This is our unique advantage. We integrate a powerful AI with a user interface. This is where we innovate.*

- **AIX-01: The Principle of Anticipation.** The application must not only answer the user's explicit question but also anticipate their *next logical question* and provide a clear path to its answer.
- **AIX-02: The Principle of Just-in-Time Context.** The AI must never present data without context. Every key number or verdict must be immediately followed by a concise, human-readable insight that answers "So what does this mean for me?".

---

### **Principle of Delightful Interaction (UIX)**
*This category moves our UI from merely "functional" to "delightful."*

- **UIX-01: The Principle of Meaningful Motion.** Animations must have a purpose beyond aesthetics. They must guide the user's attention, provide feedback on an action, or reveal information gracefully. Gratuitous, distracting animations are a violation.
- **UIX-02: The Principle of Tactile Feedback.** Interactive elements should provide subtle, satisfying visual or state feedback on hover, click, and focus. The application should feel "alive" and responsive to the user's presence.

---

### **UI & UX Policies**

- **ICON-01: No Emoticons.** All user-facing icons must be professional SVG components. Emoticons are prohibited.
- **UX-01: Interactive Tooltips.** All non-obvious interactive elements, charts, or data points must have an accompanying `InfoTooltip` or `Citation` component.
- **UX-02: Dynamic Loading States.** All data-loading states that may take more than a second must use an active, dynamic animation (e.g., "Live Data Feed") and never a static spinner.
- **UI-01: Theme Adherence.** All components must adhere to the "Futuristic Aurora" design system, including color palette, fonts, and layout principles.

---

### **Code Architecture Policies**

- **ARC-01: Type Safety.** The entire codebase must be strictly typed with TypeScript. `any` types are forbidden. `@ts-ignore` comments are considered technical debt and must be justified in a docket.
- **ARC-02: Centralized Services.** All external API calls or data persistence logic must be managed through a dedicated, centralized service in the `src/services/` directory. Components should not make direct API calls.
- **ARC-03: Code Commenting & Proactive Docketing.** Code should be clear and self-documenting. If a future task (refactor, feature, todo) is identified during development, it must be marked with a standardized comment (`// REFACTOR:`, `// TODO:`) and a suggested docket must be generated.
