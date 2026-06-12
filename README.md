# ALPHA TERMINAL (Layer 8 Analyst Agent)
> **The world's first autonomous entity engine for graph intelligence.**

---

![Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)

## THE MENTAL MODEL
ALPHA TERMINAL is not a traditional analytics platform. It is an **Autonomous Identity Resolver** that operates on a 3-layer cognitive architecture:

1.  **THE GROUPING MACHINE**: An entity resolution engine that performs Union-Find across billions of wallet-to-project edges.
2.  **THE ID REGISTRY**: A deterministic source of truth for sanctioned actors and high-value whales.
3.  **THE STRICTNESS KNOB**: An adaptive threshold controller that uses Lyapunov-based stability layers to adjust intelligence sensitivity in real-time.

---

## ARCHITECTURE
```text
[ INGEST ] -> [ NEO4J GRAPH ] -> [ UNION-FIND CLUSTERER ]
                                       |
                                       v
[ STABILITY LAYER ] <----------- [ ADAPTIVE CONTROLLER ]
      |                                |
  [ ESTIMATOR ]                        |
      |                                v
  [ OPTIMIZER ] ----------> [ REPORTING ENGINE (GEMINI) ]
                                       |
                                       v
                        [ INTELLIGENCE CERTIFICATE (AAA) ]
```

---

## STABILITY CONTROL LAYER (PHASE 1B)
To prevent intelligence drift and ensure high-integrity outputs, ALPHA TERMINAL implements a closed-loop stability controller based on control theory.

### THE LYAPUNOV ENERGY FUNCTION
We formalize stability by minimizing the energy candidate $V(x)$:
$$V(x) = \frac{1}{2}(1 - C)^2 + \frac{\lambda}{T}$$
Where:
-   **C**: Confidence score of the current cluster resolution.
-   **λ**: Latency friction coefficient.
-   **T**: Intelligence periodicity.

### CERTIFICATE OUTPUT
Every generated report includes an **Intelligence Certificate** for audit trails:
```json
{
  "energy_score": 0.9842,
  "compliance_rating": "AAA",
  "signatures": ["STABILITY_ENGINE_L8", "VAL_SIG_0x4A..."]
}
```

---

## STABILITY MODULE (server/stability/)
| File | Functional Role |
|------|-----------------|
| `estimator.ts` | Calculates real-time Lyapunov energy metrics for the current cluster. |
| `drift-detector.ts` | Tracks semantic and threshold deviation over a sliding window. |
| `optimizer.ts` | Solves for optimal control parameters to keep the engine in a stable manifold. |
| `adaptive-control.ts` | The core controller orchestrating the closed-loop logic. |
| `entropy.ts` | Measures multi-signal information entropy in intelligence outputs. |
| `certificate.ts` | Generates audit-ready signed certificates for intelligence reports. |
| `types.ts` | Strictly-typed interfaces for the control plane variables. |

---

## API REFERENCE

### `POST /api/report/generate`
Generates a targeted intelligence report for a specific cluster.
```bash
curl -X POST /api/report/generate \
  -H "Content-Type: application/json" \
  -d '{"clusterId": "CX-0912", "type": "narrative"}'
```

### `GET /api/report/brief`
Generates a top-level Smart Money Brief summarizing cross-cluster activity.

---

## ROADMAP

### PHASE 1A: FOUNDATIONS [✓]
- [x] Hierarchical clustering (Union-Find)
- [x] Multi-source graph ingest (Neo4j)
- [x] Intelligence narratives (Claude/Gemini)

### PHASE 1B: STABILITY [✓]
- [x] Lyapunov energy estimator
- [x] Adaptive threshold controller
- [x] Multi-signal entropy engine
- [x] Intelligence certificates (AAA-B)

### PHASE 2A: PRODUCTION SCALE [ ]
- [ ] Adaptive threshold controller v2
- [ ] Fed-ready compliance export
- [ ] Real-time Kafka streaming ingest

### PHASE 2B: AUTONOMOUS OPTIMIZATION [ ]
- [ ] Lyapunov formal proof (30-day telemetry required)
- [ ] Multi-signal entropy refinement
- [ ] RAG integration for legacy case files

---

## MARKET POSITIONING
| STAGE | MILESTONE | VALUATION TRAJECTORY | DIFFERENTIATOR |
|-------|-----------|----------------------|----------------|
| Seed  | Phase 1B  | $15M - $25M          | Autonomous Stability Layer |
| Ser A | Phase 2B  | $120M - $200M        | Deterministic ID Registry |
| Ser C | Phase 4   | $1B+                 | Full Network Sovereign AI |

---

## IP NOTICE
This codebase includes provisional patent candidates for:
1.  **Probabilistic Blockchain Identity Resolution** using Union-Find.
2.  **Lyapunov Stability for AI Intelligence Pipelines**.

*Review Gate: Cortez Bryant (Lead Legal Review)*
