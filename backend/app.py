from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import json
import uuid

app = Flask(__name__)
CORS(app)

# --- MySQL Connection Configuration ---
# IMPORTANT: Replace with your actual MySQL credentials
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '202130',
    'database': 'intership'
}

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    conn = mysql.connector.connect(**db_config)
    return conn

def calculate_similarity(candidate_skills, candidate_interests, internship_dict):
    """Calculate similarity score between candidate and internship"""
    internship_skills = json.loads(internship_dict['skills_required'])
    
    # Skills matching
    candidate_skills_set = set(candidate_skills)
    internship_skills_set = set(internship_skills)
    skills_overlap = len(candidate_skills_set.intersection(internship_skills_set))
    skills_score = skills_overlap / max(len(internship_skills_set), 1)
    
    # Interest matching (department vs candidate interests)
    interest_score = 1.0 if internship_dict['department'] in candidate_interests else 0.5
    
    # Location preference
    # The original logic was checking the last interest item as a location.
    # This might be a bug, but we'll preserve it.
    location_score = 1.0 if internship_dict['location'].lower() in [loc.lower() for loc in [candidate_interests[-1]]] else 0.8
    
    # Combined score
    final_score = (skills_score * 0.6) + (interest_score * 0.3) + (location_score * 0.1)
    return min(final_score, 1.0)

@app.route('/recommend', methods=['POST'])
def recommend_internships():
    try:
        candidate_data = request.json
        candidate_id = str(uuid.uuid4())

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Store candidate data
        sql = """
            INSERT INTO candidates (id, name, education, skills, interests, location)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            candidate_id,
            candidate_data['name'],
            candidate_data['education'],
            json.dumps(candidate_data['skills']),
            json.dumps(candidate_data['interests']),
            candidate_data['location']
        )
        cursor.execute(sql, values)

        # Get all internships
        cursor.execute('SELECT * FROM internships')
        internships = cursor.fetchall()

        # Calculate similarity scores
        recommendations = []
        for internship in internships:
            score = calculate_similarity(
                candidate_data['skills'],
                candidate_data['interests'],
                internship
            )
            
            # Deserialize skills_required for the response
            internship['skills_required'] = json.loads(internship['skills_required'])

            recommendations.append({
                'internship': internship,
                'score': score
            })
        
        # Sort by score and return top 5
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        top_recommendations = recommendations[:5]
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'internships': [r['internship'] for r in top_recommendations],
            'match_scores': [r['score'] for r in top_recommendations]
        })
        
    except Exception as e:
        print(f"Error in /recommend: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/internships', methods=['GET'])
def get_internships():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM internships ORDER BY created_at DESC')
        internships = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Deserialize the JSON string in skills_required for each internship
        for internship in internships:
            internship['skills_required'] = json.loads(internship['skills_required'])
        
        return jsonify(internships)
        
    except Exception as e:
        print(f"Error in /internships: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/internship/<internship_id>', methods=['GET'])
def get_internship(internship_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('SELECT * FROM internships WHERE id = %s', (internship_id,))
        internship = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if internship:
            # Deserialize the JSON string in skills_required
            internship['skills_required'] = json.loads(internship['skills_required'])
            return jsonify(internship)
        else:
            return jsonify({'error': 'Internship not found'}), 404
            
    except Exception as e:
        print(f"Error in /internship/{internship_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/add_internship', methods=['POST'])
def add_internship():
    try:
        data = request.json
        internship_id = str(uuid.uuid4())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
            INSERT INTO internships (id, title, sector, skills_required, location, stipend, capacity, department)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            internship_id,
            data['title'],
            data.get('sector', data['department']),
            json.dumps(data.get('skills_required', [])),
            data['location'],
            data['stipend'],
            data['capacity'],
            data['department']
        )
        cursor.execute(sql, values)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Internship added successfully', 'id': internship_id})
        
    except Exception as e:
        print(f"Error in /add_internship: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/delete_internship/<internship_id>', methods=['DELETE'])
def delete_internship(internship_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM internships WHERE id = %s', (internship_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Internship not found'}), 404
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Internship deleted successfully'})
        
    except Exception as e:
        print(f"Error in /delete_internship: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/edit_internship/<internship_id>', methods=['PUT'])
def edit_internship(internship_id):
    try:
        data = request.json
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
            UPDATE internships 
            SET title = %s, sector = %s, skills_required = %s, location = %s, stipend = %s, capacity = %s, department = %s
            WHERE id = %s
        """
        values = (
            data['title'],
            data.get('sector', data['department']),
            json.dumps(data.get('skills_required', [])),
            data['location'],
            data['stipend'],
            data['capacity'],
            data['department'],
            internship_id
        )
        cursor.execute(sql, values)
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Internship not found'}), 404
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Internship updated successfully'})
        
    except Exception as e:
        print(f"Error in /edit_internship: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # It's assumed the database and tables are already created in MySQL.
    # The init_db() call is removed.
    app.run(debug=True, port=5000)
