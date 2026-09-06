/* Ten plik jest generowany/utrzymywany zgodnie z konwencją Payload dla Next.js. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.css'

// UWAGA: `generatePayloadViewport` z oficjalnego szablonu Cloudflare (main)
// NIE istnieje w opublikowanych paczkach @payloadcms/next (sprawdzone na
// 3.82.1 i najnowszej 3.88.0 — eksportowane jest tylko `metadata`,
// `RootLayout`, `handleServerFunctions`). Szablon na GitHub jest w tym
// miejscu niespójny z tym, co faktycznie opublikowano na npm — pomijamy
// customowy viewport, Next.js użyje bezpiecznych wartości domyślnych.

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
