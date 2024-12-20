import requests
import time
from typing import Dict, Any, List
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import Optional
from models.scenario import Scenario


class ScenarioRunnerClient:
    def __init__(self, base_url: str = "http://localhost:8090"):
        self.base_url = base_url.rstrip('/')

    def launch_scenario(self, scenario_id: str, speed: float = 0.2) -> dict:
        """
        Launch a scenario with the specified ID and execution speed.
        
        Args:
            scenario_id: The ID of the scenario to launch
            speed: Execution speed (1.0 for real-time, <1 for faster execution)
        
        Returns:
            dict: Response from server containing message, scenario_id and startTime
        """
        url = f"{self.base_url}/Runner/launch_scenario/{scenario_id}"
        response = requests.post(url, params={"speed": speed})
        return response.json()

    def get_scenario(self, scenario_id: str) -> Dict[str, Any]:
        """
        Get scenario details by ID.
        
        Args:
            scenario_id: The ID of the scenario to retrieve
            
        Returns:
            Dict containing the scenario data
        """
        url = f"{self.base_url}/Scenarios/get_scenario/{scenario_id}"
        response = requests.get(url)

        return response.json()

    def initialize_scenario(self, scenario: Scenario, db_scenario_id: Optional[str] = None) -> bool:
        """
        Initialize a new scenario.
        
        Args:
            scenario: Scenario object containing the scenario data
            db_scenario_id: Optional database scenario ID
            
        Returns:
            bool: True if successful, raises exception otherwise
        """
        url = f"{self.base_url}/Scenarios/initialize_scenario"
        params = {}
        if db_scenario_id:
            params["db_scenario_id"] = db_scenario_id
        request_body = {
            "id": str(scenario.id),
            "startTime": str(scenario.startTime),
            "endTime": str(scenario.endTime),
            "status": scenario.status,
            "vehicles": [asdict(v) for v in scenario.vehicles] if scenario.vehicles else None,
            "customers": [asdict(c) for c in scenario.customers] if scenario.customers else None
        }
    
        response = requests.post(
            url,
            json=request_body,
            params=params
        )
        return True

    def update_scenario(self, scenario_id: str, vehicle_updates: List[Dict[str, str]]) -> bool:
        """
        Update a scenario with new vehicle assignments.
        
        Args:
            scenario_id: The ID of the scenario to update
            vehicle_updates: List of dicts containing vehicle ID and customer ID assignments
            
        Returns:
            bool: True if successful, raises exception otherwise
        """
        url = f"{self.base_url}/Scenarios/update_scenario/{scenario_id}"
        response = requests.put(
            url,
            json={"vehicles": vehicle_updates}
        )
        time.sleep(1)
        return True
