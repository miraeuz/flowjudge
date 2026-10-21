## Flowgorithm Academy 0.3.0

The learning workspace keeps the Mirae violet design and adds tools for understanding, revisiting and continuing exercises.

- **Four-stage learning map:** Foundations, Decisions, Repetition and Build, with stage totals and a recommended next topic. All topics remain freely accessible.
- **Flowchart preview:** the Feedback/Flowchart tabs display the block structure of the student's latest uploaded `.fprg`, including decisions, loop bodies and functions. Preview rendering is bounded, does not execute the file and escapes all source text. It does not replicate Flowgorithm's exact drawing layout or animate execution.
- **Save for later:** bookmark exercises, filter saved tasks and keep bookmarks across restarts.
- **Needs another attempt:** filter exercises whose latest recorded attempt failed and which have not previously been solved. Home shows a shortcut when this list has items.
- **Focus view:** hide the sidebar while solving; Escape exits focus mode.
- **Exercise navigation:** previous/next controls and a next-exercise button after acceptance. Returning from a homework exercise retains the homework section.
- **Resume learning:** continue the last opened unsolved exercise; otherwise start the first unsolved exercise.
- **Helpful feedback:** Uzbek/English next-step guidance for wrong answers, runtime errors, invalid files and time limits.
- **Keyboard fix:** Skip to content now focuses the main region without navigating away from the exercise.

Existing content, exercise IDs, progress files, activation and judging behavior are unchanged. Bookmarks and last-opened exercise are stored in local browser storage; they are not part of the JSON progress backup. Uploaded source is kept only in memory for the most recent preview and is cleared when the app closes.

Validation includes the existing judge/curriculum suite and renderer smoke coverage for bookmarks across reload, retry filtering, focus/Escape, previous/next navigation, preview escaping/bounds, stage cards, language switching and responsive layouts. Renderer smoke tests use a mock IPC bridge; test the actual Windows installation on a classroom PC.

The existing Telegram configuration remains embedded in the installer as previously approved. A hosted activation relay is still the recommended next security improvement.
