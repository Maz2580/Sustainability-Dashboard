import pandas as pd
xls_path = "Flight data snapshot CY2024_FEIT.xlsx"

# 4-A. Create an ExcelFile object (light-weight, no data loaded yet)
xls = pd.ExcelFile(xls_path)
 
# 4-B. List sheet names
print("Sheets:", xls.sheet_names) 