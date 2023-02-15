# EveryDayLytics - A Deno Fresh + Supabase project

This project showcases how to use Supabase [Auth](https://supabase.com/auth),
[Database](https://supabase.com/database) within
[Deno Fresh](https://fresh.deno.dev/).

### Auth approach

Supabase Auth was originially built for JAMstack sites and therefore heavily
relies on client-side JavaScript. The Deno Fresh framework tries to minimise the
amount of client-side JavaScript used, and therefore I've landed on the
following approach, which I think is the best solution currently until Supabase
ships [PKCE](https://supabase.com/docs/guides/resources/glossary#pkce)
([WIP here](https://github.com/supabase/gotrue/pull/891))

- Our [Auth UI](./islands/SignUpOrIn.tsx) uses
  [HTML forms](https://fresh.deno.dev/docs/getting-started/form-submissions)
  that make POST requests to an
  [auth API route](./routes/api/auth/%5Bauth%5D.ts).
- The [auth API route](./routes/api/auth/%5Bauth%5D.ts) utilises a
  [supabase-js server-client](./utils/supabase.ts) implementation where the
  storage layer (normally using localStorage) is replaced with cookies.
- We use a [middleware handler](./routes/_middleware.ts) that uses the
  [supabase-js server-client](./utils/supabase.ts) to get the Session from the
  cookie and attach it to the `ctx.state` to make it available throughout our
  application, e.g. in our [index route](./routes/index.tsx).
  - This middleware also automatically refreshes our access token when it is
    expired, allowing the user to be logged in indefinitely until they choose to
    sign out.
- For OAuth we use a dedicated
  [OAuth return route](./routes/supa-oauth-redirect-return.tsx) that uses an
  [AuthFragmentCatcher island component](./islands/AuthFragmentCatcher.tsx) with
  a supabase-js browser client, to detect the session information in the
  fragement in the URL and set it as a cookie.

I beleive this is currently the most robust approach for server-side rendered
applications. Feel free to open issues with questions or suggestions. Thanks.

### Usage

Start the project:

```
supabase start
deno task start
```

This will watch the project directory and restart as necessary.

### Generating Database Types

If you change the database schema, you will need to run this to update the
database types used with supabase-js.

```bash
supabase start
supabase gen types typescript --local > types/database.types.ts
```
