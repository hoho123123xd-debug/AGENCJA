import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type RichTextBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'richText' }>

export const RichTextBlockComponent = ({ content }: RichTextBlockProps) => (
  <section data-block="richText">
    <LexicalRichText data={content} />
  </section>
)
