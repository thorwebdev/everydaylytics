# EveryDayLytics - A Deno Fresh + Supabase project

This project showcases how to use Supabase [Auth](https://supabase.com/auth),
[Database](https://supabase.com/database) within
[Deno Fresh](https://fresh.deno.dev/).

### Auth approach

This App uses the
[`@supabase/auth-helpers-shared`](https://github.com/supabase/auth-helpers/releases/tag/%40supabase%2Fauth-helpers-shared%400.4.0)
package to faciliatet server-side auth with cookies.

This works by implementing a `CookieAuthStorageAdapter` in
[/utils/supabase.ts](/utils/supabase.ts) which you can copy to your own Deno
Fresh Application to make server-side auth work.

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
