<!--
  OWASP GenAI Crosswalk
  Source list : OWASP GenAI Data Security Risks 2026 (DSGAI01-DSGAI21)
  Framework   : OWASP Non-Human Identities (NHI) Top 10
  Version     : 2026-Q4
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# DSGAI 2026 × OWASP NHI Top 10

Mapping the
[OWASP GenAI Data Security Risks 2026](https://genai.owasp.org/resource/owasp-genai-data-security-risks-mitigations-2026/)
(DSGAI01–DSGAI21) to the
[OWASP Non-Human Identities (NHI) Top 10](https://owasp.org/www-project-non-human-identities-top-10/) —
the framework for securing machine identities including service
accounts, API keys, OAuth tokens, certificates, and pipeline credentials.

---

## Why NHI matters for GenAI data security

The DSGAI taxonomy is fundamentally about data: how GenAI data flows
are configured, accessed, protected, and governed. Every data flow
requires credentials — NHI. Training pipelines, embedding stores,
RAG retrieval systems, tool integrations, inference APIs, and audit
logging systems all authenticate with Non-Human Identities.

The NHI risks that most directly amplify DSGAI vulnerabilities:

- **Agent identity and delegated access (DSGAI02):** agents and tools
  are non-human identities; over-scoped agent tokens, and agents calling
  downstream systems with their own identity instead of the delegating
  user's, expose data the user is not entitled to (NHI-5, NHI-4, NHI-7).
- **Training data poisoning (DSGAI04):** possible only when pipeline
  credentials have write access to training stores (NHI-5).
- **RAG corpus manipulation (DSGAI04):** possible only when corpus
  write credentials are insufficiently protected (NHI-5, NHI-6, NHI-7).
- **Data leakage in retrieval (DSGAI13):** enabled when embedding
  store service accounts have cross-tenant read scope (NHI-5).
- **Third-party data dependencies (DSGAI04):** third-party data
  source credentials are rarely reviewed for scope (NHI-3).
- **Data pipeline security (DSGAI05):** pipeline service accounts
  frequently hold over-broad access to all pipeline stages (NHI-5, NHI-9).

NHI programme maturity is a prerequisite for DSGAI risk reduction —
you cannot secure GenAI data flows without securing the credentials
that access them.

---

## OWASP NHI Top 10 reference

| NHI Entry | Name | Description |
|---|---|---|
| NHI-1 | Improper Offboarding | NHIs not revoked when systems decommission or integrations end |
| NHI-2 | Secret Leakage | Credentials exposed in code, logs, config, model outputs |
| NHI-3 | Vulnerable Third-Party NHI | Third-party tokens and identities with excessive permissions |
| NHI-4 | Insecure Authentication | Weak or missing authentication for machine-to-machine communication |
| NHI-5 | Over-Privileged NHI | NHIs with more permissions than required |
| NHI-6 | Insecure Credential Storage | Credentials stored insecurely — plaintext, weak encryption |
| NHI-7 | Long-Lived Credentials | Credentials without rotation, expiry, or revocation |
| NHI-8 | Environment Isolation Failure | Credentials shared across environments |
| NHI-9 | NHI Reuse | Same credentials used across multiple services or data flows |
| NHI-10 | Human Use of NHI | Humans using machine credentials — no attribution |

---

## Quick-reference summary

| DSGAI ID | Name | Severity | Primary NHI Entries | Tier |
|---|---|---|---|---|
| DSGAI01 | Sensitive Data Leakage | Critical | NHI-2, NHI-5, NHI-7 | Foundational–Hardening |
| DSGAI02 | Agent Identity & Credential Exposure | Critical | NHI-5, NHI-4, NHI-2, NHI-7, NHI-9, NHI-6 | Foundational–Advanced |
| DSGAI03 | Shadow AI & Unsanctioned Data Flows | High | NHI-2, NHI-3, NHI-10 | Foundational–Hardening |
| DSGAI04 | Data, Model & Artifact Poisoning | Critical | NHI-5, NHI-6, NHI-7, NHI-3, NHI-8, NHI-2 | Hardening–Advanced |
| DSGAI05 | Data Integrity & Validation Failures | High | NHI-4, NHI-5, NHI-9 | Foundational–Hardening |
| DSGAI06 | Tool, Plugin & Agent Data Exchange Risks | High | NHI-3, NHI-5, NHI-9 | Foundational–Hardening |
| DSGAI07 | Data Governance, Lifecycle & Classification for AI Systems | High | NHI-10, NHI-2, NHI-5 | Foundational–Hardening |
| DSGAI08 | Non-Compliance & Regulatory Violations | High | NHI-10, NHI-2 (attribution) | Foundational–Hardening |
| DSGAI09 | Multimodal Capture & Cross-Channel Data Leakage | High | NHI-3 | Foundational |
| DSGAI10 | Synthetic Data, Anonymization & Transformation Pitfalls | Medium | NHI-8, NHI-5 | Foundational |
| DSGAI11 | Cross-Context & Multi-User Conversation Bleed | High | NHI-5, NHI-6 (session store) | Hardening–Advanced |
| DSGAI12 | Unsafe Natural-Language Data Gateways (LLM-to-SQL/Graph) | Critical | NHI-5, NHI-9, NHI-10 | Hardening–Advanced |
| DSGAI13 | Vector Store Platform Data Security | High | NHI-5, NHI-4, NHI-9 | Hardening–Advanced |
| DSGAI14 | Excessive Telemetry & Monitoring Leakage | High | NHI-5, NHI-2 (log access) | Foundational–Hardening |
| DSGAI15 | Over-Broad Context Windows & Prompt Over-Sharing | High | NHI-5 (data feed access) | Hardening–Advanced |
| DSGAI16 | Endpoint & Browser Assistant Overreach | High | NHI-6, NHI-7, NHI-10 | Foundational–Hardening |
| DSGAI17 | Data Availability & Resilience Failures in AI Pipelines | High | NHI-9, NHI-5 (cascade amplifiers) | Hardening–Advanced |
| DSGAI18 | Inference & Data Reconstruction | High | NHI-5, NHI-7 | Hardening–Advanced |
| DSGAI19 | Human-in-the-Loop & Labeler Overexposure | Medium | NHI-3, NHI-1, NHI-10 | Foundational–Hardening |
| DSGAI20 | Model Exfiltration & IP Replication | High | NHI-5, NHI-7 (API access) | Hardening–Advanced |
| DSGAI21 | Disinformation & Integrity Attacks via Data Poisoning | High | NHI-3, NHI-5 | Hardening–Advanced |

---

## Audience tags

- **Identity and access management (IAM) team** — full file
- **Agent and application developers** — DSGAI02, DSGAI06, DSGAI12 — agent, tool and gateway credentials
- **Data engineer / ML engineer** — DSGAI04, DSGAI05, DSGAI13 — pipeline NHI
- **Security engineer** — NHI-2/NHI-5/NHI-7 most actionable
- **Platform engineer** — NHI-4/NHI-8/NHI-9 for infrastructure design
- **Auditor** — NHI-1/NHI-10 for attribution and offboarding evidence

---

## Detailed mappings

---

### DSGAI01 — Sensitive Data Leakage

Credentials appearing in model outputs (NHI-2) or over-broad service
account access to sensitive data stores (NHI-5) enable disclosure.

Pipeline credentials with broad data access enable ingestion of
sensitive data that would be excluded with properly scoped credentials.

NHI amplifies injection: a system where data channels carry injected
content is more dangerous when the processing pipeline holds
over-privileged credentials. The injected instruction can only
cause damage proportional to the credential scope of the pipeline.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-2 Secret Leakage | Credentials embedded in model outputs or training data surface in responses | Output scanning for credential patterns |
| NHI-5 Over-Privileged NHI | Over-broad retrieval credentials return data beyond user entitlement | Minimum scope for retrieval service accounts |
| NHI-5 Over-Privileged NHI | Pipeline service account with access to sensitive data stores | Scope pipeline credentials to approved data sources only |
| NHI-2 Secret Leakage | Credentials embedded in config files include sensitive data source access | Audit config files for embedded credentials |
| NHI-5 Over-Privileged NHI | Injection blast radius limited only by credential scope | Apply least-privilege to all data pipeline credentials |
| NHI-7 Long-Lived Credentials | Injected actions can use pipeline tokens for extended period | Short-lived tokens for all data pipeline service accounts |

**Mitigations:**

- NHI-2: automated credential pattern detection in output pipeline
- NHI-5: per-user retrieval credentials or query-scoped access only
- Secret scanning in all data sources that feed the model
- NHI-5: pipeline credentials scoped to approved training data sources only
- NHI-2: automated secret scanning of all pipeline config files
- Document and justify every data source in training pipeline
- NHI-5: audit and reduce scope of all data pipeline credentials
- NHI-7: automate rotation of all pipeline service account credentials
- Minimum scope per data channel: read-only credentials for data consumption

---

### DSGAI02 — Agent Identity & Credential Exposure

This is the entry where the NHI Top 10 applies most directly: agents,
tools and pipelines are non-human identities. Exposure comes from
over-scoped agent tokens, credentials passed through prompts, tools or
memory, identities shared across agents, and agents that call downstream
systems with their own identity instead of the identity of the user who
delegated the task. In that last case, the downstream system authorizes
the agent rather than the user, so the user can reach data they are not
entitled to.

Data access scope is a direct function of credential scope. This
entry is the DSGAI expression of NHI-5 — it describes what happens
when NHI-5 is not remediated.

Model weight storage credentials determine who can exfiltrate
proprietary models. NHI-5 and NHI-6 are the direct enabling
conditions for weight theft.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Agent tokens carry broader scope than any single task needs; downstream calls are authorized against the agent, not the delegating user | Per-task, least-privilege scopes; for delegated calls, pass the user's identity so access is bounded by both the user's and the agent's permissions |
| NHI-4 Insecure Authentication | Agent-facing endpoints and proxies accept requests without authenticating the caller, so any client can use the credential they hold | Authenticate every caller of an agent, tool server or proxy; do not rely on network position |
| NHI-2 Secret Leakage | Agent credentials appear in prompts, tool payloads, memory stores or logs | Keep credentials out of model context; inject them at the tool boundary |
| NHI-7 Long-Lived Credentials | Long-lived agent API keys remain valid after the task or session ends | Issue short-lived, task-bound tokens |
| NHI-9 NHI Reuse | One identity shared by several agents or tools removes per-agent attribution and containment | A distinct identity per agent and per tool integration |
| NHI-1 Improper Offboarding | Retired agents and integrations keep working credentials | Revoke credentials when an agent, tool or integration is decommissioned |
| NHI-10 Human Use of NHI | People use agent or service credentials directly, so actions cannot be attributed | Prohibit human use of agent identities; give people their own identities |
| NHI-5 Over-Privileged NHI | GenAI system service account has access to more data than declared function requires | Audit and reduce credential scope per system component |
| NHI-7 Long-Lived Credentials | Long-lived credentials maintain excessive access indefinitely | Rotate or replace with short-lived tokens |
| NHI-9 NHI Reuse | Same data access credential used across multiple GenAI system functions | Separate credentials per function |
| NHI-5 Over-Privileged NHI | Model storage service account with read access from unexpected paths | Minimum scope: only authorised inference service can read model weights |
| NHI-6 Insecure Credential Storage | Model storage credentials in plaintext config | Vault all model storage credentials |

**Mitigations:**

- NHI-5: bound delegated access by the delegating user's permissions as well as the agent's
- NHI-4: authenticate every caller of agent endpoints, tool servers and proxies
- NHI-2: no credentials in prompts, tool arguments, memory or logs
- NHI-7: short-lived, task-scoped tokens issued just in time
- NHI-9: one identity per agent and per tool, so a compromise is contained and attributable
- NHI-1: credential revocation is part of agent and integration decommissioning
- NHI-5: audit all GenAI system data access credentials; reduce to minimum
- NHI-7: JIT short-lived tokens for data access (see RECIPES.md)
- NHI-9: separate credential per GenAI system component
- Quarterly data access credential review
- NHI-5: model weight read access restricted to authorised inference service identity only
- NHI-6: vault all model storage access credentials
- Alert on any model weight access from unexpected service identity

---

### DSGAI03 — Shadow AI & Unsanctioned Data Flows

Shadow AI usually runs on credentials outside the identity inventory:
personal API keys, ad hoc tokens for unsanctioned services and
integrations that no one reviewed. Those credentials are what let data
leave without visibility.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-2 Secret Leakage | Keys for unsanctioned AI services sit in scripts, notebooks and config files | Secret scanning that flags keys for unapproved AI providers |
| NHI-3 Vulnerable Third-Party NHI | Unvetted third-party AI integrations are granted tokens to enterprise data | Review and approve third-party AI integrations before granting access |
| NHI-10 Human Use of NHI | People use service credentials to connect unsanctioned tools | Monitor service-credential use from interactive clients |

**Mitigations:**

- NHI-2: detect keys for unapproved AI providers in code and configuration
- NHI-3: an approval and inventory process for AI integrations that receive tokens
- NHI-10: alert when service credentials are used from user devices or unsanctioned tools

---

### DSGAI04 — Data, Model & Artifact Poisoning

Credential access is the attack path for training data poisoning.
Without write credentials to training data stores, external poisoning
is not possible. NHI-5 and NHI-6 are the enabling conditions.

Corpus manipulation requires
write access to the corpus store. Without write credentials, most
corpus manipulation attacks are not possible. NHI-5/NHI-6/NHI-7
are the enabling conditions.

Model provider credentials, model registry tokens, and ML framework
access are third-party NHIs with security implications if compromised.

Third-party data source credentials are NHI-3 by definition —
external credentials held by the organisation on behalf of a
third-party relationship, often with excessive scope.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Write access to training data stores enables poisoning | Separate read and write credentials; write requires MFA |
| NHI-6 Insecure Credential Storage | Training pipeline credentials in plaintext config | Vault all training pipeline credentials |
| NHI-7 Long-Lived Credentials | Long-lived write credentials create persistent poisoning window | Short-lived write tokens; rotate frequently |
| NHI-5 Over-Privileged NHI | Corpus write access held by service accounts that do not need it | Separate read and write credentials; write accounts require MFA |
| NHI-6 Insecure Credential Storage | Corpus write credentials in plaintext config | Vault all corpus write credentials |
| NHI-7 Long-Lived Credentials | Long-lived corpus write credentials persist beyond need | Rotate corpus write credentials; implement short-lived write pattern |
| NHI-3 Vulnerable Third-Party NHI | Model provider API keys with excessive access to model versions | Review and scope all model provider credentials |
| NHI-8 Environment Isolation Failure | Same model registry token used across dev/staging/production | Separate credentials per environment |
| NHI-2 Secret Leakage | Model provider credentials in pipeline config | Vault all model provider credentials |
| NHI-3 Vulnerable Third-Party NHI | Third-party data source API keys with excessive scope | Review all third-party credentials; reduce to minimum |
| NHI-8 Environment Isolation Failure | Third-party development credentials used in production | Enforce environment isolation for third-party credentials |
| NHI-2 Secret Leakage | Third-party credentials embedded in shared config | Vault all third-party data source credentials |

**Mitigations:**

- NHI-5: read-only credentials for data consumption; separate write credentials with MFA
- NHI-6: vault all training pipeline credentials; no plaintext in config
- NHI-7: automated rotation for all training data write credentials
- Audit who has current write access to training data stores
- NHI-5: read-only credentials for inference-time corpus access; write credentials separate and MFA-protected
- NHI-6: vault all corpus write credentials; no plaintext in deployment config
- NHI-7: automated rotation for all corpus write credentials
- Audit who holds current corpus write credentials; remove any unnecessary access
- NHI-3: assess and reduce scope of all model provider credentials
- NHI-8: separate credentials per environment and model version
- NHI-2: vault all model supply chain credentials; automated secret scanning
- NHI-3: review and reduce scope of all third-party data source credentials
- NHI-8: separate third-party credentials per environment
- NHI-2: vault all third-party credentials; automated secret scanning in config

---

### DSGAI05 — Data Integrity & Validation Failures

Pipeline authentication gaps are NHI problems: unauthenticated
pipeline connections (NHI-4), shared credentials across pipeline
stages (NHI-9), and environment isolation failures (NHI-8) are
the structural causes of insecure data pipelines.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-4 Insecure Authentication | Unauthenticated connections between pipeline stages | Require mTLS or token auth for all pipeline connections |
| NHI-5 Over-Privileged NHI | Pipeline service account with access to all stages | Per-stage credentials with minimum scope |
| NHI-9 NHI Reuse | Same credential used for multiple pipeline stages | Separate credentials per stage |

**Mitigations:**

- NHI-4: mTLS or token authentication for all pipeline stage connections
- NHI-9: separate service account per pipeline stage
- NHI-5: minimum scope per stage — each stage accesses only its declared data
- NHI-8: environment isolation — development pipeline credentials differ from production

---

### DSGAI06 — Tool, Plugin & Agent Data Exchange Risks

Third-party tool credentials (NHI-3) and shared tool credentials
(NHI-9) create data leakage paths via tool API responses.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-3 Vulnerable Third-Party NHI | Third-party tool credentials with excessive data access | Review all third-party tool credentials; reduce to minimum scope |
| NHI-5 Over-Privileged NHI | Tool integration credentials with broad data access | Minimum scope per tool integration |
| NHI-9 NHI Reuse | Same credential used across multiple tool integrations | Separate credentials per tool |

**Mitigations:**

- NHI-3: assess and reduce scope of all third-party tool credentials
- NHI-9: separate credentials per tool integration
- NHI-5: data minimisation enforced at credential level — credentials cannot access data beyond declared function

---

### DSGAI07 — Data Governance, Lifecycle & Classification for AI Systems

Provenance and lineage records require attribution — knowing which
identity ingested or transformed which data. NHI-10 destroys this
attribution. NHI-1 (improper offboarding) leaves orphaned identities
in lineage records.

Retention and deletion operations require appropriate credentials.
NHI-10 (human use of machine credentials) destroys the attribution
needed to prove compliance with deletion obligations.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-10 Human Use of NHI | Machine credentials used for ingestion operations — no individual attribution | Enforce machine identity per pipeline component; log with component identity |
| NHI-1 Improper Offboarding | Decommissioned pipeline identities remain in lineage records | Timely offboarding of pipeline NHIs |
| NHI-2 Secret Leakage | Lineage system credentials leaked — provenance records can be tampered | Protect lineage system credentials |
| NHI-5 Over-Privileged NHI | Service account with access to retained data beyond declared function | Minimum scope for data access credentials |
| NHI-10 Human Use of NHI | Humans using machine credentials for data deletion — no audit trail | Enforce human identity for all compliance operations |

**Mitigations:**

- NHI-10: each pipeline stage has its own machine identity — lineage records include identity
- NHI-1: automated offboarding triggers when pipeline components are decommissioned
- NHI-2: protect lineage and audit system credentials as high-sensitivity NHI
- NHI-10: all compliance operations (deletion, access review) require human identity, not machine credential
- NHI-5: data access credentials scoped to minimum required for each retention period
- Audit trail of all deletion operations with human attribution

---

### DSGAI08 — Non-Compliance & Regulatory Violations

Attribution is required for compliance. NHI-10 (human use of machine
credentials) destroys attribution needed for GDPR, CCPA, and other
regulatory audit trails.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-10 Human Use of NHI | Humans using machine credentials — no attribution for compliance evidence | Enforce human identity for all regulated data operations |
| NHI-2 Secret Leakage | Compliance audit credentials leaked — tampering with evidence possible | Protect audit credential integrity |

**Mitigations:**

- NHI-10: all regulated data operations require human identity with MFA
- NHI-2: protect compliance audit system credentials as high-sensitivity NHI
- Separate credentials for compliance vs operational data access

---

### DSGAI09 — Multimodal Capture & Cross-Channel Data Leakage

The NHI Top 10 applies only in part here: most of this risk sits in
content handling, not identity. The NHI angle is the credentials of
external services, such as OCR, transcription or image analysis, that
receive multimodal content.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-3 Vulnerable Third-Party NHI | External OCR, transcription or vision services receive content under tokens with more scope or retention than needed | Assess third-party multimodal services; minimum-scope tokens and contractual retention limits |

**Mitigations:**

- NHI-3: inventory and scope review for every external service that processes images, audio or video

---

### DSGAI10 — Synthetic Data, Anonymization & Transformation Pitfalls

The NHI Top 10 applies only in part here. The NHI angle is environment
separation: when test or development pipelines hold production
credentials, they read real records where synthetic or de-identified
data was intended.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-8 Environment Isolation Failure | Development and test environments use production credentials and pull real data | Separate credentials per environment; no production read access from non-production |
| NHI-5 Over-Privileged NHI | Synthetic-data generation jobs keep read access to raw sources after generation | Scope generation jobs to the source data they need, for as long as they need it |

**Mitigations:**

- NHI-8: environment-specific credentials, with production data unreachable from test
- NHI-5: time-bound read access for synthetic-data generation

---

### DSGAI11 — Cross-Context & Multi-User Conversation Bleed

Session store access credentials determine who can read or write
session data. Over-broad session store credentials (NHI-5) or
insecurely stored session store access keys (NHI-6) enable
cross-session attacks.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Session store service account with cross-user read/write access | Per-user session store access controls |
| NHI-6 Insecure Credential Storage | Session store access credentials in plaintext | Vault session store credentials |

**Mitigations:**

- NHI-5: enforce per-user session isolation at credential level
- NHI-6: vault all session store credentials
- Session store credentials have minimum scope: one user context, no cross-session access

---

### DSGAI12 — Unsafe Natural-Language Data Gateways (LLM-to-SQL/Graph)

A natural-language gateway usually runs every generated query under its
own service identity. The database then sees one privileged caller and
cannot apply the requesting user's permissions, so the scope of the
gateway's credential becomes the scope of every user's query.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | The gateway's database identity can read far more than any individual user may | Run queries under the requesting user's identity, or a credential scoped to that user |
| NHI-9 NHI Reuse | All users' queries share one gateway credential, so per-user limits and attribution are lost | Per-user or per-role credentials for the gateway |
| NHI-10 Human Use of NHI | Analysts use the gateway's service credential directly for ad hoc queries | No human use of the gateway's service identity |

**Mitigations:**

- NHI-5: user-scoped credentials so the database enforces row- and column-level permissions
- NHI-9: no single shared credential for all gateway traffic
- NHI-10: attribute every generated query to the requesting user

---

### DSGAI13 — Vector Store Platform Data Security

Cross-tenant retrieval leakage is enabled by embedding store service
accounts with cross-tenant read scope (NHI-5) or unauthenticated
embedding store connections (NHI-4).

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Embedding store service account with cross-tenant read access | Per-tenant credentials or row-level security with minimum scope |
| NHI-4 Insecure Authentication | Unauthenticated embedding store access | Require authentication for all vector database connections |
| NHI-9 NHI Reuse | Same embedding store credential used for multiple tenants | Separate credentials per tenant or use row-level security |

**Mitigations:**

- NHI-5: per-tenant embedding store credentials or fine-grained access controls
- NHI-4: mTLS or token authentication for all embedding store connections
- NHI-9: tenant isolation via separate credentials or RBAC

---

### DSGAI14 — Excessive Telemetry & Monitoring Leakage

Inference log credentials determine who can access submitted inputs
and generated outputs. NHI-5 (over-broad log access) and NHI-2
(credential leakage into logs) are the primary NHI vectors.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Inference log service account with broad read access | Minimum scope: only authorised audit function can read inference logs |
| NHI-2 Secret Leakage | Service account credentials embedded in inference log entries | Scan and scrub credentials from inference logs |

**Mitigations:**

- NHI-5: inference log access restricted to authorised audit identity
- NHI-2: credential scrubbing in inference log pipeline
- Log access audit: alert on unexpected read of inference logs

---

### DSGAI15 — Over-Broad Context Windows & Prompt Over-Sharing

Data feeds contributing to context window require authenticated,
minimum-scope credentials. Over-privileged data feed credentials
expand the attack surface for context poisoning.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Data feed service accounts with access to sensitive data that should not enter context | Scope data feed credentials to approved data only |

**Mitigations:**

- NHI-5: credentials for each data feed scoped to the data sources approved for context assembly
- Audit all data sources contributing to context window
- Separate credentials per data feed

---

### DSGAI16 — Endpoint & Browser Assistant Overreach

Browser, IDE and desktop assistants hold tokens on the endpoint and
often act with the user's own session. Their tokens are exposed to local
compromise, and their actions are hard to tell apart from the user's.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-6 Insecure Credential Storage | Assistant tokens are kept in browser storage, extension storage or local files | Use the platform's secure credential store |
| NHI-7 Long-Lived Credentials | Extension and assistant tokens do not expire | Short-lived tokens with refresh |
| NHI-10 Human Use of NHI | The assistant acts with the user's session, so its actions are attributed to the user | A distinct identity for the assistant, recorded in audit trails |
| NHI-2 Secret Leakage | Assistants read files or pages that contain secrets and send them on | Exclude secret-bearing files and pages from assistant context |

**Mitigations:**

- NHI-6: platform credential stores for assistant tokens
- NHI-7: expiring, refreshable assistant tokens
- NHI-10: separate assistant identity so its actions are attributable
- NHI-2: exclude known secret locations from assistant access

---

### DSGAI17 — Data Availability & Resilience Failures in AI Pipelines

Credential reuse (NHI-9) across pipeline stages is a cascade amplifier:
one compromised credential can affect all stages sharing it. Over-privileged
credentials amplify the blast radius of any single-stage failure.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-9 NHI Reuse | Shared credential across pipeline stages — one failure affects all | Separate credentials per pipeline stage |
| NHI-5 Over-Privileged NHI | Single credential covering multiple pipeline stages amplifies cascade | Per-stage minimum scope credentials |

**Mitigations:**

- NHI-9: separate credentials per pipeline stage — stage failure cannot cascade via shared credential
- NHI-5: minimum scope per stage limits what a compromised stage can affect
- Circuit breaker: pipeline stage isolation enforced at credential level

---

### DSGAI18 — Inference & Data Reconstruction

Reconstruction attacks need access, either query access at volume or
read access to stored vectors. The scope and lifetime of those
credentials decide whether such an attack is practical.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | Read access to raw embeddings is granted to identities that only need query results | Restrict direct embedding access; expose only query interfaces |
| NHI-7 Long-Lived Credentials | Long-lived API keys allow sustained, high-volume querying | Short-lived keys with per-identity rate limits |

**Mitigations:**

- NHI-5: no direct embedding read access outside the indexing pipeline
- NHI-7: expiring keys and per-identity rate limits on inference APIs

---

### DSGAI19 — Human-in-the-Loop & Labeler Overexposure

Labeling platforms and vendors reach raw data through tokens and shared
accounts. Over-scoped vendor tokens, access left in place after a
project ends and shared labeler accounts all widen exposure.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-3 Vulnerable Third-Party NHI | Labeling vendors receive tokens to whole datasets rather than assigned batches | Vendor tokens scoped to assigned batches |
| NHI-1 Improper Offboarding | Vendor and labeler access is not revoked when a project ends | Revoke access at project close |
| NHI-10 Human Use of NHI | Labelers share a service account, so access cannot be attributed | Individual labeler identities |

**Mitigations:**

- NHI-3: batch-scoped tokens for labeling vendors
- NHI-1: access revocation as part of project close
- NHI-10: individual identities for labelers and reviewers

---

### DSGAI20 — Model Exfiltration & IP Replication

Extraction attacks succeed at scale when API credentials have no
effective rate limiting. Long-lived, high-quota API credentials
(NHI-7) and over-privileged inference API access (NHI-5) amplify
extraction attack surface.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-5 Over-Privileged NHI | API credentials with high quota enabling systematic extraction | Per-user quotas; minimum default quota |
| NHI-7 Long-Lived Credentials | Long-lived inference API credentials enable sustained extraction campaigns | Rotate API credentials; implement per-session tokens |

**Mitigations:**

- NHI-5: per-user quota limits; no credential class has unlimited inference access
- NHI-7: implement per-session inference tokens; rotate API credentials regularly
- Monitor for systematic query patterns per credential

---

### DSGAI21 — Disinformation & Integrity Attacks via Data Poisoning

Runtime disinformation enters through sources the system already trusts.
The credentials that external feeds and connectors use to write into
those sources decide who can change what the model treats as reliable.

#### NHI mapping

| NHI Entry | How it applies | Mitigation |
|---|---|---|
| NHI-3 Vulnerable Third-Party NHI | Third-party feeds and connectors write into trusted retrieval sources with broad tokens | Write scopes limited to each feed's own source partition |
| NHI-5 Over-Privileged NHI | Ingestion identities can write to every trusted source | Separate write credentials per trusted source |

**Mitigations:**

- NHI-3: per-feed, partition-scoped write access for third-party sources
- NHI-5: no ingestion identity with write access across all trusted sources

---

## NHI programme maturity for GenAI data security

| NHI Risk | DSGAI entries most affected | Target state | Owner |
|---|---|---|---|
| NHI-1 Improper Offboarding | DSGAI02, DSGAI07, DSGAI19 | Automated on component decommission | IAM |
| NHI-2 Secret Leakage | DSGAI01, DSGAI02, DSGAI03, DSGAI04, DSGAI07, DSGAI08, DSGAI14, DSGAI16 | Automated scanning in CI/CD | DevSecOps |
| NHI-3 Third-Party NHI | DSGAI03, DSGAI04, DSGAI06, DSGAI09, DSGAI19, DSGAI21 | Assessed and minimum-scoped | Security |
| NHI-4 Insecure Authentication | DSGAI02, DSGAI05, DSGAI13 | mTLS enforced across pipelines | Platform |
| NHI-5 Over-Privileged NHI | DSGAI01, DSGAI02, DSGAI04, DSGAI05, DSGAI06, DSGAI07, DSGAI10, DSGAI11, DSGAI12, DSGAI13, DSGAI14, DSGAI15, DSGAI17, DSGAI18, DSGAI20, DSGAI21 | Least-privilege per component | IAM |
| NHI-6 Insecure Storage | DSGAI02, DSGAI04, DSGAI11, DSGAI16 | All credentials in vault | Platform |
| NHI-7 Long-Lived | DSGAI01, DSGAI02, DSGAI04, DSGAI16, DSGAI18, DSGAI20 | Rotation automated | IAM |
| NHI-8 Env Isolation | DSGAI04, DSGAI10 | Env separation enforced | DevSecOps |
| NHI-9 NHI Reuse | DSGAI02, DSGAI05, DSGAI06, DSGAI12, DSGAI13, DSGAI17 | Separate credential per component | IAM |
| NHI-10 Human Use | DSGAI02, DSGAI03, DSGAI07, DSGAI08, DSGAI12, DSGAI16, DSGAI19 | Human identity enforced for compliance | IAM |

---

## References

- [OWASP NHI Top 10](https://owasp.org/www-project-non-human-identities-top-10/)
- [OWASP GenAI Data Security Risks 2026](https://genai.owasp.org/resource/owasp-genai-data-security-risks-mitigations-2026/)
- [Agentic_OWASP_NHI.md](../agentic-top10/Agentic_OWASP_NHI.md) — NHI-to-ASI cross-mapping
- [LLM_NHI.md](../llm-top10/LLM_NHI.md) — NHI for LLM deployments
- [shared/RECIPES.md](../shared/RECIPES.md) — Pattern 3: JIT Credential Issuance

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-03-27 | Initial release — full mapping DSGAI01–DSGAI21 to NHI Top 10 |
| 1.1.0 | 2026-11-27 | Aligned headings with the DSGAI 2026 v1.0 taxonomy ([#444](https://github.com/GenAI-Security-Project/crosswalk/issues/444)): moved existing sections to the entries they address, added sections for DSGAI03, DSGAI09, DSGAI10, DSGAI12, DSGAI16, DSGAI18, DSGAI19 and DSGAI21 and new rows for DSGAI02, removed the section with no 2026 counterpart (Guardrail Circumvention) |

---

*Part of the
[OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk)
—
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
*License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)*
