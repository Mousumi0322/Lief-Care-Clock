// Mock data service for testing without database
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'CARE_WORKER';
  createdAt: Date;
}

export interface LocationPerimeter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  clockInTime: Date;
  clockInLat?: number;
  clockInLng?: number;
  clockInNote?: string;
  clockOutTime?: Date;
  clockOutLat?: number;
  clockOutLng?: number;
  clockOutNote?: string;
  totalHours?: number;
  createdAt: Date;
  user: User;
}

// Mock data storage
const users: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'CARE_WORKER',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'CARE_WORKER',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'manager-1',
    name: 'Mike Manager',
    email: 'mike.manager@example.com',
    role: 'MANAGER',
    createdAt: new Date('2024-01-01'),
  },
];

const perimeters: LocationPerimeter[] = [
  {
    id: 'perimeter-1',
    name: 'Main Office',
    latitude: 51.5074,
    longitude: -0.1278,
    radius: 2.0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];

const timeEntries: TimeEntry[] = [
  {
    id: 'entry-1',
    userId: 'user-1',
    clockInTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 2 days ago, 9 AM
    clockInLat: 51.5074,
    clockInLng: -0.1278,
    clockInNote: 'Starting morning shift',
    clockOutTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 2 days ago, 5 PM
    clockOutLat: 51.5074,
    clockOutLng: -0.1278,
    clockOutNote: 'End of shift',
    totalHours: 8.0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    user: users[0],
  },
  {
    id: 'entry-2',
    userId: 'user-2',
    clockInTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Yesterday, 8 AM
    clockInLat: 51.5074,
    clockInLng: -0.1278,
    clockInNote: 'Early start today',
    clockOutTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // Yesterday, 4 PM
    clockOutLat: 51.5074,
    clockOutLng: -0.1278,
    clockOutNote: 'Finished early',
    totalHours: 8.0,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: users[1],
  },
];

// Mock API functions
export const mockApi = {
  // Users
  getUsers: async (role?: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    return role ? users.filter(u => u.role === role) : users;
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },

  // Perimeters
  getActivePerimeter: async (): Promise<LocationPerimeter | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return perimeters.find(p => p.isActive) || null;
  },

  createPerimeter: async (perimeterData: Omit<LocationPerimeter, 'id' | 'createdAt' | 'isActive'>): Promise<LocationPerimeter> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Deactivate existing perimeters
    perimeters.forEach(p => p.isActive = false);
    
    const newPerimeter: LocationPerimeter = {
      ...perimeterData,
      id: `perimeter-${Date.now()}`,
      isActive: true,
      createdAt: new Date(),
    };
    perimeters.push(newPerimeter);
    return newPerimeter;
  },

  // Time Entries
  getTimeEntries: async (filters: {
    userId?: string;
    status?: 'active' | 'completed';
    days?: number;
  } = {}): Promise<TimeEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...timeEntries];
    
    if (filters.userId) {
      filtered = filtered.filter(entry => entry.userId === filters.userId);
    }
    
    if (filters.status === 'active') {
      filtered = filtered.filter(entry => !entry.clockOutTime);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(entry => entry.clockOutTime);
    }
    
    if (filters.days) {
      const cutoffDate = new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(entry => entry.clockInTime >= cutoffDate);
    }
    
    return filtered.sort((a, b) => b.clockInTime.getTime() - a.clockInTime.getTime());
  },

  createTimeEntry: async (entryData: {
    userId: string;
    latitude?: number;
    longitude?: number;
    note?: string;
  }): Promise<TimeEntry> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if user is already clocked in
    const existingEntry = timeEntries.find(entry => 
      entry.userId === entryData.userId && !entry.clockOutTime
    );
    
    if (existingEntry) {
      throw new Error('User is already clocked in');
    }
    
    const user = users.find(u => u.id === entryData.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}`,
      userId: entryData.userId,
      clockInTime: new Date(),
      clockInLat: entryData.latitude,
      clockInLng: entryData.longitude,
      clockInNote: entryData.note,
      createdAt: new Date(),
      user,
    };
    
    timeEntries.push(newEntry);
    return newEntry;
  },

  updateTimeEntry: async (entryId: string, updateData: {
    latitude?: number;
    longitude?: number;
    note?: string;
  }): Promise<TimeEntry> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const entryIndex = timeEntries.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) {
      throw new Error('Time entry not found');
    }
    
    const entry = timeEntries[entryIndex];
    if (entry.clockOutTime) {
      throw new Error('User is already clocked out');
    }
    
    const clockOutTime = new Date();
    const totalHours = (clockOutTime.getTime() - entry.clockInTime.getTime()) / (1000 * 60 * 60);
    
    const updatedEntry: TimeEntry = {
      ...entry,
      clockOutTime,
      clockOutLat: updateData.latitude,
      clockOutLng: updateData.longitude,
      clockOutNote: updateData.note,
      totalHours,
    };
    
    timeEntries[entryIndex] = updatedEntry;
    return updatedEntry;
  },

  // Analytics
  getAnalytics: async (days: number = 7) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const relevantEntries = timeEntries.filter(entry => 
      entry.clockInTime >= cutoffDate && entry.clockOutTime && entry.totalHours
    );
    
    const totalHours = relevantEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    const uniqueUsers = new Set(relevantEntries.map(entry => entry.userId)).size;
    
    // Group by day
    const dailyGroups: { [key: string]: TimeEntry[] } = {};
    relevantEntries.forEach(entry => {
      const date = entry.clockInTime.toISOString().split('T')[0];
      if (!dailyGroups[date]) {
        dailyGroups[date] = [];
      }
      dailyGroups[date].push(entry);
    });
    
    const dailyStats = Object.entries(dailyGroups).map(([date, entries]) => ({
      date,
      totalHours: entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0),
      uniqueUsers: new Set(entries.map(entry => entry.userId)).size,
      totalEntries: entries.length,
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Group by user
    const userGroups: { [key: string]: TimeEntry[] } = {};
    relevantEntries.forEach(entry => {
      if (!userGroups[entry.userId]) {
        userGroups[entry.userId] = [];
      }
      userGroups[entry.userId].push(entry);
    });
    
    const userStats = Object.entries(userGroups).map(([userId, entries]) => ({
      user: entries[0].user,
      totalHours: entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0),
      totalEntries: entries.length,
      averageHoursPerEntry: entries.length > 0 
        ? entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0) / entries.length 
        : 0,
    })).sort((a, b) => b.totalHours - a.totalHours);
    
    return {
      totalEntries: relevantEntries.length,
      totalHours,
      averageHoursPerDay: days > 0 ? totalHours / days : 0,
      uniqueUsersCount: uniqueUsers,
      dailyStats,
      userStats,
    };
  },
};