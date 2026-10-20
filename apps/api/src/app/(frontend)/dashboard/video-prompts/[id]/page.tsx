import React from 'react'
import { VideoPromptEditView } from '@/components/admin/views/VideoPromptEditView'

export const metadata = {
  title: 'Edit Video Prompt — ContextNode Creator OS',
  description: 'Edit AI video generation prompt parameters and scene storyboards',
}

export default async function VideoPromptEditPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  return <VideoPromptEditView params={resolvedParams} />
}

