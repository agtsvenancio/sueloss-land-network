<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep each public content page in its own top-level TanStack route with unique leaf metadata; shared chrome belongs in the root shell so navigation and locale remain consistent.
- Use the shared language provider and explicit PT/EN/ES content tuples for all user-facing copy so locale switching stays client-safe and SSR defaults to Portuguese.
- Keep profile intake validation in a client-safe Zod module reused by the public server function; store leads only through the privileged, insert-only database function so visitors cannot read confidential submissions.
- Use generated local photography and bundled Natural Earth country geometry for media and cartography so no third-party image hotlinks are needed.
- Leave unavailable company contact details and identities as explicit placeholders in the central shell configuration; never invent business information.
