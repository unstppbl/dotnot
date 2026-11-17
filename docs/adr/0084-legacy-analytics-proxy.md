---
status: accepted
---

# Isolate legacy analytics infrastructure

This inherited decision record documents the removal of an unrelated analytics
reverse proxy from the application's Worker. The proxy is not a Dotnot feature,
and this fork has no analytics proxy deployment to maintain.

Analytics for another service belongs in a separate Worker, with its own
configuration, hostname, secrets, and release lifecycle. Application deployment
must not claim an unrelated hostname or depend on that service's availability.

Historical hostname transfers and ingestion checks are not evidence of a live
Dotnot deployment. Any future analytics integration requires its own design and
deployment configuration.
