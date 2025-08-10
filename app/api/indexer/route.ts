import { startIndexer, stopIndexer } from '@/app/indexer'
import { NextResponse } from 'next/server'

// GET /api/indexer - Starts the indexer
export async function GET() {
  try {
    // First, ensure any old instance is stopped
    await stopIndexer()
    // Then, start a fresh instance
    await startIndexer()
    return NextResponse.json({ status: 'Indexer stopped and restarted successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to start indexer', details: errorMessage }, { status: 500 })
  }
}

// DELETE /api/indexer - Stops the indexer
export async function DELETE() {
    try {
        await stopIndexer()
        return NextResponse.json({ status: 'Indexer stopped successfully' })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: 'Failed to stop indexer', details: errorMessage }, { status: 500 })
    }
}
