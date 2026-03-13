---
title: "Cast — AI DevOps Agent"
description: "A multi-agent system built on Microsoft Agent Framework and Microsoft Foundry that assists engineering teams with Azure DevOps management, sprint planning, work item discovery, and document generation."
githubUrl: "https://github.com/samcopsey/cast-ado-agent"
blogPost: "cast-part-1-vision-and-architecture"
techStack:
  - Microsoft Agent Framework
  - Microsoft Foundry
  - Python
  - PostgreSQL + pgvector
  - Terraform
  - MCP
  - Azure Container Apps
status: active
featured: true
sortOrder: 0
---

Cast is an AI-powered engineering management assistant that connects to Azure DevOps via MCP and helps teams with sprint planning, work item tracking, and project documentation. Built as a multi-agent system — an orchestrator routes user intent to specialist sub-agents for ADO discovery, document generation, and more.

The infrastructure runs entirely in Azure UK South, provisioned with Terraform. PostgreSQL Flexible Server with pgvector handles both relational data and vector similarity search in a single service. The full build is documented as an open-source series on this blog.
