import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/mockData';

// GET - Get time entries with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') as 'active' | 'completed' | undefined;
    const days = searchParams.get('days');

    const filters: { userId?: string; status?: 'active' | 'completed'; days?: number } = {};
    
    if (userId) filters.userId = userId;
    if (status) filters.status = status;
    if (days) filters.days = parseInt(days);

    const timeEntries = await mockApi.getTimeEntries(filters);
    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

// POST - Create new time entry (clock in)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, latitude, longitude, note } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const timeEntry = await mockApi.createTimeEntry({
      userId,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      note: note || undefined
    });

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create time entry';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}