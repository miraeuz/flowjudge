# Curriculum scope and validation

15 topics in order: Output; Variables/Assign; Input; Integer/Real/div/mod; If; If-Else; logic; For; nested For; While; Do-While; arrays; searching/sorting; functions; mini-projects.

Every topic has 20 classwork and 30 homework entries, bilingual lesson text, input/output descriptions, two example slots, hidden checks and hints where supplied. The first five original Input problems retain their IDs and semantics for saved progress compatibility.

The new material is generated from five practice families per topic with ten context/parameter variants per family. Classwork uses the first two families; homework uses the remaining three. Several families intentionally repeat a skill with different scenarios or thresholds. This is a complete-count **practice bank**, not 750 independently designed algorithms or a finished textbook. Difficulty labels indicate position within the practice sequence and need teacher calibration.

`tools/build-curriculum.py` deterministically creates JSON and `.fprg` reference solutions. Expected results are calculated by Python logic, separately from the JavaScript interpreter. `tests/curriculum.mjs` runs all 750 references, rejects a deliberately wrong output version of each, verifies bilingual fields, unique IDs, examples and section counts.

Fixed-output and fixed-variable exercises cannot meaningfully vary input: their example/test inputs repeat, intentionally. They teach Output/Assign rather than hidden-input generalization. Structural rules require specified blocks, but cannot prove that a required block contributes to the answer.

No teacher worksheet collection was provided in this session; no claim is made to have incorporated the mentioned 19 worksheets. Uzbek text has not received independent native-speaker editorial review. Before using the bank for assessment, review wording, difficulty and the semantic subset against the Flowgorithm version used in class.

The reference files are teacher/developer material in this public repository. They are not packaged in the student app; they are still publicly accessible from the repository. This release is for practice, not secure examinations.
