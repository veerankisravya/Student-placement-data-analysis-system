"""
Flask Application Entry Point
Student Placement Data Analysis and Prediction System
"""
import math
import os
from flask import Flask, jsonify, request
import mysql.connector
from config import Config
from services.prediction import predict_student_placement

app = Flask(__name__)
app.config.from_object(Config)

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=app.config['MYSQL_HOST'],
            port=app.config['MYSQL_PORT'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            database=app.config['MYSQL_DB']
        )
        return conn
    except mysql.connector.Error as error:
        raise RuntimeError('Could not connect to the configured MySQL database.') from error

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "active", "service": "Placement Intelligence API"})

@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json."}), 415

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "The request body must be a JSON object."}), 400

    fields = {
        'cgpa': (0, 10, False),
        'backlogs': (0, None, True),
        'aptitude_score': (0, 100, False),
        'technical_score': (0, 100, False),
        'communication_score': (0, 100, False),
        'internship_months': (0, None, True),
    }
    for field, (minimum, maximum, integer_only) in fields.items():
        value = data.get(field)
        if value is None:
            continue
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            return jsonify({"error": f"{field} must be a number."}), 400
        if not math.isfinite(value) or value < minimum or (maximum is not None and value > maximum):
            return jsonify({"error": f"{field} is outside the allowed range."}), 400
        if integer_only and not isinstance(value, int):
            return jsonify({"error": f"{field} must be an integer."}), 400

    result = predict_student_placement(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.getenv('PORT', '5000')))
