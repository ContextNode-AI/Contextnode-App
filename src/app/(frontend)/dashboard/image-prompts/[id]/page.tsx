import React from 'react'
import { ImagePromptEditView } from '@/components/admin/views/ImagePromptEditView'

export const metadata = {
  title: 'Edit Image Prompt — ContextNode Creator OS',
  description: 'Edit AI image generation prompt parameters and variations',
}

export default async function ImagePromptEditPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params)
  return <ImagePromptEditView params={resolvedParams} />
}

