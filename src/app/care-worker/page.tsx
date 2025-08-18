'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Text, TextArea, Notification, Spinner, Card, CardBody, CardHeader } from 'grommet';
import { Clock, Location, User, Calendar, Logout } from 'grommet-icons';
import { getCurrentLocation, isWithinPerimeter, formatLocation, type Location as LocationType, type LocationPerimeter } from '@/utils/location';
import { formatDateTime, formatTime, formatHours } from '@/utils/time';
import RoleGuard from '@/components/RoleGuard';
import { useAuth0 } from '@auth0/auth0-react';

interface TimeEntry {
  id: string;
  clockInTime: string;
  clockInLat?: number;
  clockInLng?: number;
  clockInNote?: string;
  clockOutTime?: string;
  clockOutLat?: number;
  clockOutLng?: number;
  clockOutNote?: string;
  totalHours?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const CareWorkerPage = () => {
  const { user: auth0User, logout } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | null>(null);
  const [perimeter, setPerimeter] = useState<LocationPerimeter | null>(null);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'critical' | 'normal'; message: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Use Auth0 user or fallback to mock user
  useEffect(() => {
    if (auth0User) {
      // Use Auth0 user information
      const user = {
        id: auth0User.sub || 'user-1',
        name: auth0User.name || 'User',
        email: auth0User.email || 'user@example.com'
      };
      setCurrentUser(user);
      
      // Load initial data
      loadPerimeter();
      loadCurrentTimeEntry(user.id);
    } else {
      // Fallback to mock user for development
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@example.com'
      };
      setCurrentUser(mockUser);
      
      // Load initial data
      loadPerimeter();
      loadCurrentTimeEntry(mockUser.id);
    }
  }, [auth0User]);

  const loadPerimeter = async () => {
    try {
      const response = await fetch('/api/perimeter');
      if (response.ok) {
        const data = await response.json();
        setPerimeter(data);
      }
    } catch (error) {
      console.error('Error loading perimeter:', error);
    }
  };

  const loadCurrentTimeEntry = async (userId: string) => {
    try {
      const response = await fetch(`/api/time-entries?userId=${userId}&status=active`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCurrentTimeEntry(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading current time entry:', error);
    }
  };

  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      return location;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown location error';
      showNotification('critical', `Location error: ${errorMessage}`);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const showNotification = (type: 'critical' | 'normal', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleClockIn = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Get current location
      const location = await getUserLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      // Check if within perimeter
      if (perimeter && !isWithinPerimeter(location, perimeter)) {
        showNotification('critical', `You must be within ${perimeter.radius}km of ${perimeter.name} to clock in`);
        setLoading(false);
        return;
      }

      // Clock in
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          latitude: location.latitude,
          longitude: location.longitude,
          note: note.trim() || null
        }),
      });

      if (response.ok) {
        const timeEntry = await response.json();
        setCurrentTimeEntry(timeEntry);
        setNote('');
        showNotification('normal', 'Successfully clocked in!');
      } else {
        const error = await response.json();
        showNotification('critical', error.error || 'Failed to clock in');
      }
    } catch (error) {
      showNotification('critical', 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentUser || !currentTimeEntry) return;

    setLoading(true);
    try {
      // Get current location
      const location = await getUserLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      // Clock out
      const response = await fetch(`/api/time-entries/${currentTimeEntry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          note: note.trim() || null
        }),
      });

      if (response.ok) {
        const updatedTimeEntry = await response.json();
        setCurrentTimeEntry(null);
        setNote('');
        showNotification('normal', `Successfully clocked out! Total time: ${formatHours(updatedTimeEntry.totalHours)}`);
      } else {
        const error = await response.json();
        showNotification('critical', error.error || 'Failed to clock out');
      }
    } catch (error) {
      showNotification('critical', 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const getElapsedTime = () => {
    if (!currentTimeEntry) return '0h 0m';
    
    const clockInTime = new Date(currentTimeEntry.clockInTime);
    const now = new Date();
    const diffInMs = now.getTime() - clockInTime.getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!currentUser) {
    return (
      <Box align="center" justify="center" pad="large">
        <Spinner size="medium" />
        <Text margin={{ top: 'small' }}>Loading...</Text>
      </Box>
    );
  }

  return (
    <RoleGuard allowedRole="care-worker">
      <div style={{ minHeight: '100vh' }}>
        <Box pad="medium" gap="medium" background="light-1">
        {notification && (
        <Notification
          toast
          status={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <Card>
        <CardHeader pad="medium" background="brand">
          <Box direction="row" align="center" justify="between" fill="horizontal">
            <Box direction="row" align="center" gap="small">
              <User color="white" />
              <Box>
                <Text size="large" weight="bold" color="white">
                  Welcome, {currentUser.name}
                </Text>
                <Text size="small" color="white">
                  Care Worker Dashboard
                </Text>
              </Box>
            </Box>
            <Button
              icon={<Logout color="white" />}
              tip="Log Out"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              hoverIndicator
            />
          </Box>
        </CardHeader>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader pad="medium">
          <Text size="large" weight="bold">Current Status</Text>
        </CardHeader>
        <CardBody pad="medium">
          <Box gap="small">
            <Box direction="row" align="center" gap="small">
              <Clock />
              <Text>Current Time: {formatTime(currentTime, true)}</Text>
            </Box>
            
            {currentTimeEntry ? (
              <Box gap="small" background="status-ok" pad="small" round="small">
                <Text weight="bold" color="white">✓ CLOCKED IN</Text>
                <Text color="white">Since: {formatDateTime(new Date(currentTimeEntry.clockInTime))}</Text>
                <Text color="white">Elapsed: {getElapsedTime()}</Text>
                {currentTimeEntry.clockInNote && (
                  <Text color="white">Note: {currentTimeEntry.clockInNote}</Text>
                )}
              </Box>
            ) : (
              <Box background="status-critical" pad="small" round="small">
                <Text weight="bold" color="white">⏸ NOT CLOCKED IN</Text>
              </Box>
            )}
          </Box>
        </CardBody>
      </Card>

      {/* Location Status */}
      {perimeter && (
        <Card>
          <CardHeader pad="medium">
            <Text size="large" weight="bold">Location Status</Text>
          </CardHeader>
          <CardBody pad="medium">
            <Box gap="small">
              <Box direction="row" align="center" gap="small">
                <Location />
                <Text>Work Location: {perimeter.name}</Text>
              </Box>
              <Text size="small">
                Allowed within {perimeter.radius}km radius
              </Text>
              
              {userLocation && (
                <Box gap="small">
                  <Text size="small">
                    Your Location: {formatLocation(userLocation)}
                  </Text>
                  <Box
                    background={isWithinPerimeter(userLocation, perimeter) ? "status-ok" : "status-critical"}
                    pad="small"
                    round="small"
                  >
                    <Text color="white" weight="bold">
                      {isWithinPerimeter(userLocation, perimeter) 
                        ? "✓ Within allowed area" 
                        : "✗ Outside allowed area"}
                    </Text>
                  </Box>
                </Box>
              )}
              
              <Button
                label={locationLoading ? "Getting Location..." : "Check Location"}
                onClick={getUserLocation}
                disabled={locationLoading}
                icon={locationLoading ? <Spinner size="small" /> : <Location />}
                size="small"
              />
            </Box>
          </CardBody>
        </Card>
      )}

      {/* Clock In/Out Section */}
      <Card>
        <CardHeader pad="medium">
          <Text size="large" weight="bold">
            {currentTimeEntry ? 'Clock Out' : 'Clock In'}
          </Text>
        </CardHeader>
        <CardBody pad="medium">
          <Box gap="medium">
            <TextArea
              placeholder={`Add an optional note for ${currentTimeEntry ? 'clock out' : 'clock in'}...`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
            />
            
            <Button
              primary
              size="large"
              label={
                loading 
                  ? (currentTimeEntry ? "Clocking Out..." : "Clocking In...") 
                  : (currentTimeEntry ? "Clock Out" : "Clock In")
              }
              onClick={currentTimeEntry ? handleClockOut : handleClockIn}
              disabled={loading || locationLoading}
              icon={loading ? <Spinner size="small" /> : <Clock />}
              color={currentTimeEntry ? "status-critical" : "status-ok"}
            />
          </Box>
        </CardBody>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader pad="medium">
          <Text size="large" weight="bold">Instructions</Text>
        </CardHeader>
        <CardBody pad="medium">
          <Box gap="small">
            <Text size="small">
              • Make sure location services are enabled in your browser
            </Text>
            <Text size="small">
              • You must be within the designated work area to clock in
            </Text>
            <Text size="small">
              • You can add optional notes when clocking in or out
            </Text>
            <Text size="small">
              • Your location will be recorded for each clock in/out
            </Text>
          </Box>
        </CardBody>
      </Card>
      </Box>
    </div>
    </RoleGuard>
  );
};

export default CareWorkerPage;