import pandas as pd
import matplotlib.pyplot as plt
import os
from datetime import datetime

def create_output_directory():
    """Create a directory for detailed analysis outputs"""
    output_dir = 'detailed_sheet_analysis'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    return output_dir

def save_df_sample(df, sheet_name, output_dir, rows=50):
    """Save a sample of the dataframe to a CSV file"""
    output_file = os.path.join(output_dir, f"{sheet_name.replace(' ', '_').replace('&', 'and')}_sample.csv")
    df.head(rows).to_csv(output_file, index=False)
    print(f"Saved sample of {sheet_name} to {output_file}")

def analyze_sheet(df, sheet_name, output_dir):
    """Perform comprehensive analysis of a sheet"""
    print(f"\n{'='*80}")
    print(f"ANALYZING SHEET: {sheet_name}")
    print(f"{'='*80}")
    
    # Basic info
    print(f"\nBasic Information:")
    print(f"- Shape: {df.shape} (rows, columns)")
    print(f"- Column names: {df.columns.tolist()}")
    
    # Check for empty rows and columns
    empty_rows = df.isna().all(axis=1).sum()
    empty_cols = df.isna().all(axis=0).sum()
    print(f"- Empty rows: {empty_rows} ({empty_rows/len(df)*100:.2f}%)")
    print(f"- Empty columns: {empty_cols} ({empty_cols/len(df.columns)*100:.2f}%)")
    
    # Display first few rows
    print("\nFirst 10 rows:")
    print(df.head(10))
    
    # Attempt to identify header row
    potential_header_rows = []
    for i in range(min(20, len(df))):
        non_na_count = df.iloc[i].notna().sum()
        if non_na_count > 3:  # If row has at least 3 non-NA values
            potential_header_rows.append((i, non_na_count, df.iloc[i].tolist()))
    
    print("\nPotential header rows:")
    for i, count, values in potential_header_rows:
        print(f"Row {i}: {count} non-NA values")
        print(f"   Content: {values}")
    
    # Try to identify data structure sections
    print("\nData Structure Analysis:")
    data_sections = []
    section_start = None
    section_name = None
    
    for i in range(min(100, len(df))):
        row = df.iloc[i]
        # Look for rows with content in the first few columns that might be section headers
        if pd.notna(row.iloc[0]) or pd.notna(row.iloc[1]) or pd.notna(row.iloc[2]):
            # If this looks like a new section and we had previously found a section
            if section_start is not None:
                data_sections.append({
                    'name': section_name,
                    'start_row': section_start,
                    'end_row': i-1
                })
            
            # Start a new section
            section_start = i
            # Try to determine section name from first non-NA value
            for val in row:
                if pd.notna(val) and isinstance(val, str) and len(val.strip()) > 0:
                    section_name = val
                    break
    
    # Add the last section if we found one
    if section_start is not None:
        data_sections.append({
            'name': section_name,
            'start_row': section_start,
            'end_row': min(section_start + 20, len(df) - 1)  # Assume it goes for at least 20 rows
        })
    
    # Print identified sections
    for i, section in enumerate(data_sections):
        print(f"\nSection {i+1}: {section['name']}")
        print(f"  Rows {section['start_row']} to {section['end_row']}")
        print(f"  Sample content:")
        start = section['start_row']
        end = min(start + 5, section['end_row'])
        print(df.iloc[start:end+1])
    
    # Check for numeric data
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    print(f"\nNumeric columns: {numeric_cols}")
    
    if numeric_cols:
        print("\nBasic statistics for numeric columns:")
        print(df[numeric_cols].describe())
    
    # Check for data tables (continuous blocks with non-NA values)
    print("\nSearching for continuous data tables...")
    
    # Try to identify continuous blocks of data
    data_blocks = []
    in_block = False
    block_start = None
    
    for i in range(min(200, len(df))):
        row_values = df.iloc[i].notna().sum()
        if row_values >= 3:  # If row has at least 3 non-NA values, it might be part of a data table
            if not in_block:
                in_block = True
                block_start = i
        else:
            if in_block:
                in_block = False
                data_blocks.append((block_start, i-1))
                block_start = None
    
    # Add last block if still in one
    if in_block:
        data_blocks.append((block_start, min(block_start + 20, len(df) - 1)))
    
    # Print identified data blocks
    for i, (start, end) in enumerate(data_blocks):
        if end - start >= 2:  # Only consider blocks with at least 3 rows
            print(f"\nData Block {i+1}: Rows {start} to {end}")
            print(f"  Sample content:")
            print(df.iloc[start:min(start+5, end+1)])
    
    # Save sample to file
    save_df_sample(df, sheet_name, output_dir)
    
    # Return the analysis summary
    return {
        'shape': df.shape,
        'empty_rows': empty_rows,
        'empty_cols': empty_cols,
        'potential_header_rows': potential_header_rows,
        'data_sections': data_sections,
        'numeric_cols': numeric_cols,
        'data_blocks': data_blocks
    }

def create_cleaned_df(df, sheet_name, header_row=None):
    """Create a cleaned version of the dataframe with proper headers"""
    if header_row is not None:
        # Use the specified row as header
        new_headers = df.iloc[header_row].tolist()
        df_cleaned = df.iloc[header_row+1:].copy()
        df_cleaned.columns = new_headers
        
        # Replace NaN values in column names with generic names
        for i, col in enumerate(df_cleaned.columns):
            if pd.isna(col):
                df_cleaned.rename(columns={col: f"Column_{i+1}"}, inplace=True)
    else:
        # Just create a copy
        df_cleaned = df.copy()
    
    # Clean up the dataframe
    df_cleaned = df_cleaned.dropna(how='all')  # Remove completely empty rows
    
    return df_cleaned

def main():
    """Main function to analyze Faculty & Portfolio data and School & Department data sheets"""
    output_dir = create_output_directory()
    
    # Read the Excel file sheets
    file_path = 'Flight data snapshot CY2024_FEIT.xlsx'
    
    print(f"Reading Excel file: {file_path}")
    
    # First, just get the sheet names
    xls = pd.ExcelFile(file_path)
    sheets = xls.sheet_names
    print(f"Available sheets: {sheets}")
    
    # Target sheets
    target_sheets = ['1. Faculty & portfolio data', '2. School & department data']
    
    analysis_results = {}
    
    for sheet_name in target_sheets:
        if sheet_name in sheets:
            # Read the sheet
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            print(f"\nSuccessfully read sheet: {sheet_name}")
            
            # Analyze the sheet
            analysis_results[sheet_name] = analyze_sheet(df, sheet_name, output_dir)
            
            # Try to create a cleaned version with the first potential header row
            potential_headers = analysis_results[sheet_name]['potential_header_rows']
            if potential_headers:
                header_row = potential_headers[0][0]  # Use the first potential header row
                df_cleaned = create_cleaned_df(df, sheet_name, header_row)
                
                # Save the cleaned version
                cleaned_file = os.path.join(output_dir, f"{sheet_name.replace(' ', '_').replace('&', 'and')}_cleaned.csv")
                df_cleaned.to_csv(cleaned_file, index=False)
                print(f"\nSaved cleaned version of {sheet_name} to {cleaned_file}")
        else:
            print(f"\nWarning: Sheet '{sheet_name}' not found in Excel file")
    
    # Save the full analysis results
    with open(os.path.join(output_dir, 'analysis_summary.txt'), 'w') as f:
        f.write(f"Analysis performed on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        for sheet_name, results in analysis_results.items():
            f.write(f"{'='*80}\n")
            f.write(f"SHEET: {sheet_name}\n")
            f.write(f"{'='*80}\n\n")
            
            f.write(f"Shape: {results['shape']} (rows, columns)\n")
            f.write(f"Empty rows: {results['empty_rows']} ({results['empty_rows']/results['shape'][0]*100:.2f}%)\n")
            f.write(f"Empty columns: {results['empty_cols']} ({results['empty_cols']/results['shape'][1]*100:.2f}%)\n\n")
            
            f.write("Potential header rows:\n")
            for i, count, values in results['potential_header_rows']:
                f.write(f"Row {i}: {count} non-NA values\n")
            f.write("\n")
            
            f.write("Data sections:\n")
            for i, section in enumerate(results['data_sections']):
                f.write(f"Section {i+1}: {section['name']}\n")
                f.write(f"  Rows {section['start_row']} to {section['end_row']}\n")
            f.write("\n")
            
            f.write(f"Numeric columns: {results['numeric_cols']}\n\n")
            
            f.write("Data blocks:\n")
            for i, (start, end) in enumerate(results['data_blocks']):
                if end - start >= 2:
                    f.write(f"Block {i+1}: Rows {start} to {end}\n")
    
    print(f"\nAnalysis complete! Check the '{output_dir}' directory for detailed results.")

if __name__ == "__main__":
    main() 