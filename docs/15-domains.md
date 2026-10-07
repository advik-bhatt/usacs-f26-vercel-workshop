# 15 · Custom Domains

**Time:** ~3 min (talk-through)

Every project gets a free `*.vercel.app` domain. To use your own:

1. Project → **Settings → Domains** → **Add** → `usacs.example.com`.
2. Vercel shows the DNS record to create at your registrar (a `CNAME` for a
   subdomain, or an `A` record for an apex domain), or you can point your
   nameservers to Vercel.
3. SSL certificates are issued and renewed automatically.

From the CLI:

```bash
npx vercel domains add usacs.example.com
npx vercel domains list
npx vercel alias set <deployment-url> usacs.example.com   # point a domain at a specific deployment
```

Tricks:

- **Redirect `www` ↔ apex:** add both and set one to redirect to the other.
- **Branch domains:** assign `staging.example.com` to a Git branch so it always
  serves that branch's latest preview.
- **Buy a domain** directly in the dashboard (Domains tab).

> 🎓 Students: the GitHub Student Developer Pack has historically included free
> domains from partner registrars. Check the current offers.

Next: **[16 · Beyond →](16-beyond.md)**
