import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os
import json

def create_output_directory():
    """Create directories for analysis results and visualizations"""
    for dir_name in ['analysis_results', 'visualizations']:
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)

def analyze_historical_trends(df_historical):
    """Analyze historical trends from 2019-2024"""
    # Extract relevant data
    years = ['CY2019', 'CY2023', 'CY2024']
    emissions = []
    distances = []
    
    for year in years:
        year_data = df_historical[df_historical['Unnamed: 2'].str.contains(year, na=False)]
        if not year_data.empty:
            emissions.append(float(year_data.iloc[0]['Unnamed: 5']))
            distances.append(float(year_data.iloc[0]['Unnamed: 6']))
    
    return {
        'years': years,
        'emissions': emissions,
        'distances': distances
    }

def analyze_faculty_data(df_faculty):
    """Analyze faculty and department data"""
    print("\nAnalyzing faculty and department data...")
    
    # First, let's look at the raw data structure
    print("\nRaw data structure:")
    print(df_faculty.head(30))  # Show more rows to understand the structure
    
    # Find the actual data sections
    sections = {
        'faculty_overview': None,
        'department_data': None,
        'emissions_summary': None
    }
    
    # Find the different sections
    for idx, row in df_faculty.iterrows():
        if isinstance(row['Unnamed: 2'], str):
            if 'Faculty / Portfolio Overview' in row['Unnamed: 2']:
                sections['faculty_overview'] = idx
            elif 'Department data' in row['Unnamed: 2']:
                sections['department_data'] = idx
            elif 'GHG emissions' in row['Unnamed: 2']:
                sections['emissions_summary'] = idx
    
    print("\nFound data sections at rows:", sections)
    
    # Process faculty data
    faculty_metrics = []
    if sections['faculty_overview'] is not None:
        start_idx = sections['faculty_overview'] + 2  # Skip header
        df_faculty_data = df_faculty.iloc[start_idx:].copy()
        
        # Process each row until we hit the next section
        for _, row in df_faculty_data.iterrows():
            if pd.isna(row['Unnamed: 1']) or pd.isna(row['Unnamed: 2']):
                continue
                
            try:
                faculty_id = str(row['Unnamed: 1']).strip()
                faculty_name = str(row['Unnamed: 2']).strip()
                
                # Skip if this is not a faculty entry
                if not faculty_id.replace('.', '').isdigit():
                    continue
                    
                faculty_metric = {
                    'faculty_id': faculty_id,
                    'faculty_name': faculty_name,
                    'total_flights': pd.to_numeric(row['Unnamed: 3'], errors='coerce'),
                    'total_emissions': pd.to_numeric(row['Unnamed: 4'], errors='coerce'),
                    'domestic_flights': pd.to_numeric(row['Unnamed: 5'], errors='coerce'),
                    'international_flights': pd.to_numeric(row['Unnamed: 6'], errors='coerce'),
                    'economy_flights': pd.to_numeric(row['Unnamed: 7'], errors='coerce'),
                    'business_flights': pd.to_numeric(row['Unnamed: 8'], errors='coerce'),
                    'first_class_flights': pd.to_numeric(row['Unnamed: 9'], errors='coerce'),
                    'other_flights': pd.to_numeric(row['Unnamed: 10'], errors='coerce')
                }
                
                if not pd.isna(faculty_metric['faculty_name']) and not pd.isna(faculty_metric['total_emissions']):
                    faculty_metrics.append(faculty_metric)
            except Exception as e:
                print(f"Warning: Error processing faculty row: {str(e)}")
                continue
    
    # Process department data
    department_metrics = []
    if sections['department_data'] is not None:
        start_idx = sections['department_data'] + 2  # Skip header
        df_dept_data = df_faculty.iloc[start_idx:].copy()
        
        # Process each row until we hit the next section
        for _, row in df_dept_data.iterrows():
            if pd.isna(row['Unnamed: 1']) or pd.isna(row['Unnamed: 2']):
                continue
                
            try:
                dept_id = str(row['Unnamed: 1']).strip()
                dept_name = str(row['Unnamed: 2']).strip()
                
                # Skip if this is not a department entry
                if not dept_id.replace('.', '').isdigit():
                    continue
                    
                dept_metric = {
                    'department_id': dept_id,
                    'department_name': dept_name,
                    'faculty': str(row['Unnamed: 3']).strip(),
                    'total_flights': pd.to_numeric(row['Unnamed: 4'], errors='coerce'),
                    'total_emissions': pd.to_numeric(row['Unnamed: 5'], errors='coerce'),
                    'domestic_flights': pd.to_numeric(row['Unnamed: 6'], errors='coerce'),
                    'international_flights': pd.to_numeric(row['Unnamed: 7'], errors='coerce'),
                    'economy_flights': pd.to_numeric(row['Unnamed: 8'], errors='coerce'),
                    'business_flights': pd.to_numeric(row['Unnamed: 9'], errors='coerce'),
                    'first_class_flights': pd.to_numeric(row['Unnamed: 10'], errors='coerce')
                }
                
                if not pd.isna(dept_metric['department_name']) and not pd.isna(dept_metric['total_emissions']):
                    department_metrics.append(dept_metric)
            except Exception as e:
                print(f"Warning: Error processing department row: {str(e)}")
                continue
    
    # Convert to DataFrames
    df_faculty_metrics = pd.DataFrame(faculty_metrics)
    df_dept_metrics = pd.DataFrame(department_metrics)
    
    # Print analysis results
    if not df_faculty_metrics.empty:
        print("\nFaculty Analysis:")
        print(f"Total faculties analyzed: {len(df_faculty_metrics)}")
        total_emissions = df_faculty_metrics['total_emissions'].sum()
        print(f"Total emissions across all faculties: {total_emissions:,.2f} kg CO2e")
        
        # Calculate percentages
        df_faculty_metrics['emissions_percentage'] = (df_faculty_metrics['total_emissions'] / total_emissions * 100).round(2)
        
        print("\nTop 3 faculties by emissions:")
        top_faculties = df_faculty_metrics.nlargest(3, 'total_emissions')
        for _, row in top_faculties.iterrows():
            print(f"{row['faculty_name']}: {row['total_emissions']:,.2f} kg CO2e ({row['emissions_percentage']}%)")
    
    if not df_dept_metrics.empty:
        print("\nDepartment Analysis:")
        print(f"Total departments analyzed: {len(df_dept_metrics)}")
        
        # Group by faculty and calculate metrics
        faculty_dept_summary = df_dept_metrics.groupby('faculty').agg({
            'total_emissions': 'sum',
            'total_flights': 'sum',
            'department_name': 'count'
        }).reset_index()
        
        faculty_dept_summary.columns = ['faculty', 'total_emissions', 'total_flights', 'department_count']
        faculty_dept_summary = faculty_dept_summary.sort_values('total_emissions', ascending=False)
        
        print("\nFaculty Department Summary:")
        for _, row in faculty_dept_summary.iterrows():
            print(f"\n{row['faculty']}:")
            print(f"  Departments: {row['department_count']}")
            print(f"  Total flights: {row['total_flights']:,.0f}")
            print(f"  Total emissions: {row['total_emissions']:,.2f} kg CO2e")
        
        print("\nTop 5 departments by emissions:")
        top_depts = df_dept_metrics.nlargest(5, 'total_emissions')
        for _, row in top_depts.iterrows():
            print(f"{row['department_name']} ({row['faculty']}): {row['total_emissions']:,.2f} kg CO2e")
    
    return {
        'faculty_metrics': df_faculty_metrics,
        'department_metrics': df_dept_metrics
    }

def analyze_flight_patterns(df_raw):
    """Analyze flight patterns and routes"""
    print("\nAnalyzing flight patterns...")
    
    # Route analysis
    route_analysis = df_raw.groupby('Route').agg({
        'Total_GHG_Emissions': 'sum',
        'TMP_ID': 'count'
    }).sort_values('TMP_ID', ascending=False).head(10)
    
    print("\nTop 10 routes by number of flights:")
    print(route_analysis)
    
    # Class of travel analysis
    class_analysis = df_raw['Class_of_Travel'].value_counts()
    
    print("\nClass of travel distribution:")
    print(class_analysis)
    
    # Quarterly analysis
    quarterly_analysis = df_raw.groupby('Quarter').agg({
        'Total_GHG_Emissions': 'sum',
        'TMP_ID': 'count'
    })
    
    print("\nQuarterly metrics:")
    print(quarterly_analysis)
    
    return {
        'top_routes': route_analysis,
        'class_distribution': class_analysis,
        'quarterly_metrics': quarterly_analysis
    }

def analyze_emissions(df_raw):
    """Analyze emissions data"""
    print("\nAnalyzing emissions data...")
    
    # Emissions by haul category
    haul_emissions = df_raw.groupby('Haul_Category')['Total_GHG_Emissions'].sum()
    
    print("\nEmissions by haul category:")
    print(haul_emissions)
    
    # Emissions by class of travel
    class_emissions = df_raw.groupby('Class_of_Travel')['Total_GHG_Emissions'].sum()
    
    print("\nEmissions by class of travel:")
    print(class_emissions)
    
    # Monthly emissions
    monthly_emissions = df_raw.groupby('Month')['Total_GHG_Emissions'].sum()
    
    print("\nMonthly emissions:")
    print(monthly_emissions)
    
    return {
        'haul_emissions': haul_emissions,
        'class_emissions': class_emissions,
        'monthly_emissions': monthly_emissions
    }

def main():
    # Create output directories
    create_output_directory()
    
    # Read all sheets
    print("Reading Excel file...")
    xls = pd.ExcelFile('Flight data snapshot CY2024_FEIT.xlsx')
    
    # Read historical analysis sheet
    df_historical = pd.read_excel(xls, sheet_name='0. CY2019 - CY2024 analysis')
    
    # Read faculty data
    df_faculty = pd.read_excel(xls, sheet_name='1. Faculty & portfolio data')
    
    # Read raw data
    df_raw = pd.read_excel(xls, sheet_name='A1. Raw data CY2024 (HIDE+LOCK)', header=1)
    
    # Clean column names for raw data
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
    df_raw = df_raw.rename(columns=column_mapping)
    
    # Convert numeric columns
    numeric_columns = ['Total_GHG_Emissions', 'Distance_km', 'Distance_miles', 'Distance_nautical_miles']
    for col in numeric_columns:
        df_raw[col] = pd.to_numeric(df_raw[col], errors='coerce')
    
    # Convert date columns to datetime with explicit format
    date_columns = ['Travel_Date', 'Return_Date']
    date_format = '%Y-%m-%d'  # Adjust this format based on your actual date format
    for col in date_columns:
        try:
            # First try with explicit format
            df_raw[col] = pd.to_datetime(df_raw[col], format=date_format, errors='coerce')
            # If that fails, try parsing without format
            if df_raw[col].isna().all():
                df_raw[col] = pd.to_datetime(df_raw[col], errors='coerce')
        except Exception as e:
            print(f"Warning: Could not convert {col} to datetime: {str(e)}")
    
    # Print sample of date columns to verify conversion
    print("\nSample of converted dates:")
    for col in date_columns:
        print(f"\n{col} sample:")
        print(df_raw[col].head())
    
    # Perform analyses
    print("\nPerforming comprehensive analysis...")
    
    # 1. Historical Trends
    historical_data = analyze_historical_trends(df_historical)
    
    # 2. Faculty and Department Analysis
    org_data = analyze_faculty_data(df_faculty)
    
    # 3. Flight Patterns
    flight_patterns = analyze_flight_patterns(df_raw)
    
    # 4. Emissions Analysis
    emissions_data = analyze_emissions(df_raw)
    
    # Save all analysis results
    analysis_results = {
        'historical_trends': historical_data,
        'faculty_metrics': org_data['faculty_metrics'].to_dict('records') if not org_data['faculty_metrics'].empty else [],
        'department_metrics': org_data['department_metrics'].to_dict('records') if not org_data['department_metrics'].empty else [],
        'flight_patterns': {
            'top_routes': flight_patterns['top_routes'].to_dict(),
            'class_distribution': flight_patterns['class_distribution'].to_dict(),
            'quarterly_metrics': flight_patterns['quarterly_metrics'].to_dict()
        },
        'emissions_analysis': {
            'haul_emissions': emissions_data['haul_emissions'].to_dict(),
            'class_emissions': emissions_data['class_emissions'].to_dict(),
            'monthly_emissions': emissions_data['monthly_emissions'].to_dict()
        }
    }
    
    # Save results to JSON file
    with open('analysis_results/dashboard_data.json', 'w') as f:
        json.dump(analysis_results, f, indent=4)
    
    print("\nAnalysis complete! Results saved to 'analysis_results/dashboard_data.json'")
    
    # Generate summary statistics
    try:
        # Get date range, handling potential NaT values
        valid_dates = df_raw['Travel_Date'].dropna()
        if not valid_dates.empty:
            date_range = {
                'start': valid_dates.min().strftime('%Y-%m-%d'),
                'end': valid_dates.max().strftime('%Y-%m-%d')
            }
        else:
            date_range = {'start': None, 'end': None}
            
        summary = {
            'total_flights': len(df_raw),
            'total_emissions': float(df_raw['Total_GHG_Emissions'].sum()),
            'unique_faculties': df_raw['Faculty'].nunique(),
            'unique_routes': df_raw['Route'].nunique(),
            'date_range': date_range
        }
    except Exception as e:
        print(f"Warning: Error generating summary statistics: {str(e)}")
        summary = {
            'total_flights': len(df_raw),
            'total_emissions': float(df_raw['Total_GHG_Emissions'].sum()),
            'unique_faculties': df_raw['Faculty'].nunique(),
            'unique_routes': df_raw['Route'].nunique(),
            'date_range': {'start': None, 'end': None}
        }
    
    # Save summary to separate file
    with open('analysis_results/summary_statistics.json', 'w') as f:
        json.dump(summary, f, indent=4)
    
    print("Summary statistics saved to 'analysis_results/summary_statistics.json'")
    
    # Print summary of the analysis
    print("\nSummary of Analysis:")
    print(f"Total flights analyzed: {summary['total_flights']:,}")
    print(f"Total GHG emissions: {summary['total_emissions']:,.2f} kg CO2e")
    print(f"Number of unique faculties: {summary['unique_faculties']}")
    print(f"Number of unique routes: {summary['unique_routes']:,}")
    print(f"Date range: {summary['date_range']['start']} to {summary['date_range']['end']}")

if __name__ == "__main__":
    main() 