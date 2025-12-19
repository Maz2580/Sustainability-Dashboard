# Flight Emissions Dashboard

## Overview
This dashboard presents a comprehensive analysis of university flight data from March 2023 to December 2024. It visualizes key sustainability metrics related to travel emissions across different faculties, departments, travel classes, and routes.

## Key Features
- Total flight statistics (count, emissions, distance)
- Faculty and department emission breakdowns
- Quarterly and monthly emission trends
- Travel class analysis
- Most frequent and highest-emission routes

## Data Sources
The dashboard uses processed data from "Flight data snapshot CY2024_FEIT.xlsx" which has been analyzed through several Python scripts to extract relevant metrics and generate visualizations.

## Setup and Running

### Prerequisites
- Python 3.7+
- Required Python packages: see `requirements.txt`

### Installation
1. Clone this repository
2. Ensure you have all the required data files in the appropriate directories:
   - `visualizations/` - Contains all visualization images
   - `dashboard_data/` - Contains processed JSON and CSV data files

### Running the Dashboard
1. Run the server: `python server.py`
2. The dashboard will automatically open in your default web browser
3. If not, navigate to `http://localhost:8585/dashboard.html`

To use a different port (if 8585 is already in use):
```
python server.py --port 9090
```

## Dashboard Structure
- **Summary Statistics**: Key metrics about total flights, emissions, and distances
- **Faculty Emissions**: Bar chart showing emissions by faculty
- **Time-based Analysis**: Quarterly and monthly emissions trends
- **Route Analysis**: Data tables for most frequent and highest-emission routes
- **Travel Class Analysis**: Breakdown of emissions by travel class
- **Department Emissions**: Table showing emissions by department

## Key Findings
- Total of 17,358 flights recorded from March 2023 to December 2024
- Total emissions of 36.18 million kg CO2e
- MDHS Reporting Division had the highest emissions (23.92% of total)
- Economy class was the most common travel class (15,679 flights)
- Q2 had the highest quarterly emissions (11.52 million kg CO2e)
- September had the highest monthly emissions
- Most frequent route was MEL/SYD/MEL (1,170 flights)
- Highest emissions route was MEL/SIN/LHR/SIN/MEL

## Files Description
- `dashboard.html` - Main dashboard HTML file
- `server.py` - Simple HTTP server to serve the dashboard
- `dashboard_data/` - Directory containing processed data:
  - `dashboard_data.json` - Main data file with all metrics
  - Various CSV files with specific data breakdowns
- `visualizations/` - Directory containing generated charts

## License
For internal university use only.

## Contact
University Sustainability Team 