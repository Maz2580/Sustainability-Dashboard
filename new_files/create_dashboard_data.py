import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os
from datetime import datetime

def create_output_directories():
    """Create directories for outputs"""
    for dir_name in ['dashboard_data', 'visualizations']:
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)

def load_raw_flight_data():
    """Load the raw flight data"""
    print("Loading raw flight data...")
    df = pd.read_excel('Flight data snapshot CY2024_FEIT.xlsx', 
                       sheet_name='A1. Raw data CY2024 (HIDE+LOCK)',
                       header=1)
    
    # Clean column names
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
    
    # Convert numeric columns
    numeric_cols = ['Distance_km', 'Emissions_kg_CO2e', 'Total_GHG_Emissions']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Convert date columns
    date_cols = ['Travel_Date', 'Return_Date']
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    
    return df

def analyze_by_faculty(df):
    """Analyze flight data grouped by faculty"""
    print("Analyzing flight data by faculty...")
    
    # Group by Faculty and calculate metrics
    faculty_data = df.groupby('Faculty').agg({
        'TMP_ID': 'count',
        'Total_GHG_Emissions': 'sum',
        'Distance_km': 'sum'
    }).reset_index()
    
    faculty_data.columns = ['Faculty', 'Flight_Count', 'Total_Emissions', 'Total_Distance']
    faculty_data = faculty_data.sort_values('Total_Emissions', ascending=False)
    
    # Calculate emissions per km
    faculty_data['Emissions_per_km'] = faculty_data['Total_Emissions'] / faculty_data['Total_Distance']
    faculty_data['Emissions_per_km'] = faculty_data['Emissions_per_km'].fillna(0)
    
    # Calculate percentages
    total_emissions = faculty_data['Total_Emissions'].sum()
    faculty_data['Emissions_Percentage'] = (faculty_data['Total_Emissions'] / total_emissions * 100).round(2)
    
    print(f"Top 5 faculties by emissions:")
    for _, row in faculty_data.head(5).iterrows():
        print(f"{row['Faculty']}: {row['Total_Emissions']:,.2f} kg CO2e ({row['Emissions_Percentage']}%)")
    
    return faculty_data

def analyze_by_department(df):
    """Analyze flight data grouped by department"""
    print("\nAnalyzing flight data by department...")
    
    # Group by Department and calculate metrics
    dept_data = df.groupby(['Faculty', 'Department']).agg({
        'TMP_ID': 'count',
        'Total_GHG_Emissions': 'sum',
        'Distance_km': 'sum'
    }).reset_index()
    
    dept_data.columns = ['Faculty', 'Department', 'Flight_Count', 'Total_Emissions', 'Total_Distance']
    dept_data = dept_data.sort_values('Total_Emissions', ascending=False)
    
    # Calculate emissions per km
    dept_data['Emissions_per_km'] = dept_data['Total_Emissions'] / dept_data['Total_Distance']
    dept_data['Emissions_per_km'] = dept_data['Emissions_per_km'].fillna(0)
    
    print(f"Top 5 departments by emissions:")
    for _, row in dept_data.head(5).iterrows():
        print(f"{row['Department']} ({row['Faculty']}): {row['Total_Emissions']:,.2f} kg CO2e")
    
    return dept_data

def analyze_by_travel_class(df):
    """Analyze flight data by class of travel"""
    print("\nAnalyzing flight data by class of travel...")
    
    # Group by Class of Travel and calculate metrics
    class_data = df.groupby('Class_of_Travel').agg({
        'TMP_ID': 'count',
        'Total_GHG_Emissions': 'sum',
        'Distance_km': 'sum'
    }).reset_index()
    
    class_data.columns = ['Class_of_Travel', 'Flight_Count', 'Total_Emissions', 'Total_Distance']
    class_data = class_data.sort_values('Total_Emissions', ascending=False)
    
    # Calculate emissions per km
    class_data['Emissions_per_km'] = class_data['Total_Emissions'] / class_data['Total_Distance']
    class_data['Emissions_per_km'] = class_data['Emissions_per_km'].fillna(0)
    
    print(f"Emissions by class of travel:")
    for _, row in class_data.iterrows():
        print(f"{row['Class_of_Travel']}: {row['Total_Emissions']:,.2f} kg CO2e ({row['Flight_Count']} flights)")
    
    return class_data

def analyze_by_quarter(df):
    """Analyze flight data by quarter"""
    print("\nAnalyzing flight data by quarter...")
    
    # Group by Quarter and calculate metrics
    quarter_data = df.groupby('Quarter').agg({
        'TMP_ID': 'count',
        'Total_GHG_Emissions': 'sum',
        'Distance_km': 'sum'
    }).reset_index()
    
    quarter_data.columns = ['Quarter', 'Flight_Count', 'Total_Emissions', 'Total_Distance']
    quarter_data = quarter_data.sort_values('Quarter')
    
    # Filter out invalid quarters
    quarter_data = quarter_data[quarter_data['Quarter'].isin(['Q1', 'Q2', 'Q3', 'Q4'])]
    
    print(f"Emissions by quarter:")
    for _, row in quarter_data.iterrows():
        print(f"{row['Quarter']}: {row['Total_Emissions']:,.2f} kg CO2e ({row['Flight_Count']} flights)")
    
    return quarter_data

def analyze_by_route(df):
    """Analyze flight data by route"""
    print("\nAnalyzing flight data by route...")
    
    # Group by Route and calculate metrics
    route_data = df.groupby('Route').agg({
        'TMP_ID': 'count',
        'Total_GHG_Emissions': 'sum',
        'Distance_km': 'mean'  # Average distance for the route
    }).reset_index()
    
    route_data.columns = ['Route', 'Flight_Count', 'Total_Emissions', 'Average_Distance']
    
    # Calculate emissions per flight
    route_data['Emissions_per_Flight'] = route_data['Total_Emissions'] / route_data['Flight_Count']
    
    # Sort by number of flights
    frequent_routes = route_data.sort_values('Flight_Count', ascending=False).head(10)
    print(f"Top 10 most frequent routes:")
    for _, row in frequent_routes.iterrows():
        print(f"{row['Route']}: {row['Flight_Count']} flights, {row['Total_Emissions']:,.2f} kg CO2e")
    
    # Sort by total emissions
    high_emission_routes = route_data.sort_values('Total_Emissions', ascending=False).head(10)
    print(f"\nTop 10 routes by emissions:")
    for _, row in high_emission_routes.iterrows():
        print(f"{row['Route']}: {row['Total_Emissions']:,.2f} kg CO2e, {row['Flight_Count']} flights")
    
    return {
        'all_routes': route_data,
        'frequent_routes': frequent_routes,
        'high_emission_routes': high_emission_routes
    }

def analyze_by_month(df):
    """Analyze flight data by month"""
    print("\nAnalyzing flight data by month...")
    
    # Create a mapping for month ordering
    month_order = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    }
    
    # Filter valid months
    df_valid = df[df['Month'].isin(month_order.keys())]
    
    # Group by Month and calculate metrics
    month_data = df_valid.groupby('Month').agg({
        'TMP_ID': 'count',
        'Total_GHG_Emissions': 'sum',
        'Distance_km': 'sum'
    }).reset_index()
    
    month_data.columns = ['Month', 'Flight_Count', 'Total_Emissions', 'Total_Distance']
    
    # Add month ordering for sorting
    month_data['Month_Order'] = month_data['Month'].map(month_order)
    month_data = month_data.sort_values('Month_Order')
    
    print(f"Emissions by month:")
    for _, row in month_data.iterrows():
        print(f"{row['Month']}: {row['Total_Emissions']:,.2f} kg CO2e ({row['Flight_Count']} flights)")
    
    return month_data

def create_visualizations(data):
    """Create visualizations from the analyzed data"""
    print("\nCreating visualizations...")
    sns.set(style="whitegrid")
    
    # 1. Faculty emissions
    plt.figure(figsize=(12, 6))
    faculty_plot = sns.barplot(x='Faculty', y='Total_Emissions', data=data['faculty_data'].head(10))
    plt.title('Top 10 Faculties by Total Emissions')
    plt.xticks(rotation=45, ha='right')
    plt.ylabel('Total Emissions (kg CO2e)')
    plt.tight_layout()
    plt.savefig('visualizations/faculty_emissions.png')
    plt.close()
    
    # 2. Quarterly emissions
    plt.figure(figsize=(10, 5))
    quarter_plot = sns.barplot(x='Quarter', y='Total_Emissions', data=data['quarter_data'])
    plt.title('Emissions by Quarter')
    plt.ylabel('Total Emissions (kg CO2e)')
    plt.tight_layout()
    plt.savefig('visualizations/quarterly_emissions.png')
    plt.close()
    
    # 3. Monthly emissions
    plt.figure(figsize=(12, 5))
    month_plot = sns.barplot(x='Month', y='Total_Emissions', data=data['month_data'])
    plt.title('Emissions by Month')
    plt.ylabel('Total Emissions (kg CO2e)')
    plt.tight_layout()
    plt.savefig('visualizations/monthly_emissions.png')
    plt.close()
    
    # 4. Class of travel emissions
    plt.figure(figsize=(10, 5))
    class_plot = sns.barplot(x='Class_of_Travel', y='Total_Emissions', data=data['class_data'])
    plt.title('Emissions by Class of Travel')
    plt.ylabel('Total Emissions (kg CO2e)')
    plt.tight_layout()
    plt.savefig('visualizations/class_emissions.png')
    plt.close()
    
    # 5. Top 10 routes by emissions
    plt.figure(figsize=(14, 6))
    routes_plot = sns.barplot(x='Route', y='Total_Emissions', 
                             data=data['route_data']['high_emission_routes'])
    plt.title('Top 10 Routes by Emissions')
    plt.xticks(rotation=45, ha='right')
    plt.ylabel('Total Emissions (kg CO2e)')
    plt.tight_layout()
    plt.savefig('visualizations/top_routes_emissions.png')
    plt.close()
    
    print("Visualizations saved to 'visualizations' directory")

def save_dashboard_data(data):
    """Save all data for the dashboard"""
    dashboard_data = {
        'faculties': data['faculty_data'].to_dict('records'),
        'departments': data['dept_data'].to_dict('records'),
        'travel_classes': data['class_data'].to_dict('records'),
        'quarters': data['quarter_data'].to_dict('records'),
        'months': data['month_data'].to_dict('records'),
        'routes': {
            'frequent_routes': data['route_data']['frequent_routes'].to_dict('records'),
            'high_emission_routes': data['route_data']['high_emission_routes'].to_dict('records')
        },
        'summary': {
            'total_flights': int(data['faculty_data']['Flight_Count'].sum()),
            'total_emissions': float(data['faculty_data']['Total_Emissions'].sum()),
            'total_distance': float(data['faculty_data']['Total_Distance'].sum()),
            'average_emissions_per_km': float(data['faculty_data']['Total_Emissions'].sum() / 
                                           data['faculty_data']['Total_Distance'].sum())
        },
        'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Save to JSON
    with open('dashboard_data/dashboard_data.json', 'w') as f:
        json.dump(dashboard_data, f, indent=2)
    
    # Also save individual components for easier loading
    for key, value in data.items():
        if isinstance(value, pd.DataFrame):
            value.to_csv(f'dashboard_data/{key}.csv', index=False)
        elif isinstance(value, dict):
            for sub_key, sub_value in value.items():
                if isinstance(sub_value, pd.DataFrame):
                    sub_value.to_csv(f'dashboard_data/{key}_{sub_key}.csv', index=False)
    
    print("\nDashboard data saved to 'dashboard_data' directory")

def main():
    # Create output directories
    create_output_directories()
    
    # Load and clean the raw flight data
    df = load_raw_flight_data()
    
    # Display basic info
    print(f"\nLoaded {len(df):,} flight records")
    print(f"Date range: {df['Travel_Date'].min()} to {df['Travel_Date'].max()}")
    
    # Analyze the data from different angles
    faculty_data = analyze_by_faculty(df)
    dept_data = analyze_by_department(df)
    class_data = analyze_by_travel_class(df)
    quarter_data = analyze_by_quarter(df)
    month_data = analyze_by_month(df)
    route_data = analyze_by_route(df)
    
    # Compile all data
    all_data = {
        'faculty_data': faculty_data,
        'dept_data': dept_data,
        'class_data': class_data,
        'quarter_data': quarter_data,
        'month_data': month_data,
        'route_data': route_data
    }
    
    # Create visualizations
    create_visualizations(all_data)
    
    # Save data for dashboard
    save_dashboard_data(all_data)
    
    print("\nAnalysis complete! All data is prepared for dashboard visualization.")

if __name__ == "__main__":
    main() 