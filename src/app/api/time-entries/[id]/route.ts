import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/mockData';

// PATCH - Update time entry (clock out)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { latitude, longitude, note } = body;
    const { id } = await params;

    const updatedTimeEntry = await mockApi.updateTimeEntry(id, {
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      note: note || undefined
    });

    return NextResponse.json(updatedTimeEntry);
  } catch (error) {
    console.error('Error updating time entry:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update time entry';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Time entry not found' ? 404 : 400 }
    );
  }
}