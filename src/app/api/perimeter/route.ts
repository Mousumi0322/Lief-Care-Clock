import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/mockData';

// GET - Get active perimeter
export async function GET() {
  try {
    const perimeter = await mockApi.getActivePerimeter();
    return NextResponse.json(perimeter);
  } catch (error) {
    console.error('Error fetching perimeter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch perimeter' },
      { status: 500 }
    );
  }
}

// POST - Create or update perimeter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, latitude, longitude, radius } = body;

    // Validate required fields
    if (!name || !latitude || !longitude || !radius) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const perimeter = await mockApi.createPerimeter({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
    });

    return NextResponse.json(perimeter);
  } catch (error) {
    console.error('Error creating perimeter:', error);
    return NextResponse.json(
      { error: 'Failed to create perimeter' },
      { status: 500 }
    );
  }
}