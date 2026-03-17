---
title: "ADO MCP Server"
description: "Azure DevOps MCP server with Streamable HTTP transport for Microsoft Foundry. 45 tools across 5 ADO domains — core, work items, work, repositories, and wiki — with OAuth Identity Passthrough and JWT validation."
githubUrl: "https://github.com/samcopsey/ado-mcp-server"
blogPost: "cast-part-5-mcp-expansion"
techStack:
  - Python
  - FastMCP
  - Azure DevOps REST API
  - Docker
  - Azure Container Apps
  - OAuth / JWT
status: active
featured: true
sortOrder: 1
---

A custom MCP server that exposes Azure DevOps functionality over Streamable HTTP, designed for Microsoft Foundry's MCP connection model with OAuth Identity Passthrough. Each user authenticates with their own ADO credentials. No shared service account.

Built because the official `@azure-devops/mcp` remote server doesn't yet support Foundry, Claude Desktop, or Claude Code. This server adds ad-hoc WIQL queries, pre-calculated capacity fields, and runs on your own infrastructure via Container Apps. 45 tools across core, work items, work, repositories, and wiki domains, with 123 unit tests, an error handling decorator, and optional JWT validation middleware.

Self hosting on Container Apps in UK South also means all ADO API traffic stays within your Azure tenant and chosen region. No organisational data leaves UK data centres. A practical example of data sovereignty through infrastructure ownership rather than vendor trust.
