// lib/agent-reaction-data.ts
// Periodic-table data for the Agent Reaction tab — three element tables
// (anatomy / roles / knowledge) plus per-project reaction profiles.
//
// Lifted verbatim from the CD bundle's src/agent-reaction-data.jsx and
// typed for TypeScript. The element ordering matters: atomic numbers are
// 1-indexed across each table in row order, and the Compositions Matrix
// 1 birth grid keys off the row labels here.

export interface Element {
  /** 2-letter abbreviation (e.g. "An" for Analyst). */
  c: string;
  /** Full name shown below the abbreviation in the cell. */
  n: string;
  /** Atomic number — added by withNumbers(). */
  num: number;
}

export interface ElementRow {
  /** Row name — also referenced by `birthAnatomy` and Matrix 1 axes. */
  row: string;
  desc: string;
  elements: Omit<Element, "num">[];
}

export interface NumberedRow extends Omit<ElementRow, "elements"> {
  elements: Element[];
}

// -------- TABLE 1: AGENT ANATOMY (what's inside each agent) --------
const T1: ElementRow[] = [
  { row: "Perception",       desc: "How agent parses input.", elements: [
    { c: "Vi", n: "Vision" }, { c: "Au", n: "Audio" }, { c: "Tx", n: "Text" },
    { c: "Mm", n: "Multimodal" }, { c: "Pf", n: "Parsed Files" },
    { c: "Sj", n: "Structured-input" }, { c: "Es", n: "Event Stream" },
  ]},
  { row: "Reasoning",        desc: "How agent thinks.", elements: [
    { c: "Co", n: "Chain-of-Thought" }, { c: "Ra", n: "ReAct" },
    { c: "Rf", n: "Reflexion" }, { c: "To", n: "Tree-of-Thought" },
    { c: "Sd", n: "Self-Discover" }, { c: "Sc", n: "Self-Critique" },
  ]},
  { row: "Planning",         desc: "How agent decomposes goals.", elements: [
    { c: "Dc", n: "Decomposition" }, { c: "Hn", n: "HTN" },
    { c: "Ps", n: "Plan-and-Solve" }, { c: "La", n: "LATS" }, { c: "Gs", n: "Goal-Seek" },
  ]},
  { row: "Memory",           desc: "What agent remembers.", elements: [
    { c: "Sh", n: "Short-term" }, { c: "Lt", n: "Long-term" },
    { c: "Ep", n: "Episodic" }, { c: "Se", n: "Semantic" }, { c: "Wk", n: "Working" },
  ]},
  { row: "Retrieval",        desc: "How agent fetches info.", elements: [
    { c: "Vc", n: "Vector" }, { c: "Gr", n: "Graph" },
    { c: "Sq", n: "SQL" }, { c: "Wb", n: "Web" }, { c: "Hy", n: "Hybrid" },
  ]},
  { row: "Tools",            desc: "What agent acts with.", elements: [
    { c: "Fn", n: "Function-call" }, { c: "Ap", n: "API" },
    { c: "Cd", n: "Code-exec" }, { c: "Mc", n: "MCP" }, { c: "Re", n: "REST" },
  ]},
  { row: "Output",           desc: "How agent shapes response.", elements: [
    { c: "Ff", n: "Free-form" }, { c: "Js", n: "JSON-schema" },
    { c: "Sr", n: "Structured" }, { c: "Sm", n: "Streaming" },
    { c: "Fc", n: "Function-call-output" },
  ]},
  { row: "Communication",    desc: "How agents talk to each other.", elements: [
    { c: "Mp", n: "Message Passing" }, { c: "Pb", n: "Pub/Sub" },
    { c: "Bc", n: "Broadcast" }, { c: "Da", n: "Direct A2A" },
    { c: "Bb", n: "Blackboard" }, { c: "Rp", n: "RPC" },
  ]},
  { row: "Identity",         desc: "How agent is defined.", elements: [
    { c: "Sp", n: "System Prompt" }, { c: "Pn", n: "Persona" },
    { c: "Ro", n: "Role" }, { c: "Cc", n: "Capability Card" },
    { c: "Gl", n: "Goal" }, { c: "Bs", n: "Backstory" },
    { c: "Bh", n: "Behavior-Rules" },
  ]},
  { row: "Self-improvement", desc: "How agent learns.", elements: [
    { c: "Ic", n: "In-Context" }, { c: "Fs", n: "Few-shot" },
    { c: "Rt", n: "RAG-tune" }, { c: "Ft", n: "Fine-tune" },
    { c: "Dp", n: "DPO" }, { c: "Rh", n: "RLHF" }, { c: "Cl", n: "Critique-Loop" },
  ]},
  { row: "Guardrails",       desc: "How agent stays safe.", elements: [
    { c: "Fl", n: "Filter" }, { c: "Vl", n: "Validator" },
    { c: "Sb", n: "Sandbox" }, { c: "Rl", n: "Rate-limit" },
    { c: "Ha", n: "Human Approval" }, { c: "Cs", n: "Constitution" },
  ]},
];

// -------- TABLE 2: AGENT ROLES (what functional category) --------
const T2: ElementRow[] = [
  { row: "Information",  desc: "Gather and process info.", elements: [
    { c: "Re", n: "Researcher" }, { c: "An", n: "Analyst" },
    { c: "Ex", n: "Extractor" }, { c: "Sm", n: "Summarizer" },
    { c: "Cl", n: "Classifier" }, { c: "In", n: "Investigator" },
    { c: "Fr", n: "Forecaster" }, { c: "Ag", n: "Aggregator" },
    { c: "Cu", n: "Curator" }, { c: "Ob", n: "Observer" },
    { c: "Rk", n: "Ranker" },
  ]},
  { row: "Production",   desc: "Create outputs.", elements: [
    { c: "Wr", n: "Writer" }, { c: "Cd", n: "Coder" },
    { c: "De", n: "Designer" }, { c: "Cm", n: "Composer" },
    { c: "Tl", n: "Translator" }, { c: "Gn", n: "Generator" },
    { c: "Ed", n: "Editor" }, { c: "Ah", n: "Architect" },
    { c: "Mo", n: "Modeler" },
  ]},
  { row: "Review",       desc: "Verify quality.", elements: [
    { c: "Cr", n: "Critic" }, { c: "Rv", n: "Reviewer" },
    { c: "Ts", n: "Tester" }, { c: "Au", n: "Auditor" },
    { c: "Ap", n: "Approver" }, { c: "Cp", n: "Compliance" },
    { c: "Jd", n: "Judge" }, { c: "Vf", n: "Verifier" },
  ]},
  { row: "Coordination", desc: "Manage other agents.", elements: [
    { c: "Pl", n: "Planner" }, { c: "Or", n: "Orchestrator" },
    { c: "Pm", n: "Project Manager" }, { c: "Rt", n: "Router" },
    { c: "Mi", n: "Mediator" }, { c: "Dp", n: "Dispatcher" },
    { c: "Sg", n: "Strategist" }, { c: "Sv", n: "Supervisor" },
    { c: "Br", n: "Broker" }, { c: "Ar", n: "Arbiter" },
  ]},
  { row: "Operation",    desc: "Execute and monitor.", elements: [
    { c: "Eu", n: "Executor" }, { c: "Wk", n: "Worker" },
    { c: "Mn", n: "Monitor" }, { c: "Sc", n: "Scheduler" },
    { c: "Rp", n: "Reporter" }, { c: "Lo", n: "Logger" },
    { c: "Cn", n: "Cleaner" }, { c: "Dy", n: "Deployer" },
    { c: "Mt", n: "Maintainer" }, { c: "Hg", n: "Healer" },
  ]},
  { row: "Interface",    desc: "Interact with humans.", elements: [
    { c: "As", n: "Assistant" }, { c: "Cs", n: "Customer Support" },
    { c: "Sa", n: "Sales" }, { c: "Cv", n: "Conversational" },
    { c: "Ng", n: "Negotiator" }, { c: "Fa", n: "Facilitator" },
    { c: "Tt", n: "Tutor" }, { c: "Mr", n: "Moderator" },
    { c: "Ch", n: "Coach" }, { c: "Gr", n: "Greeter" },
    { c: "Ad", n: "Advisor" },
  ]},
  { row: "Meta",         desc: "Work on the system itself.", elements: [
    { c: "Tn", n: "Trainer" }, { c: "Tu", n: "Tuner" },
    { c: "Dg", n: "Diagnostic" }, { c: "Op", n: "Optimizer" },
    { c: "Bn", n: "Benchmarker" }, { c: "Db", n: "Debugger" },
    { c: "Pf", n: "Profiler" }, { c: "Tr", n: "Tracer" },
    { c: "Ds", n: "Distiller" },
  ]},
];

// -------- TABLE 3: KNOWLEDGE (what sources agents draw on) --------
const T3: ElementRow[] = [
  { row: "Foundation Models",  desc: "Parametric general knowledge.", elements: [
    { c: "Ft", n: "Frontier-tier" }, { c: "Mt", n: "Mid-tier" },
    { c: "Lt", n: "Lightweight" }, { c: "Mo", n: "Multi-modal" },
    { c: "Rs", n: "Reasoning-spec" }, { c: "Co", n: "Code-spec" },
    { c: "Lo", n: "Long-context" },
  ]},
  { row: "Specialized Models", desc: "Parametric narrow knowledge.", elements: [
    { c: "Dt", n: "Domain-tuned" }, { c: "It", n: "Instruction-tuned" },
    { c: "Ds", n: "Distilled" }, { c: "Mx", n: "Mixture-of-Experts" },
    { c: "Em", n: "Embedding" }, { c: "Re", n: "Reranker" },
    { c: "Cl", n: "Classifier" },
  ]},
  { row: "Document Corpora",   desc: "Non-parametric text.", elements: [
    { c: "Mn", n: "Manuals" }, { c: "St", n: "Standards" },
    { c: "Pl", n: "Policies" }, { c: "Pp", n: "Papers" },
    { c: "Ar", n: "Archives" }, { c: "Wb", n: "Web Pages" },
    { c: "Tx", n: "Text Snippets" },
  ]},
  { row: "Structured Data",    desc: "Non-parametric structured.", elements: [
    { c: "Sq", n: "SQL Tables" }, { c: "Kg", n: "Knowledge Graphs" },
    { c: "Td", n: "Time-series" }, { c: "Lg", n: "Logs" },
    { c: "Tl", n: "Tabular Files" }, { c: "On", n: "Ontologies" },
  ]},
  { row: "Real-time Feeds",    desc: "Live data at inference.", elements: [
    { c: "Ap", n: "API Feeds" }, { c: "Es", n: "Event Streams" },
    { c: "Mq", n: "Message Queues" }, { c: "Wh", n: "Webhooks" },
    { c: "Sk", n: "Sockets" },
  ]},
];

/** Compute atomic numbers — 1-indexed across each table, row-major. */
function withNumbers(table: ElementRow[]): NumberedRow[] {
  let n = 1;
  return table.map((r) => ({
    ...r,
    elements: r.elements.map((e) => ({ ...e, num: n++ })),
  }));
}

export const T1N: NumberedRow[] = withNumbers(T1);
export const T2N: NumberedRow[] = withNumbers(T2);
export const T3N: NumberedRow[] = withNumbers(T3);

// -------- AGENT REACTION DATA — per-project --------

export interface Compound {
  name: string;
  /** 2-letter T2 role code (e.g. "Pl" for Planner). */
  baseRole: string;
  /** T1 row label where this compound is born in Matrix 1. */
  birthAnatomy: string;
  /** T1 element codes contributed by this compound. */
  anatomy: string[];
  /** T3 element codes this compound bonds with. */
  knowledge: string[];
}

export interface ReactionEdge {
  from: string;
  to: string;
}

export interface SequenceStep {
  step: number;
  phase: string;
  from: string;
  to: string;
  message: string;
}

export interface ReactionPhase {
  id: string;
  label: string;
  steps: number[];
  duration?: string;
}

export interface AgentReaction {
  table1Lit: string[];
  table2Lit: string[];
  table3Lit: string[];
  compounds: Compound[];
  edges: ReactionEdge[];
  scenario?: string;
  phases?: ReactionPhase[];
  totalDuration?: string;
  baselineNote?: string;
  sequence: SequenceStep[];
  resultNarrative: string;
}

const AGENT_REACTIONS: Record<string, AgentReaction> = {
  "supply-chain-copilot": {
    table1Lit: [
      "Tx", "Pf", "Sj",
      "Ra", "Rf", "Sc",
      "Ps", "Dc",
      "Sh",
      "Vc", "Sq", "Hy",
      "Fn",
      "Sr",
      "Mp", "Bb",
      "Sp", "Ro", "Gl",
      "Ic", "Fs",
      "Vl", "Ha",
    ],
    table2Lit: [
      "An", "Re", "Fr",
      "Cr", "Ap",
      "Pl",
    ],
    table3Lit: [
      "Ft", "Rs",
      "Em", "Re",
      "Mn", "Pl",
      "Sq", "Td",
      "Ap",
    ],
    compounds: [
      { name: "Inventory Analyst",    baseRole: "An", birthAnatomy: "Retrieval",
        anatomy: ["Tx", "Sj", "Ra", "Sh", "Vc", "Sq", "Fn", "Sr", "Mp", "Bb", "Sp", "Ro", "Gl", "Ic", "Vl"],
        knowledge: ["Sq", "Td"] },
      { name: "Supplier Researcher",  baseRole: "Re", birthAnatomy: "Perception",
        anatomy: ["Tx", "Pf", "Ra", "Sh", "Vc", "Hy", "Fn", "Sr", "Mp", "Bb", "Sp", "Ro", "Gl", "Ic", "Vl"],
        knowledge: ["Mn", "Ap"] },
      { name: "Lead-time Forecaster", baseRole: "Fr", birthAnatomy: "Memory",
        anatomy: ["Sj", "Ra", "Sh", "Sq", "Fn", "Sr", "Mp", "Sp", "Ro", "Gl", "Ic", "Vl"],
        knowledge: ["Td", "Em"] },
      { name: "Procurement Planner",  baseRole: "Pl", birthAnatomy: "Planning",
        anatomy: ["Tx", "Ra", "Rf", "Sc", "Ps", "Dc", "Sh", "Fn", "Sr", "Mp", "Bb", "Sp", "Ro", "Gl", "Ic", "Fs", "Vl", "Ha"],
        knowledge: ["Pl", "Ft"] },
      { name: "Decision Critic",      baseRole: "Cr", birthAnatomy: "Reasoning",
        anatomy: ["Rf", "Sc", "Sh", "Sr", "Mp", "Sp", "Ro", "Gl", "Vl"],
        knowledge: ["Rs"] },
      { name: "Order Approver",       baseRole: "Ap", birthAnatomy: "Guardrails",
        anatomy: ["Tx", "Sp", "Ro", "Gl", "Vl", "Ha"],
        knowledge: ["Pl"] },
    ],
    edges: [
      { from: "Procurement Planner",  to: "Inventory Analyst" },
      { from: "Inventory Analyst",    to: "Procurement Planner" },
      { from: "Procurement Planner",  to: "Supplier Researcher" },
      { from: "Supplier Researcher",  to: "Procurement Planner" },
      { from: "Procurement Planner",  to: "Lead-time Forecaster" },
      { from: "Lead-time Forecaster", to: "Procurement Planner" },
      { from: "Procurement Planner",  to: "Decision Critic" },
      { from: "Decision Critic",      to: "Procurement Planner" },
      { from: "Procurement Planner",  to: "Order Approver" },
      { from: "Order Approver",       to: "Procurement Planner" },
      { from: "Order Approver",       to: "human" },
    ],
    scenario:
      "Canonical run: a supplier delays SKU-4421-B by two weeks. Inventory cover is 14 days. What does the system do?",
    phases: [
      { id: "discovery", label: "Discovery", steps: [1, 2], duration: "~ 2 min" },
      { id: "decision",  label: "Decision",  steps: [3, 4], duration: "~ 6 min" },
      { id: "approval",  label: "Approval",  steps: [5, 6], duration: "~ 3 min" },
    ],
    totalDuration: "11 min total",
    baselineNote: "vs. 4 hr buyer baseline",
    sequence: [
      // Phase 1 — parallel fan-out at step 1
      { step: 1, phase: "discovery", from: "Procurement Planner",  to: "Inventory Analyst",    message: "query burn rate" },
      { step: 1, phase: "discovery", from: "Procurement Planner",  to: "Supplier Researcher",  message: "find alternatives" },
      { step: 1, phase: "discovery", from: "Procurement Planner",  to: "Lead-time Forecaster", message: "forecast for B" },
      // Phase 1 — parallel fan-in at step 2
      { step: 2, phase: "discovery", from: "Inventory Analyst",    to: "Procurement Planner",  message: "14 days cover" },
      { step: 2, phase: "discovery", from: "Supplier Researcher",  to: "Procurement Planner",  message: "Supplier B, +12% cost" },
      { step: 2, phase: "discovery", from: "Lead-time Forecaster", to: "Procurement Planner",  message: "5 days, 92% conf" },
      // Phase 2 — sequential
      { step: 3, phase: "decision",  from: "Procurement Planner",  to: "Decision Critic",      message: "draft recommendation" },
      { step: 4, phase: "decision",  from: "Decision Critic",      to: "Procurement Planner",  message: "verdict: ship w/ caveat" },
      // Phase 3 — sequential
      { step: 5, phase: "approval",  from: "Procurement Planner",  to: "Order Approver",       message: "split order proposal" },
      { step: 6, phase: "approval",  from: "Order Approver",       to: "human",                message: "approval required" },
    ],
    resultNarrative:
      "A six-agent procurement system. A Procurement Planner decomposes the buyer's intent and routes parallel queries to three information agents — an Inventory Analyst, a Supplier Researcher, and a Lead-time Forecaster — each grounded in its own knowledge corpus. Their responses are synthesized into a draft recommendation, adversarially critiqued, then surfaced to a human Order Approver for the final go/no-go. The reaction produces a split-order recommendation in eleven minutes, against a four-hour buyer baseline, with hallucinated-SKU rates held below 2.3%.",
  },
};

export function getAgentReaction(projectId: string): AgentReaction | null {
  return AGENT_REACTIONS[projectId] ?? null;
}

/** Look up an element by code anywhere in a numbered table. */
export function findInTable(
  table: NumberedRow[],
  code: string,
): { row: NumberedRow; element: Element } | null {
  for (const r of table) {
    const el = r.elements.find((e) => e.c === code);
    if (el) return { row: r, element: el };
  }
  return null;
}

/** Row index of the first row containing `code`, or -1 if not found. */
export function rowIndexOfCode(table: NumberedRow[], code: string): number {
  for (let i = 0; i < table.length; i++) {
    if (table[i].elements.some((e) => e.c === code)) return i;
  }
  return -1;
}
