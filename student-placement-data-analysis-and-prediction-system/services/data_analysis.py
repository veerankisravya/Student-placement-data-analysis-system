"""
Pandas and NumPy Data Analysis Service for Placement Analytics
"""
import pandas as pd
import numpy as np

def compute_placement_statistics(students_list):
    if not students_list:
        return {}

    df = pd.DataFrame(students_list)
    total = len(df)
    placed_df = df[df['placement_status'] == 'Placed']
    placed_count = len(placed_df)
    rate = round((placed_count / total) * 100, 2) if total > 0 else 0.0

    packages = placed_df['package_lpa'].dropna()
    avg_pkg = round(float(packages.mean()), 2) if len(packages) > 0 else 0.0
    max_pkg = round(float(packages.max()), 2) if len(packages) > 0 else 0.0

    # Branch-wise aggregation
    dept_grp = df.groupby('department').agg(
        total=('id', 'count'),
        placed=('placement_status', lambda s: (s == 'Placed').sum())
    ).reset_index()

    dept_grp['rate'] = round((dept_grp['placed'] / dept_grp['total']) * 100, 1)

    return {
        "total_students": total,
        "placed_students": placed_count,
        "unplaced_students": total - placed_count,
        "placement_rate_percent": rate,
        "avg_package_lpa": avg_pkg,
        "highest_package_lpa": max_pkg,
        "department_summary": dept_grp.to_dict(orient='records')
    }
