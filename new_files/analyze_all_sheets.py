import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os
import sys

def create_analysis_directory():
    """Create a directory for analysis results if it doesn't exist"""
    if not os.path.exists('analysis_results'):
        os.makedirs('analysis_results')

def safe_write(f, text):
    """Safely write text to file, handling encoding issues"""
    try:
        f.write(text)
    except UnicodeEncodeError:
        # Replace problematic characters
        text = text.encode('ascii', 'replace').decode('ascii')
        f.write(text)

def analyze_sheet(sheet_name, df, output_file):
    """Analyze a specific sheet and save results to a file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        safe_write(f, f"=== Analysis of Sheet: {sheet_name} ===\n")
        safe_write(f, f"Analysis performed on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        safe_write(f, "=== Basic Dataset Information ===\n")
        safe_write(f, f"Number of rows: {len(df)}\n")
        safe_write(f, f"Number of columns: {len(df.columns)}\n\n")
        
        safe_write(f, "=== Column Names ===\n")
        safe_write(f, str(df.columns.tolist()) + "\n\n")
        
        safe_write(f, "=== First 5 rows ===\n")
        safe_write(f, str(df.head()) + "\n\n")
        
        safe_write(f, "=== Data Types ===\n")
        safe_write(f, str(df.dtypes) + "\n\n")
        
        safe_write(f, "=== Missing Values Analysis ===\n")
        missing_values = df.isnull().sum()
        safe_write(f, str(missing_values[missing_values > 0]) + "\n\n")
        
        # Try to identify numeric columns and provide statistics
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
        if len(numeric_cols) > 0:
            safe_write(f, "=== Numeric Columns Statistics ===\n")
            safe_write(f, str(df[numeric_cols].describe()) + "\n\n")
        
        # Try to identify categorical columns and provide value counts
        categorical_cols = df.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            safe_write(f, "=== Categorical Columns Analysis ===\n")
            for col in categorical_cols:
                safe_write(f, f"\nUnique values in {col}:\n")
                safe_write(f, str(df[col].value_counts().head()) + "\n")

def main():
    # Set console output encoding
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    
    # Create directory for results
    create_analysis_directory()
    
    # Read the Excel file
    print("Reading Excel file...")
    xls = pd.ExcelFile('Flight data snapshot CY2024_FEIT.xlsx')
    sheet_names = xls.sheet_names
    print(f"\nAvailable sheets: {sheet_names}")
    
    # Analyze each sheet
    for sheet_name in sheet_names:
        print(f"\nAnalyzing sheet: {sheet_name}")
        try:
            # Read the sheet
            df = pd.read_excel(xls, sheet_name=sheet_name)
            
            # Create output filename (replace problematic characters)
            safe_filename = sheet_name.replace("/", "_").replace("\\", "_").replace(":", "_")
            output_file = f'analysis_results/{safe_filename}_analysis.txt'
            
            # Analyze the sheet
            analyze_sheet(sheet_name, df, output_file)
            print(f"Analysis saved to: {output_file}")
            
        except Exception as e:
            print(f"Error analyzing sheet {sheet_name}: {str(e)}")
            # Create error log
            with open(f'analysis_results/{safe_filename}_error.log', 'w') as f:
                f.write(f"Error analyzing sheet {sheet_name}:\n{str(e)}")
    
    print("\nAnalysis complete! Check the 'analysis_results' directory for detailed reports.")

if __name__ == "__main__":
    main() 