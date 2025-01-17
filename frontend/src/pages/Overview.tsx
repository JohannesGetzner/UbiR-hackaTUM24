import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import { useScenario } from "../context/ScenarioContext";

const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr)",
  width: "100%",
  height: "100%",
  minHeight: 0,
}));

const TopRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateColumns: "2fr 1fr",
  width: "100%",
  minHeight: 0,
}));

const BottomRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateColumns: "1fr 1fr 1fr",
  width: "100%",
  minHeight: 0,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  minHeight: 0,
}));

const NoScenarioOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  zIndex: 1000,
  gap: theme.spacing(2),
}));

const Overview = () => {
  const { scenarioId } = useScenario();
  const navigate = useNavigate();
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {!scenarioId && (
        <NoScenarioOverlay>
          <Typography variant="h5" component="h2" gutterBottom>
            No Active Scenario
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 400, mb: 2 }}
          >
            Start a new scenario in the Simulation page to see the fleet
            management overview.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/simulation")}
          >
            Start New Scenario
          </Button>
        </NoScenarioOverlay>
      )}
      <GridContainer>
        <TopRow>
          <StyledPaper elevation={2}>
            <iframe
              src={`http://localhost:3001/d-solo/be77oaroke0w0e/hackatum?orgId=1&timezone=browser&showCategory=Thresholds&var-query0=&var-scenarioId=9b6038dd-10aa-4fc3-a6ee-5cb5b69af6df&editIndex=0&refresh=5s&theme=light&panelId=4&__feature.dashboardSceneSolo&refresh=${timestamp}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Grafana Dashboard 1"
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </StyledPaper>
          <StyledPaper elevation={2} sx={{ overflow: "hidden", padding: 0 }}>
            <iframe 
              src={`http://localhost:3001/d-solo/be77oaroke0w0e/hackatum?orgId=1&from=1734202800000&to=1734213600000&timezone=browser&var-scenarioId=${scenarioId}&showCategory=Thresholds&theme=light&panelId=3&__feature.dashboardSceneSolo&refresh=${timestamp}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Grafana Dashboard 2"
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </StyledPaper>
        </TopRow>
        <BottomRow>
          <StyledPaper
            elevation={2}
            sx={{
              overflow: "hidden",
              padding: 0,
              minHeight: "300px",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
            onClick={() => navigate("/map")}
          >
            <Box sx={{ width: "100%", height: "100%" }}>
              <Map />
            </Box>
          </StyledPaper>
          <StyledPaper elevation={2} sx={{ overflow: "hidden", padding: 0 }}>
          <iframe
            src={`http://localhost:3001/d-solo/be77oaroke0w0e/hackatum?orgId=1&from=1734202800000&to=1734213600000&timezone=browser&var-scenarioId=${scenarioId}&showCategory=Thresholds&theme=light&panelId=2&__feature.dashboardSceneSolo&refresh=${timestamp}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Grafana Dashboard 3"
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          </StyledPaper>
          <StyledPaper elevation={2} sx={{ overflow: "hidden", padding: 0 }}>
            <iframe
              src={`http://localhost:3001/d-solo/be77oaroke0w0e/hackatum?orgId=1&from=1734202800000&to=1734213600000&timezone=browser&var-scenarioId=${scenarioId}&showCategory=Thresholds&theme=light&panelId=1&__feature.dashboardSceneSolo&refresh=${timestamp}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Grafana Dashboard 3"
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </StyledPaper>
        </BottomRow>
      </GridContainer>
    </Box>
  );
};

export default Overview;
