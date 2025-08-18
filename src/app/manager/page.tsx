'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  TextInput, 
  Card, 
  CardBody, 
  CardHeader, 
  DataTable, 
  Notification,
  Spinner,
  Tabs,
  Tab,
  Form,
  FormField,
  Grid,
  Meter
} from 'grommet';
import { 
  Location, 
  Analytics, 
  User, 
  Clock, 
  Configure,
  StatusGood,
  StatusCritical
} from 'grommet-icons';
import { formatDateTime, formatHours, formatTime } from '@/utils/time';
import { formatLocation } from '@/utils/location';
import RoleGuard from '@/components/RoleGuard';
import { useAuth0 } from '@auth0/auth0-react';
import { Logout } from 'grommet-icons';

interface LocationPerimeter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
}

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
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Analytics {
  totalEntries: number;
  totalHours: number;
  averageHoursPerDay: number;
  uniqueUsersCount: number;
  dailyStats: Array<{
    date: string;
    totalHours: number;
    uniqueUsers: number;
    totalEntries: number;
  }>;
  userStats: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    totalHours: number;
    totalEntries: number;
    averageHoursPerEntry: number;
  }>;
}

const ManagerPage = () => {
  const { user: auth0User, logout } = useAuth0();
  const [activeTab, setActiveTab] = useState(0);
  const [perimeter, setPerimeter] = useState<LocationPerimeter | null>(null);
  const [activeStaff, setActiveStaff] = useState<TimeEntry[]>([]);
  const [allTimeEntries, setAllTimeEntries] = useState<TimeEntry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'critical' | 'normal'; message: string } | null>(null);

  // Perimeter form state
  const [perimeterForm, setPerimeterForm] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadPerimeter(),
      loadActiveStaff(),
      loadAllTimeEntries(),
      loadAnalytics()
    ]);
  };

  const loadPerimeter = async () => {
    try {
      const response = await fetch('/api/perimeter');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setPerimeter(data);
          setPerimeterForm({
            name: data.name,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
            radius: data.radius.toString()
          });
        }
      }
    } catch (error) {
      console.error('Error loading perimeter:', error);
    }
  };

  const loadActiveStaff = async () => {
    try {
      const response = await fetch('/api/time-entries?status=active');
      if (response.ok) {
        const data = await response.json();
        setActiveStaff(data);
      }
    } catch (error) {
      console.error('Error loading active staff:', error);
    }
  };

  const loadAllTimeEntries = async () => {
    try {
      const response = await fetch('/api/time-entries?days=7');
      if (response.ok) {
        const data = await response.json();
        setAllTimeEntries(data);
      }
    } catch (error) {
      console.error('Error loading time entries:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?days=7');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const showNotification = (type: 'critical' | 'normal', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePerimeterSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/perimeter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perimeterForm),
      });

      if (response.ok) {
        const data = await response.json();
        setPerimeter(data);
        showNotification('normal', 'Perimeter updated successfully!');
      } else {
        const error = await response.json();
        showNotification('critical', error.error || 'Failed to update perimeter');
      }
    } catch (error) {
      showNotification('critical', 'Failed to update perimeter');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await loadInitialData();
    setLoading(false);
    showNotification('normal', 'Data refreshed!');
  };

  const activeStaffColumns = [
    {
      property: 'user.name',
      header: 'Name',
      primary: true,
    },
    {
      property: 'clockInTime',
      header: 'Clock In Time',
      render: (datum: TimeEntry) => formatDateTime(new Date(datum.clockInTime)),
    },
    {
      property: 'clockInLocation',
      header: 'Clock In Location',
      render: (datum: TimeEntry) => 
        datum.clockInLat && datum.clockInLng 
          ? formatLocation({ latitude: datum.clockInLat, longitude: datum.clockInLng })
          : 'N/A',
    },
    {
      property: 'clockInNote',
      header: 'Note',
      render: (datum: TimeEntry) => datum.clockInNote || 'No note',
    },
    {
      property: 'status',
      header: 'Status',
      render: () => (
        <Box direction="row" align="center" gap="xsmall">
          <StatusGood color="status-ok" />
          <Text size="small" color="status-ok">Active</Text>
        </Box>
      ),
    },
  ];

  const timeEntriesColumns = [
    {
      property: 'user.name',
      header: 'Name',
      primary: true,
    },
    {
      property: 'clockInTime',
      header: 'Clock In',
      render: (datum: TimeEntry) => formatDateTime(new Date(datum.clockInTime)),
    },
    {
      property: 'clockOutTime',
      header: 'Clock Out',
      render: (datum: TimeEntry) => 
        datum.clockOutTime ? formatDateTime(new Date(datum.clockOutTime)) : 'Still active',
    },
    {
      property: 'totalHours',
      header: 'Total Hours',
      render: (datum: TimeEntry) => 
        datum.totalHours ? formatHours(datum.totalHours) : 'In progress',
    },
    {
      property: 'clockInLocation',
      header: 'Clock In Location',
      render: (datum: TimeEntry) => 
        datum.clockInLat && datum.clockInLng 
          ? formatLocation({ latitude: datum.clockInLat, longitude: datum.clockInLng })
          : 'N/A',
    },
  ];

  return (
    <RoleGuard allowedRole="manager">
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
          <Box direction="row" align="center" justify="between">
            <Box direction="row" align="center" gap="small">
              <Analytics color="white" />
              <Box>
                <Text size="large" weight="bold" color="white">
                  Manager Dashboard
                </Text>
                <Text size="small" color="white">
                  Care Worker Management System
                </Text>
              </Box>
            </Box>
            <Box direction="row" gap="small">
              <Button
                label="Refresh Data"
                onClick={refreshData}
                disabled={loading}
                icon={loading ? <Spinner size="small" /> : undefined}
                secondary
              />
              <Button
                icon={<Logout color="white" />}
                tip="Log Out"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                hoverIndicator
              />
            </Box>
          </Box>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs activeIndex={activeTab} onActive={setActiveTab}>
        {/* Dashboard Tab */}
        <Tab title="Dashboard">
          <Box gap="medium" margin={{ top: 'medium' }}>
            {/* Quick Stats */}
            {analytics && (
              <Grid columns={{ count: 4, size: 'auto' }} gap="medium">
                <Card>
                  <CardBody pad="medium" align="center">
                    <Text size="2xl" weight="bold" color="brand">
                      {analytics.averageHoursPerDay.toFixed(1)}
                    </Text>
                    <Text size="small">Avg Hours/Day</Text>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardBody pad="medium" align="center">
                    <Text size="2xl" weight="bold" color="brand">
                      {analytics.uniqueUsersCount}
                    </Text>
                    <Text size="small">Active Workers</Text>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardBody pad="medium" align="center">
                    <Text size="2xl" weight="bold" color="brand">
                      {activeStaff.length}
                    </Text>
                    <Text size="small">Currently Clocked In</Text>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardBody pad="medium" align="center">
                    <Text size="2xl" weight="bold" color="brand">
                      {analytics.totalHours.toFixed(1)}
                    </Text>
                    <Text size="small">Total Hours (7 days)</Text>
                  </CardBody>
                </Card>
              </Grid>
            )}

            {/* Weekly Staff Hours */}
            {analytics && analytics.userStats.length > 0 && (
              <Card>
                <CardHeader pad="medium">
                  <Text size="large" weight="bold">Weekly Hours by Staff</Text>
                </CardHeader>
                <CardBody pad="medium">
                  <Box gap="small">
                    {analytics.userStats.map((stat, index) => (
                      <Box key={stat.user.id} gap="xsmall">
                        <Box direction="row" justify="between">
                          <Text>{stat.user.name}</Text>
                          <Text weight="bold">{formatHours(stat.totalHours)}</Text>
                        </Box>
                        <Meter
                          values={[{
                            value: stat.totalHours,
                            color: index % 2 === 0 ? 'brand' : 'accent-1'
                          }]}
                          max={Math.max(...analytics.userStats.map(s => s.totalHours))}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </CardBody>
              </Card>
            )}
          </Box>
        </Tab>

        {/* Active Staff Tab */}
        <Tab title={`Active Staff (${activeStaff.length})`}>
          <Box gap="medium" margin={{ top: 'medium' }}>
            <Card>
              <CardHeader pad="medium">
                <Text size="large" weight="bold">Currently Clocked In Staff</Text>
              </CardHeader>
              <CardBody pad="none">
                {activeStaff.length > 0 ? (
                  <DataTable
                    columns={activeStaffColumns}
                    data={activeStaff}
                    size="medium"
                  />
                ) : (
                  <Box pad="medium" align="center">
                    <Text>No staff currently clocked in</Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </Box>
        </Tab>

        {/* Time Entries Tab */}
        <Tab title="Time Entries">
          <Box gap="medium" margin={{ top: 'medium' }}>
            <Card>
              <CardHeader pad="medium">
                <Text size="large" weight="bold">Recent Time Entries (Last 7 Days)</Text>
              </CardHeader>
              <CardBody pad="none">
                {allTimeEntries.length > 0 ? (
                  <DataTable
                    columns={timeEntriesColumns}
                    data={allTimeEntries}
                    size="medium"
                    paginate
                    step={10}
                  />
                ) : (
                  <Box pad="medium" align="center">
                    <Text>No time entries found</Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </Box>
        </Tab>

        {/* Settings Tab */}
        <Tab title="Settings">
          <Box gap="medium" margin={{ top: 'medium' }}>
            <Card>
              <CardHeader pad="medium">
                <Box direction="row" align="center" gap="small">
                  <Configure />
                  <Text size="large" weight="bold">Location Perimeter Settings</Text>
                </Box>
              </CardHeader>
              <CardBody pad="medium">
                <Form
                  value={perimeterForm}
                  onChange={setPerimeterForm}
                  onSubmit={handlePerimeterSubmit}
                >
                  <FormField label="Location Name" name="name" required>
                    <TextInput name="name" placeholder="e.g., Main Office" />
                  </FormField>
                  
                  <FormField label="Latitude" name="latitude" required>
                    <TextInput 
                      name="latitude" 
                      placeholder="e.g., 40.7128" 
                      type="number"
                      step="any"
                    />
                  </FormField>
                  
                  <FormField label="Longitude" name="longitude" required>
                    <TextInput 
                      name="longitude" 
                      placeholder="e.g., -74.0060" 
                      type="number"
                      step="any"
                    />
                  </FormField>
                  
                  <FormField label="Radius (km)" name="radius" required>
                    <TextInput 
                      name="radius" 
                      placeholder="e.g., 2" 
                      type="number"
                      step="0.1"
                      min="0.1"
                    />
                  </FormField>
                  
                  <Box direction="row" gap="medium" margin={{ top: 'medium' }}>
                    <Button
                      type="submit"
                      primary
                      label={loading ? "Updating..." : "Update Perimeter"}
                      disabled={loading}
                      icon={loading ? <Spinner size="small" /> : <Location />}
                    />
                  </Box>
                </Form>

                {perimeter && (
                  <Box margin={{ top: 'medium' }} pad="medium" background="light-2" round="small">
                    <Text weight="bold" margin={{ bottom: 'small' }}>Current Perimeter:</Text>
                    <Text size="small">Name: {perimeter.name}</Text>
                    <Text size="small">Location: {formatLocation({ latitude: perimeter.latitude, longitude: perimeter.longitude })}</Text>
                    <Text size="small">Radius: {perimeter.radius}km</Text>
                  </Box>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader pad="medium">
                <Text size="large" weight="bold">Instructions</Text>
              </CardHeader>
              <CardBody pad="medium">
                <Box gap="small">
                  <Text size="small">
                    • Set the location perimeter to define where care workers can clock in
                  </Text>
                  <Text size="small">
                    • Use latitude and longitude coordinates for the center point
                  </Text>
                  <Text size="small">
                    • Radius defines the allowed area around the center point in kilometers
                  </Text>
                  <Text size="small">
                    • Care workers must be within this area to successfully clock in
                  </Text>
                  <Text size="small">
                    • You can find coordinates using Google Maps or similar services
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Tab>
      </Tabs>
      </Box>
      </div>
    </RoleGuard>
  );
};

export default ManagerPage;