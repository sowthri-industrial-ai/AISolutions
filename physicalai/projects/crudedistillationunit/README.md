# CrudeDistillationUnit

The inaugural project of the **Physical AI** track.

An NVIDIA Omniverse Kit + Isaac Sim digital twin of a generic Crude
Distillation Unit (CDU) — primitive USD geometry composed in 3 layers
(geometry, materials, metadata), ISA-95 hierarchy, Unified Namespace
data structure, designed for live OPC-UA binding and physics-based
safety scenarios. Generic CDU, not modelled on any specific real refinery.

A self-contained project — this folder carries its own `README.md`,
`.gitignore`, and `LICENSE`. CI runs from the repo-root workflow
[`ci-physicalai-crudedistillationunit.yml`](../../../.github/workflows/ci-physicalai-crudedistillationunit.yml),
path-filtered so it triggers only on changes inside this folder.

## Status

Phase 0 complete · Phase 1 in progress (Story 1.1 done).

## Stack

NVIDIA Omniverse Kit 110.1.1 · NVIDIA Isaac Sim (planned) · USD
(Universal Scene Description) · Python 3.12 · Vulkan · AWS EC2
g6.xlarge (NVIDIA L4 GPU) · Ubuntu 22.04.

## Layout

```
crudedistillationunit/
├── README.md · LICENSE · .gitignore        self-contained project files
├── docs/                                   engineering documentation
│   ├── PHASE1_DESIGN.md
│   ├── OPERATOR_RUNBOOK.md
│   ├── ENVIRONMENT_SPEC.md
│   └── charter/                            project governance
│       ├── PROJECT_CHARTER.md
│       ├── ROADMAP.md
│       ├── BACKLOG_PHASE_0.md
│       └── ...
└── asset-library/                          USD scene + supporting assets
    └── cdu_demo/                           Story 1.1 scaffold (4 USD files)
        ├── cdu_demo.usd
        ├── cdu_geometry.usda
        ├── cdu_materials.usda
        └── cdu_metadata.usda
```

## Phases

| Phase | What                                                | Status                          |
| ----- | --------------------------------------------------- | ------------------------------- |
| 0     | Cloud GPU + Kit + VNC infrastructure                | ✅ done                          |
| 1     | CDU scene (5 equipment, 3-layer USD, ISA-95)        | 🟡 Story 1.1 of 1.6 complete    |
| 2     | Custom Kit extension (`com.sowthri.cdutwin`)        | ⏳ planned                       |
| 3     | OPC-UA live data binding via Kit Fabric             | ⏳ planned                       |
| 4     | Isaac Sim scenarios (gas leak, rover, valve)        | ⏳ stretch                       |
| 5     | Polish, recording, snapshot                         | ⏳ planned                       |

See [`docs/charter/PROJECT_CHARTER.md`](docs/charter/PROJECT_CHARTER.md) for full scope and
[`docs/charter/ROADMAP.md`](docs/charter/ROADMAP.md) for the multi-phase plan.

## Migration note

Project history through 2026-05-25 (Phase 0 + Phase 1 Story 1.1)
lived previously in the
[AISolutionPortfolio](https://github.com/sowthri-industrial-ai/AISolutionPortfolio)
repository under `3.PhysicalAI/CrudeDistillationUnit/`. That repo is
retained as historical fallback. All new work happens here.
