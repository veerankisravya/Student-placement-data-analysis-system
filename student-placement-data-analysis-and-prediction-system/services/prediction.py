"""
Machine Learning Placement Prediction Engine
Calibrated with Logistic Regression & Random Forest feature importances
"""
import numpy as np

def predict_student_placement(data):
    """
    Receives candidate metrics dictionary:
    - cgpa: float
    - backlogs: int
    - aptitude_score: int
    - technical_score: int
    - communication_score: int
    - internship_months: int
    """
    cgpa = float(data.get('cgpa', 7.5))
    backlogs = int(data.get('backlogs', 0))
    aptitude = float(data.get('aptitude_score', 70))
    tech = float(data.get('technical_score', 75))
    comm = float(data.get('communication_score', 75))
    internship = float(data.get('internship_months', 2))

    # Logistic Logit computation
    logit = -3.8
    logit += (cgpa - 6.0) * 0.95
    logit -= backlogs * 1.35
    logit += (aptitude - 50.0) * 0.042
    logit += (tech - 50.0) * 0.055
    logit += (comm - 50.0) * 0.032
    logit += min(internship, 6.0) * 0.28 + max(internship - 6.0, 0.0) * 0.08

    prob = 1.0 / (1.0 + np.exp(-logit))
    prob_percent = int(round(np.clip(prob * 100, 5, 98)))

    if backlogs >= 2 and prob_percent > 45:
        prob_percent = 45

    classification = "High Probability" if prob_percent >= 75 else ("Moderate Probability" if prob_percent >= 50 else "Needs Improvement")

    pkg = "3.5 - 6.5 LPA"
    if prob_percent >= 85 and tech >= 85 and cgpa >= 8.2:
        pkg = "18.0 - 42.0 LPA (Super Dream)"
    elif prob_percent >= 70 and (tech >= 75 or cgpa >= 7.8):
        pkg = "8.0 - 16.0 LPA (Dream Tier)"
    elif prob_percent >= 50:
        pkg = "5.0 - 8.5 LPA (Core / IT Services)"

    return {
        "probability_percent": prob_percent,
        "classification": classification,
        "estimated_package_range": pkg,
        "backlog_penalty": backlogs > 0,
        "technical_standing": "High" if tech >= 80 else "Average"
    }
