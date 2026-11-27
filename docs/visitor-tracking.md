# Private visit notifications

The existing Cloudflare Pages Function at `/api/visit` uses `request.cf` for network organization, ASN, approximate city, region, country and timezone. Discord receives the olive-accent embed with masked IPv4/IPv6, a city-only Google Maps link, readable browser/OS/device, pathname, referring website and America/Toronto timestamp. Missing metadata is shown as unknown. Network organizations can identify ISPs, VPNs or cloud hosts; they do not prove a visitor's identity or employer. No external IP lookup service is used.

## Cloudflare configuration

Only the existing variables are used:

- `DISCORD_WEBHOOK_URL`: keep this as a server-side secret in the Pages project's Settings > Variables and Secrets. Never prefix it with `VITE_` or put it in frontend code.
- `IGNORED_VISITOR_IPS`: the existing comma-separated owner-IP exclusion list. IPv4 and normalized IPv6 addresses are supported.

No database, additional secret, binding, schema or infrastructure is required. If you previously added a visitor database binding or hashing secret for the earlier implementation, they can be removed from the Pages project; this code does not read them. Do not delete a database used by anything else. The code does not change dashboard configuration automatically.

Configure production and preview separately if needed. Without the webhook, the endpoint returns 503 silently and the portfolio continues working. Cloudflare populates `request.cf` on live requests; local Vite preview does not provide that metadata. No routing or build configuration changes are required.

## Lightweight spam protection and limitations

- Client-side in-memory deduplication suppresses repeated path notifications for 60 seconds, including React StrictMode effect replay and component remounts. New paths still track; no tracking cookie or persistent visitor identifier is added.
- Each running Function instance suppresses duplicate normalized-IP/path notifications for 60 seconds, admits at most five notifications per IP per 60-second window, and admits at most 30 total per 60-second window. Windows start with their first request and are not rolling windows. Duplicate or rejected visits do not consume a notification slot. Visitors sharing an IP may be grouped together.
- State is bounded to 1,024 visitor entries and 1,024 IP/path entries. Entries expire after 60 seconds and are removed on the next tracking request. Expired entries can remain in idle memory until another request arrives; all state disappears when the instance is discarded. There is no persistent visitor storage in the application.
- **Limits are best effort per instance, not global.** Separate Cloudflare instances/locations have independent counters; cold starts reset them. Requests hitting another instance, IP rotation, and distributed automated traffic can bypass suppression. This protects a small portfolio webhook but does not guarantee protection against sustained abuse or infrastructure traffic costs.
- Basic user-agent filtering and Cloudflare's verified-bot flag, when available, skip obvious bots. This is not complete bot detection. Same-origin checks and the 4 KB JSON body limit are retained; origin headers are not authentication.
- Discord delivery has a five-second timeout and no automatic retries. An HTTP 429 pauses that instance's sends using Retry-After seconds (default 60, bounded to 1-300). Other delivery failures pause it for ten seconds. Cooldowns are also instance-local. Delivery is best effort, not exactly once, and failures do not affect page rendering.

## Privacy

Only the secret Discord webhook receives an external request. Raw IPs are used temporarily in server memory for exclusion and spam checks; Discord receives only the masked version. Query strings and fragments are omitted, referrers are reduced to website origin, and raw user agents are replaced with readable labels. Maps is not contacted during tracking: the link contains city-level location text only and opens when clicked by the notification recipient.

Discord notifications remain in the owner's private channel until manually deleted; the site does not automatically expire them. Restrict channel access and delete older notifications regularly. Cloudflare and Discord processing is subject to their respective policies.

## Verification

Run `npm test` and `npm run build`. Visitor tests exercise in-memory duplicate suppression, expiration, budgets, cooldowns, IP masking, client parsing, owner exclusions, bot checks, invalid requests, metadata formatting and unavailable Discord. Discord is mocked so tests send no real notifications. After a separately authorized deployment, verify a live visit from a non-excluded IP and inspect Cloudflare metadata in the embed. No commit, push or deployment is part of these changes.
