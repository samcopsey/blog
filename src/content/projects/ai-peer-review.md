---
title: "AI Peer Review (AIPR)"
description: "An AI-powered review tool for consultancy deliverables, using Azure OpenAI with UK-resident data processing. Built to augment human review — catches inconsistencies, suggests improvements, and enforces style guidelines."
githubUrl: "https://github.com/samcopsey/ai-peer-review"
techStack:
  - Azure OpenAI
  - Azure Functions
  - TypeScript
  - React
status: complete
featured: true
sortOrder: 1
---

An AI-powered peer review tool designed for consultancy teams delivering technical documentation and proposals. The tool processes documents through Azure OpenAI models deployed in the UK South region, ensuring data residency compliance for public sector clients.

Key design decisions included keeping all data processing within Azure UK regions, implementing a queue-based architecture for reliability, and designing the review output to augment rather than replace human reviewers.
