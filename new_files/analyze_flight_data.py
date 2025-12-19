import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# First, let's inspect the Excel file to see all available sheets
print("Inspecting Excel file...")
xls = pd.ExcelFile('Flight data snapshot CY2024_FEIT.xlsx')
print("\nAvailable sheets:", xls.sheet_names)

# Read the raw data sheet with proper headers
print("\nReading raw data sheet...")
df = pd.read_excel('Flight data snapshot CY2024_FEIT.xlsx', 
                  sheet_name='A1. Raw data CY2024 (HIDE+LOCK)',
                  header=1)  # Use row 1 as headers

# Clean up the data
df = df.dropna(how='all')  # Remove completely empty rows

# Rename columns based on the data we see
column_mapping = {
    'Unnamed: 0': 'TMP_ID',
    'Unnamed: 1': 'Faculty',
    'Unnamed: 2': 'Department',
    'Unnamed: 3': 'School',
    'Unnamed: 4': 'Travel_Date',
    'Unnamed: 5': 'Employee_ID',
    'Unnamed: 6': 'Cost_Centre',
    'Unnamed: 7': 'Project_Code',
    'Unnamed: 8': 'Traveler_Name',
    'Unnamed: 9': 'Booking_Reference',
    'Unnamed: 10': 'Return_Date',
    'Unnamed: 11': 'Month',
    'Unnamed: 12': 'Airline',
    'Unnamed: 13': 'Ticket_Number',
    'Unnamed: 14': 'Class_of_Travel',
    'Unnamed: 15': 'Route',
    'Unnamed: 16': 'Origin_City',
    'Unnamed: 17': 'Origin_Country',
    'Unnamed: 18': 'Destination_City',
    'Unnamed: 19': 'Destination_Country',
    'Unnamed: 20': 'Flight_Type',
    'Unnamed: 21': 'Haul_Type',
    'Unnamed: 22': 'Booker_Name',
    'Unnamed: 23': 'Distance_km',
    'Unnamed: 24': 'Distance_miles',
    'Unnamed: 25': 'Distance_nautical_miles',
    'Unnamed: 26': 'Emissions_kg_CO2e',
    'Unnamed: 27': 'Emissions_kg_CO2e_2',
    'Unnamed: 28': 'Emissions_kg_CO2e_3',
    'Unnamed: 29': 'Distance_km_2',
    'Unnamed: 30': 'Emissions_kg_CO2e_4',
    'Unnamed: 31': 'Leg_Number',
    'Unnamed: 32': 'Transaction_Type',
    'Unnamed: 33': 'Haul_Category',
    'Unnamed: 34': 'Emissions_Factor',
    'Unnamed: 35': 'Total_GHG_Emissions',
    'Unnamed: 36': 'Quarter',
    'Unnamed: 37': 'Selected_Emissions'
}

df = df.rename(columns=column_mapping)

# Convert Total_GHG_Emissions to numeric, handling errors
df['Total_GHG_Emissions'] = pd.to_numeric(df['Total_GHG_Emissions'], errors='coerce')

# Basic information about the dataset
print("\n=== Basic Dataset Information ===")
print(f"Number of rows: {len(df)}")
print(f"Number of columns: {len(df.columns)}")

# Key metrics analysis
print("\n=== Key Metrics Analysis ===")

# 1. Total emissions by quarter
print("\nTotal GHG Emissions by Quarter:")
quarterly_emissions = df.groupby('Quarter')['Total_GHG_Emissions'].sum()
print(quarterly_emissions)

# 2. Emissions by faculty
print("\nTop 5 Faculties by Total Emissions:")
faculty_emissions = df.groupby('Faculty')['Total_GHG_Emissions'].sum().sort_values(ascending=False)
print(faculty_emissions.head())

# 3. Flight type distribution
print("\nFlight Type Distribution:")
flight_type_dist = df['Flight_Type'].value_counts()
print(flight_type_dist)

# 4. Class of travel distribution
print("\nClass of Travel Distribution:")
class_dist = df['Class_of_Travel'].value_counts()
print(class_dist)

# 5. Top routes
print("\nTop 10 Most Common Routes:")
route_dist = df['Route'].value_counts().head(10)
print(route_dist)

# 6. Additional analysis - Emissions by haul category
print("\nEmissions by Haul Category:")
haul_emissions = df.groupby('Haul_Category')['Total_GHG_Emissions'].sum().sort_values(ascending=False)
print(haul_emissions)

# Save the analysis results to a text file
with open('flight_data_analysis.txt', 'w') as f:
    f.write("=== Flight Data Analysis Report ===\n")
    f.write(f"Analysis performed on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    f.write("=== Basic Dataset Information ===\n")
    f.write(f"Number of rows: {len(df)}\n")
    f.write(f"Number of columns: {len(df.columns)}\n\n")
    
    f.write("=== Key Metrics Analysis ===\n")
    
    f.write("\nTotal GHG Emissions by Quarter:\n")
    f.write(str(quarterly_emissions) + "\n\n")
    
    f.write("Top 5 Faculties by Total Emissions:\n")
    f.write(str(faculty_emissions.head()) + "\n\n")
    
    f.write("Flight Type Distribution:\n")
    f.write(str(flight_type_dist) + "\n\n")
    
    f.write("Class of Travel Distribution:\n")
    f.write(str(class_dist) + "\n\n")
    
    f.write("Top 10 Most Common Routes:\n")
    f.write(str(route_dist) + "\n\n")
    
    f.write("Emissions by Haul Category:\n")
    f.write(str(haul_emissions) + "\n")

print("\nAnalysis complete! Results have been saved to 'flight_data_analysis.txt'") 