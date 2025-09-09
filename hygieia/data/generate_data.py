import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

def generate_hospital_data(high_icu=True, staff_shortage=False, days=30):
    dates = [datetime.now() - timedelta(days=x) for x in range(days)]

    # Base parameters
    base_patient_count = np.random.normal(100, 10, days)
    base_icu_rate = 0.25 if high_icu else 0.15
    base_staff = np.random.normal(50, 5, days)

    data = {
        'timestamp': dates,
        'patient_count': np.round(base_patient_count).astype(int),
        'icu_admissions': np.round(base_patient_count * base_icu_rate).astype(int),
        'ventilators_in_use': np.round(base_patient_count * base_icu_rate * 0.7).astype(int),
        'staff_on_duty': np.round(base_staff * (0.7 if staff_shortage else 1.0)).astype(int),
        'pollen_count': np.random.normal(50, 20, days)
    }

    return pd.DataFrame(data)

if __name__ == "__main__":
    # Always write CSVs next to this script, regardless of CWD
    out_dir = Path(__file__).resolve().parent
    out_dir.mkdir(parents=True, exist_ok=True)

    # Generate data for Hospital A (high ICU load)
    hospital_a = generate_hospital_data(high_icu=True, staff_shortage=False)
    hospital_a.to_csv(out_dir / 'hospital_A.csv', index=False)

    # Generate data for Hospital B (lower ICU, staff shortage)
    hospital_b = generate_hospital_data(high_icu=False, staff_shortage=True)
    hospital_b.to_csv(out_dir / 'hospital_B.csv', index=False)

    print(f"Generated synthetic data for Hospital A and Hospital B at {out_dir}")
