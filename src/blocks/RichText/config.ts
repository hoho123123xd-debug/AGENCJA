import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Tekst', plural: 'Bloki tekstu' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      // Kontrolowany zestaw formatowania (bez wklejania dowolnego HTML) —
      // edytorzy nie mogą naruszyć design systemu strony.
      editor: lexicalEditor({
        features: ({ defaultFeatures }) =>
          defaultFeatures.filter((feature) => !['upload', 'relationship'].includes(feature.key)),
      }),
    },
  ],
}
