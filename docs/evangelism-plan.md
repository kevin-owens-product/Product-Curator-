# Curator — Website & Evangelism Content Plan

## Current State

No website or landing page exists. The repository is backend-only (Express/TypeScript API). The PRD references a React frontend but it has not been built.

---

## Part 1: Landing Page Structure

### Hero Section

**Headline:** "When anyone can build, who decides what ships?"

**Sub-headline:** Curator is the operating system for AI-native development. Structured curation, clear ownership, and engaged teams — so your product stays coherent while your org moves fast.

**CTA:** "Start Free" / "Book a Demo"

**Social proof bar:** Logos + "Trusted by engineering teams shipping 10x faster without 10x the chaos"

---

### Problem Section — "The AI Productivity Paradox"

Frame the four bottlenecks organizations face when AI makes building cheap:

| Problem | One-Liner | Detail |
|---------|-----------|--------|
| **Judgment Gap** | "You can build anything. Should you?" | AI lets everyone generate working code. Without structured evaluation, orgs drown in software that shouldn't exist. |
| **Invisible Blast Radius** | "What breaks when this ships?" | Creators don't understand downstream consequences. Blast radius is tribal knowledge locked in senior engineers' heads. |
| **Coherence Decay** | "Your product is becoming Frankenstein." | Every uncoordinated feature degrades the whole. Nobody is guarding the system-level experience. |
| **Accountability Vacuum** | "When everyone can ship, who's responsible when it breaks?" | Distributed creation without distributed ownership creates orphaned code and finger-pointing. |

**Closing line:** "JIRA tracks what you're building. Curator decides whether it should exist."

---

### Solution Section — "Three Layers of Work"

Visual diagram showing:

```
CREATION LAYER  →  Wide open. Anyone. No gates. Speed matters.
       ↓
CURATION LAYER  →  Selective. Judgment applied. Coherence enforced.
       ↓
PRODUCTION LAYER → Accountable. Observable. Maintainable.
```

**Key message:** Curator doesn't slow you down. It separates "creating" (which should be fast and open) from "shipping" (which should be intentional and accountable).

---

### Use Cases Section

#### Use Case 1: "From Prototype to Production in Days, Not Weeks"

**Persona:** Creator (engineer, PM, designer — anyone)

**Story:** Sarah, a PM, uses Claude to build a customer dashboard prototype in an afternoon. She registers it in Curator, finds two similar creations already exist, collaborates with the original creator, and submits a combined version for curation. The curator evaluates it with the Five Questions, the blast radius engine confirms it's Tier 1 (low impact), and it graduates to production in 48 hours.

**Without Curator:** Sarah's prototype sits in a branch. Nobody knows it exists. A month later, another team builds the same thing. Neither ships.

**Benefits:**
- 100% creation visibility — nothing gets lost
- Duplicate detection before wasted effort
- Clear path from idea to production
- Sub-48-hour curation cycle time

---

#### Use Case 2: "Production Curators Replace Ad-Hoc Review"

**Persona:** Production Curator (senior IC)

**Story:** Marcus manages a curation queue. Each submission comes pre-analyzed with blast radius data, coherence scoring, and ownership mapping. He applies the Five Questions framework: Should this exist? What breaks if it's wrong? Does it fit the platform? Who will own it? What's the ongoing burden? He records a decision with rationale. The creator gets structured feedback, not a vague "not now."

**Without Curator:** Marcus gets pinged on Slack, reviews code in a PR with no context about system impact, and gives verbal feedback that's never recorded.

**Benefits:**
- Structured evaluation replaces gut-feel reviews
- Five Questions framework creates consistency across curators
- Blast radius analysis is automated, not tribal knowledge
- Decision history creates institutional memory

---

#### Use Case 3: "Every Line of Production Code Has an Owner"

**Persona:** Accountable Owner

**Story:** When an incident fires for the payments service, Curator automatically attributes it to the owner, shows the asset's full history (who built it, when it graduated, what changed recently), and tracks acknowledgment and resolution. When the owner changes teams, ownership transfers with a full audit trail.

**Without Curator:** An alert fires. Three people argue about who owns it. The person who wrote it left six months ago. Nobody knows the full context.

**Benefits:**
- Zero orphaned production code
- Automatic incident attribution
- Clean ownership transfers with context
- Health scoring per asset (incident frequency, staleness)

---

#### Use Case 4: "Focus the Org on What Matters Most"

**Persona:** Engineering/Product Leadership

**Story:** The VP of Engineering creates a challenge: "Reduce checkout abandonment by 15%." The challenge runs for two weeks. 23 creators participate. Submissions are scored by judges on impact, feasibility, and coherence. The winner's solution gets fast-tracked through curation. A quarterly hackathon generates 40 prototypes in 48 hours — 8 of them graduate to production.

**Without Curator:** Leadership sends an email asking for ideas. Three people respond. Nothing is tracked.

**Benefits:**
- Challenges direct creativity toward strategic problems
- Hackathons generate focused innovation bursts
- Gamification sustains engagement beyond launch week
- >20% participation rate per challenge (vs. ~3% for email requests)

---

#### Use Case 5: "See Coherence Before It's Too Late"

**Persona:** Squad Lead / Tech Lead

**Story:** The coherence dashboard shows a score of 72/100 for the workspace. Three pattern violations flagged this month: inconsistent button styles, duplicate API endpoints, and an architectural drift in the data layer. The dashboard also shows which creations introduced the violations. The squad lead can address them before they compound.

**Without Curator:** Six months later, the design team complains the product "feels disjointed." Nobody can pinpoint when it happened.

**Benefits:**
- Coherence score gives a single metric for product health
- Pattern violations caught before compounding
- Attribution links coherence issues to specific changes
- Trend lines show if things are getting better or worse

---

### Comparison Section — "Curator vs. The Status Quo"

#### Curator vs. JIRA / Linear / Shortcut

| Dimension | JIRA / Linear | Curator |
|-----------|---------------|---------|
| **Core Question** | "What are we building?" | "Should this exist?" |
| **Focus** | Task tracking and sprint management | Production curation and judgment |
| **Creation Visibility** | Tracks planned work only | Tracks everything — planned, experimental, prototypes |
| **Quality Gate** | PR review (code quality) | Curation review (product judgment + system impact) |
| **Blast Radius** | Not addressed | Automated dependency analysis with tier recommendations |
| **Coherence** | Not addressed | Active scoring, pattern compliance, flag system |
| **Ownership** | Informal (assigned in tickets) | First-class registry with transfer history, health scoring, incident attribution |
| **Innovation** | Hackathon doc in Google Drive | Built-in challenges, hackathons, competitions with gamification |
| **Incentives** | None | Points, badges, levels, leaderboards, rewards |
| **Decision History** | Comment threads in tickets | Structured Five Questions framework with full audit trail |

**Key message:** JIRA answers "is the sprint on track?" Curator answers "is our product staying coherent while we move fast?" They're complementary, not competing.

#### Curator vs. Feature Flagging Tools (LaunchDarkly, Split)

Feature flags control *rollout*. Curator controls *what should exist in the first place.* Feature flags are a production layer concern. Curator operates at the curation layer — before code even reaches production.

#### Curator vs. Code Review Tools (GitHub PRs, Reviewable)

Code review asks "is this code correct?" Curation asks "should this code exist, and what are the consequences of shipping it?" Curator doesn't replace code review. It adds a product judgment layer above it.

#### Curator vs. Spreadsheets / Wiki Pages

Many teams track ownership and coherence in spreadsheets that are out of date within a week. Curator makes ownership a live, queryable, auditable system — not a document.

---

### Benefits Section — "What Changes When You Adopt Curator"

#### For Creators
- **Clear path to production.** No more guessing what "ready" means.
- **Recognition for contributions.** Points, badges, and leaderboard visibility.
- **Find what already exists.** Duplicate detection saves wasted effort.
- **Structured feedback.** Know exactly why something was iterated or killed.

#### For Curators
- **Managed queue.** No more Slack-driven interrupts.
- **Automated context.** Blast radius, coherence score, and ownership mapping before you review.
- **Consistent framework.** Five Questions create a shared standard.
- **Decision record.** Your judgment creates institutional memory.

#### For Owners
- **Single view of everything you own.** Health scores, incident history, dependencies.
- **Automatic incident routing.** No more "who owns this?" during outages.
- **Clean handoffs.** Transfer ownership with full context and audit trail.

#### For Leadership
- **Coherence visibility.** One number that tells you if the product is staying together.
- **Innovation mechanisms.** Challenges and hackathons that actually drive participation.
- **Accountability at scale.** Every production asset has a name next to it.
- **Data-driven decisions.** Executive dashboard with curation velocity, graduation rates, incident trends.

#### For the Organization
- **Ship faster with confidence.** Speed comes from structure, not chaos.
- **Retain institutional knowledge.** Decisions, rationale, and ownership survive team changes.
- **Engage the whole org.** Gamification makes contribution fun, not burdensome.
- **Prevent coherence debt.** Catch it early instead of paying for it later.

---

### Improved Ways of Working Section

#### Before Curator: "The Wild West"
```
Developer builds something → Asks manager → Manager asks architect
→ Architect checks Slack history → Nobody remembers context
→ Ships anyway → Breaks something → 3-hour incident → "Who owns this?"
```

#### After Curator: "Structured Speed"
```
Creator registers in Curator → Finds 2 similar creations → Collaborates
→ Submits for curation → Blast radius: Tier 1 → Five Questions: PASS
→ Graduates → Ownership assigned → Incident auto-routes → 15-min MTTR
```

#### The Engagement Flywheel
```
Create → Earn Points → Level Up → Unlock Badges
   ↑                                      ↓
Participate in Challenges ← See Leaderboard
```

Gamification isn't a gimmick. It makes the desired behavior (registering creations, submitting for curation, owning assets) the rewarded behavior.

---

### Pricing Section

| | Free | Starter | Professional | Enterprise |
|---|---|---|---|---|
| **Price** | $0 | $29/user/mo | $79/user/mo | Custom |
| **Creators** | 5 | 25 | Unlimited | Unlimited |
| **Workspaces** | 1 | 3 | 10 | Unlimited |
| **Curation** | Basic | Full workflow | Full + analytics | Full + custom |
| **Blast Radius** | Manual only | Automated | Automated + CI | Automated + custom rules |
| **Coherence** | Score only | Score + flags | Score + patterns + trends | Custom patterns |
| **Hackathons** | 1/quarter | Unlimited | Unlimited | Unlimited |
| **Support** | Community | Email | Priority | Dedicated CSM |
| **SSO/SAML** | — | — | Yes | Yes |
| **Audit Log** | 30 days | 90 days | 1 year | Unlimited |
| **Data Residency** | US | US | US/EU | Custom |

---

### Social Proof / Testimonials Section

*(Placeholder for beta customers)*

Structure each testimonial around:
- "Before Curator, we ___. Now we ___."
- Quantified impact (curation cycle time, orphaned code %, participation rate)

---

## Part 2: Evangelism Content Calendar

### Blog Posts (12-week plan)

| Week | Title | Angle |
|------|-------|-------|
| 1 | "When Anyone Can Build, Who Decides What Ships?" | Thought leadership — the AI productivity paradox |
| 2 | "The Five Questions Every Creation Should Answer Before Shipping" | Framework — practical methodology |
| 3 | "Your Product Is Becoming Frankenstein (And You Don't Know It Yet)" | Problem awareness — coherence decay |
| 4 | "Why PR Review Isn't Enough in the AI Era" | Comparison — code review vs. product curation |
| 5 | "Blast Radius: The Tribal Knowledge That Should Be a System" | Feature deep dive — blast radius engine |
| 6 | "Hackathons That Actually Ship: From 48 Hours to Production" | Use case — hackathons that produce real output |
| 7 | "The Ownership Problem Nobody Talks About" | Problem awareness — orphaned production code |
| 8 | "Gamification Done Right: Why Points Aren't Enough" | Philosophy — meaningful engagement vs. vanity metrics |
| 9 | "How We Reduced Curation Cycle Time from 2 Weeks to 48 Hours" | Case study format |
| 10 | "JIRA Tracks What You're Building. Curator Decides If It Should Exist." | Comparison — positioning against PM tools |
| 11 | "The Coherence Dashboard: One Number for Product Health" | Feature deep dive — coherence scoring |
| 12 | "AI-Native Development Needs AI-Native Governance" | Thought leadership — platform vision |

### Short-Form Content (LinkedIn / X)

- "The most expensive software your org will ever write is the software that shouldn't exist."
- "Code review asks: is this correct? Curation asks: should this exist?"
- "Your product's biggest threat isn't a competitor. It's internal incoherence."
- "In the AI era, the scarce resource isn't engineering capacity. It's judgment."
- "Every line of production code without an owner is a future incident."
- "Hackathons that don't connect to production are just team-building exercises."
- "Blast radius isn't a feeling. It should be a system."

### Conference Talk Proposals

1. **"The Curation Layer: Why AI-Native Orgs Need a New Operating Model"** — keynote-style, 30 min
2. **"Five Questions: A Framework for Production-Ready Judgment"** — workshop, 90 min
3. **"Gamifying the Right Behaviors: Engagement Design for Engineering Orgs"** — talk, 20 min
4. **"From 0% to 100% Ownership Coverage: A Case Study"** — case study, 20 min

---

## Part 3: SEO / Keyword Strategy

### Primary Keywords
- AI-native development workflow
- Production curation platform
- Software ownership management
- Product coherence tool
- Engineering gamification platform
- Blast radius analysis tool
- AI code governance
- Development workflow management

### Long-tail Keywords
- "how to manage AI-generated code in production"
- "who decides what ships to production"
- "software ownership registry tool"
- "alternative to JIRA for AI teams"
- "product coherence scoring"
- "engineering hackathon management platform"
- "Five Questions framework curation"
- "blast radius assessment tool"

---

## Part 4: Demo / Product Tour Flow

### Self-Serve Demo (Interactive)

1. **Create a creation** — show registration with problem statement
2. **See duplicate detection** — surface a similar creation
3. **Submit for curation** — trigger the Five Questions flow
4. **View blast radius** — automated tier assessment (Tier 1)
5. **Curator decides** — Graduate with rationale
6. **Ownership assigned** — asset appears in owner's dashboard
7. **Earn points** — see gamification in action
8. **Check coherence** — view the coherence score update

### Sales Demo Script

**Open with the problem:** "How do you currently decide what makes it to production? ... What happens when something breaks and nobody knows who owns it?"

**Show the three layers:** Creation → Curation → Production

**Demo the Five Questions:** Walk through a real evaluation

**Show blast radius:** "This is tribal knowledge, automated."

**Show coherence score:** "This is one number for product health."

**Close with engagement:** "And your team actually wants to use it." Show gamification, challenge participation rates, leaderboard.

---

## Part 5: Implementation Priorities

### Phase 1: Marketing Site (MVP)
- Landing page with hero, problem, solution, pricing, CTA
- Blog infrastructure (start with 3 launch posts)
- "Book a Demo" flow with Calendly/similar
- Analytics (Mixpanel/Amplitude for conversion tracking)

### Phase 2: Content Engine
- Weekly blog cadence
- LinkedIn presence for founder(s)
- Developer community (Discord or Slack)
- Product changelog / "What's New"

### Phase 3: Social Proof
- Beta customer case studies
- Testimonial video snippets
- Integration partner announcements (GitHub, Slack, PagerDuty)

### Phase 4: Demand Generation
- Webinar series: "AI-Native Development Workflows"
- Conference speaking circuit
- Comparison pages (vs. JIRA, vs. Linear, vs. spreadsheets)
- Free tier as self-serve funnel
