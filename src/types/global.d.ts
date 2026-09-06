// Payload dostarcza gotowe arkusze stylów panelu admina jako surowe pliki
// .css importowane efektem ubocznym (`import '@payloadcms/next/css'`).
// Next.js/webpack obsługuje to natywnie w buildzie; `tsc` potrzebuje
// jedynie deklaracji ambient, żeby nie zgłaszać braku typów (TS2882).
declare module '@payloadcms/next/css'
declare module '*.css'
