"""
Flask Application Entry Point
Student Placement Data Analysis and Prediction System
"""
from flask import Flask, jsonify, request, session, render_template, send_file
import mysql.connector
from config import Config
from services.data_analysis import compute_placement_statistics
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
    except Exception as e:
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "active", "service": "Placement Intelligence API"})

@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
    data = request.get_json() or {}
    result = predict_student_placement(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
