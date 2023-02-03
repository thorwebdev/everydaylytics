# EveryDayLytics - A Deno Fresh + Supabase project

This project showcases how to use Supabase [Auth](https://supabase.com/auth),
[Database](https://supabase.com/database) within
[Deno Fresh](https://fresh.deno.dev/).

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
