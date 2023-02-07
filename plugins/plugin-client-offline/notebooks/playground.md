---
layout:
    1: 
        position: default
        maximized: true
    2:
        position: default
        maximized: true
---

=== "YAML Specification"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send pg1 -f /kui/client/playground/runafter.yaml
    ```

---

=== "Flow View"
    ```bash
    ---
    execute: now
    outputOnly: true
    maximize: true
    ---
    tekton playground pg1
    ```

