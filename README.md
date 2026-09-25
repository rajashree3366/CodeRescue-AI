# CodeRescue-AI
AI-powered developer handoff and codebase rescue using IBM Bob.
# CodeRescue AI 🚑

### Rescue the code. Recover the knowledge.

CodeRescue AI is an AI-assisted developer handoff and legacy codebase rescue platform designed to help teams understand unfamiliar or abandoned codebases.

It analyzes a project structure, maps important modules and dependencies, identifies documentation and testing gaps, and uses **IBM Bob** as the rescue engineering assistant to investigate, document, test, validate, and review the codebase.

---

## 🚨 The Problem

When the original developer leaves a project, teams can inherit a codebase with:

* Little or outdated documentation
* Unknown architecture and dependencies
* Missing test coverage
* Undocumented business logic
* Risky modules that are difficult to modify
* High onboarding time for new developers

The biggest problem isn't just the code.

**It's the knowledge that disappeared with the developer.**

---

## 💡 Our Solution

**CodeRescue AI** converts an unfamiliar codebase into a structured developer handoff.

The platform follows a rescue workflow:

```text
Codebase
   ↓
Repository Scan
   ↓
Developer Rescue Map
   ↓
Risk Analysis
   ↓
Start Here / Onboarding
   ↓
IBM Bob Rescue
   ↓
Documentation + Tests
   ↓
Validation & Review
   ↓
Rescue Report
```

The goal is to transform:

> **Unknown code → Understandable architecture → Transferable knowledge**

---

## 🤖 IBM Bob Integration

IBM Bob acts as the AI coding assistant inside the rescue workflow.

Bob is used to assist with:

* Repository investigation
* Architecture understanding
* Dependency analysis
* Risk investigation
* Documentation generation
* Test generation
* Validation
* Consistency and regression review

The prototype represents Bob's rescue process through a phased workflow:

```text
Understand
     ↓
Investigate
     ↓
Document
     ↓
Test
     ↓
Validate
     ↓
Review
```

Multiple investigation agents are represented for different areas such as authentication, payments, database dependencies, and testing gaps.

---

## ✨ Key Features

### 1. Repository Rescue Scan

The system performs a structured scan to identify:

* Project structure
* Languages
* Frameworks
* Dependencies
* Entry points
* API routes
* Database layer
* Authentication flow
* Critical modules
* Documentation gaps
* Testing gaps

### 2. Developer Rescue Map

The architecture is visualized as an interactive dependency graph.

Developers can select modules to inspect:

* Responsibility
* Dependencies
* Files
* Functions
* Risk level
* Documentation status
* Test status

### 3. Risk Analysis

Potential problems are grouped by severity:

* Critical
* High
* Medium
* Informational

Each finding contains evidence, impact, and a recommended action.

### 4. Start Here

Instead of forcing a new developer to read hundreds of files randomly, CodeRescue AI creates an onboarding order based on module dependency centrality.

This helps answer:

> **"What should I understand first?"**

### 5. Bob Rescue Center

The Bob Rescue Center visualizes the AI-assisted rescue process.

It shows:

* Rescue planning
* Investigation
* Sub-agent activity
* Documentation generation
* Test generation
* Test execution
* Validation
* Final review

### 6. Automatic Documentation

The rescue workflow produces documentation such as:

```text
architecture.md
authentication.md
payment-flow.md
database.md
onboarding-guide.md
```

### 7. Test Generation

High-value missing tests are identified and represented in the rescue workflow, including:

```text
payment.failure.test.js
orders.integration.test.js
auth.expiry.test.js
database.error.test.js
```

### 8. Rescue Report

The final report brings together the findings, risks, documentation, testing work, and validation results into a developer handoff.

### 9. Before / After View

The final screen communicates the transformation:

```text
BEFORE
Unknown code
Missing documentation
Testing gaps
High onboarding friction

             ↓

AFTER
Mapped architecture
Recovered knowledge
Generated documentation
Additional tests
Validated developer handoff
```

---

## 🧪 Demo Project

The prototype currently uses a seeded demonstration repository called:

**ShopSphere Legacy**

It represents a small e-commerce application containing:

* Frontend
* Authentication
* Product Service
* Cart
* Payment Service
* Order Service
* Database

The demo contains intentionally seeded documentation, testing, dependency, and maintainability issues so the complete rescue workflow can be demonstrated.

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* SVG-based architecture visualization
* IBM Plex Sans
* IBM Plex Mono

### AI / Developer Assistance

* IBM Bob
* AI-assisted investigation workflow
* Multi-agent investigation concept
* Automated documentation and test-generation workflow

---

## 🚀 How to Run

### Option 1 — Open Locally

Clone the repository:

```bash
git clone <https://github.com/rajashree3366/CodeRescue-AI.git>
cd <CodeRescue-AI>
```

Open:

```text
CodeRescue AI.html
```

in a modern web browser.

No build system is required for the current prototype.

### Option 2 — VS Code

Open the project folder in VS Code and launch:

```text
CodeRescue AI.html
```

using a local development server such as Live Server.

---

## 🎬 Demo Flow

For the hackathon demonstration:

```text
1. Open CodeRescue AI
        ↓
2. Load Demo Project
        ↓
3. Watch Repository Rescue Scan
        ↓
4. Explore Developer Rescue Map
        ↓
5. Inspect Risk Analysis
        ↓
6. Open Start Here
        ↓
7. Generate Learning Path
        ↓
8. Open Bob Rescue Center
        ↓
9. Run Bob Rescue
        ↓
10. Explore Documentation
        ↓
11. Explore Generated Tests
        ↓
12. View Rescue Report
        ↓
13. Show Before / After
```

---

## 🎯 Why CodeRescue AI?

Traditional code assistants usually help developers write or modify code.

**CodeRescue AI focuses on a different problem:**

> What happens when the developer who understands the code is no longer there?

Instead of simply generating code, CodeRescue AI focuses on **recovering the knowledge surrounding the code**.

It provides a structured path from:

```text
"I don't understand this project."
```

to:

```text
"I understand the architecture,
I know the risky areas,
I know where to start,
and I have documentation and tests."
```

---

## 📊 Prototype Scope

This submission is a hackathon prototype demonstrating the complete rescue experience using a seeded sample project.

The current prototype focuses on demonstrating:

* Codebase understanding
* Architecture visualization
* Risk discovery
* AI-assisted rescue workflow
* Documentation generation
* Test-generation workflow
* Validation
* Developer onboarding

Repository upload and live external repository analysis are not wired into the current prototype.

---

## 🔮 Future Scope

Future versions can extend CodeRescue AI with:

* GitHub repository import
* Real repository indexing
* AST-based code analysis
* Real dependency graphs
* Real IBM Bob-assisted code modifications
* Automated pull requests
* Continuous repository monitoring
* Security vulnerability detection
* CI/CD integration
* Team knowledge transfer
* Historical Git analysis
* Knowledge-base generation
* Developer Q&A over the rescued codebase

---

## 🏆 Hackathon Vision

CodeRescue AI is built around a simple idea:

### **Don't just preserve the code. Preserve the knowledge.**

When developers leave, projects shouldn't become mysteries.

**CodeRescue AI turns legacy code into a transferable engineering knowledge base.**

---

## 👥 Team

**Team Name:** `<INNOVATION HUB>`

**Members:**

* `<Team Leader: Kasamshetty Rajashree>`
* `<MEMBER 2 : Mannem UshaSri>`


---

## 📄 Project Status

**Status:** Hackathon Prototype 🚀

**Project:** CodeRescue AI

**Theme:** AI-assisted legacy codebase rescue & developer handoff

**AI Assistant:** IBM Bob

