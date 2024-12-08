import React, { useEffect, useState } from 'react';
import { Grid, Card, Container, styled, Typography, Box, keyframes } from '@mui/material';
import { Vehicle, MapState, mapService } from '../services/mapService';
import { useScenario } from '../context/ScenarioContext';
import NoScenarioOverlay from '../components/NoScenarioOverlay';

// Import all vehicle images with exact filenames as they are in the assets directory
const vehicleImages = {
  'Tesla Model 3': require('../assets/Tesla_Model_3.png'),
  'Tesla Model S': require('../assets/Tesla_Model_S.png'),
  'Tesla Model Y': require('../assets/Tesla_Model_Y.png'),
  'Nissan Leaf': require('../assets/Nissan_Leaf.png'),
  'Ford Mustang Mach-E': require('../assets/Ford_Mustang_Mach-E.png'),
  'Audi e-tron': require('../assets/Audi_E-Tron.png'),
  'Jaguar I-PACE': require('../assets/Jaguar-I-PACE.png'),
  'Porsche Taycan': require('../assets/Porsche-Taycan.png'),
};

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'white',
  height: '100%',
  borderRadius: '15px',
  overflow: 'auto',
  padding: theme.spacing(2),
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.1)',
}));

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '200px',
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
}));

const CarImage = styled('img')({
  width: '80px',
  height: 'auto',
  objectFit: 'contain',
});

const StatusDot = styled('div')<{ status: 'idle' | 'cust' | 'dest' }>(({ status, theme }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  position: 'absolute',
  top: '16px',
  right: '16px',
  animation: `${pulse} 2s infinite`,
  backgroundColor: status === 'idle' 
    ? '#4CAF50' // green for idle
    : status === 'cust' 
    ? '#FFC107' // yellow for customer pickup
    : '#2196F3', // blue for destination
}));

const getStatusText = (status: 'idle' | 'cust' | 'dest'): string => {
  switch (status) {
    case 'idle': return 'Available';
    case 'cust': return 'Picking up customer';
    case 'dest': return 'En route to destination';
  }
};

const Fleet = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const { scenarioId } = useScenario();
  
  useEffect(() => {
    if (!scenarioId) return;

    const fetchVehicles = async () => {
      try {
        const state = await mapService.getMapState(scenarioId);
        if (state.status === 'error') {
          setErrorCount(prev => prev + 1);
          console.warn('Vehicle state update failed:', state.message);
        } else {
          setErrorCount(0);
          setVehicles(state.vehicles);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setErrorCount(prev => prev + 1);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 2000);
    return () => clearInterval(interval);
  }, [scenarioId]);

  const getVehicleImage = (vehicleName: string) => {
    try {
      // First try the predefined mapping
      const image = vehicleImages[vehicleName as keyof typeof vehicleImages];
      if (image) return image;

      // If not in mapping, try to load dynamically
      const fileName = vehicleName
        .replace(/\s+/g, '_')  // Replace spaces with underscores
        .replace('e-tron', 'E-Tron')  // Handle special cases
        .replace('I-PACE', '-I-PACE')
        .replace('Taycan', '-Taycan');
      
      return require(`../assets/${fileName}.png`);
    } catch (error) {
      console.warn(`Could not load image for vehicle ${vehicleName}`, error);
      return require('../assets/Tesla_Model_3.png'); // Use Tesla Model 3 as fallback
    }
  };

  return (
    <Container maxWidth="xl" sx={{ position: 'relative' }}>
      {!scenarioId && <NoScenarioOverlay />}
      <Grid container spacing={2}>
        {errorCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              color: 'red',
              padding: '8px 16px',
              borderRadius: '4px',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            Connection issues. Using cached data...
          </Box>
        )}
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={3} key={vehicle.vehicle_name}>
            <StyledCard>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <CarImage 
                  src={getVehicleImage(vehicle.vehicle_name)} 
                  alt={vehicle.vehicle_name}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const img = e.target as HTMLImageElement;
                    img.src = require('../assets/Tesla_Model_3.png');
                  }}
                />
                <Typography variant="h6" sx={{ position: 'absolute', left: '100px', top: '16px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {vehicle.vehicle_name}
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mt: 2 }}>
                ID: #{vehicle.id.slice(0, 8)}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                  Status: {getStatusText(vehicle.enroute)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Speed: {vehicle.vehicle_speed.toFixed(1)} km/h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trips: {vehicle.number_of_trips}
                </Typography>
              </Box>

              <StatusDot status={vehicle.enroute} />
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Fleet;
