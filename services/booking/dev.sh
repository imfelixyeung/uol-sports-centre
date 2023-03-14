#!/bin/sh

# prepare the dev database
pnpm db:push
pnpm seed

# Start prisma studio
pnpm exec prisma studio &


# Start the dev server
pnpm run dev
