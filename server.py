import os
from flask import Flask, request, jsonify, send_from_directory
from google import genai

app = Flask(__name__, static_folder=".")

API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set.")

client = genai.Client(api_key=API_KEY)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def files(path):
    return send_from_directory(".", path)


@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({
            "answer": "Question missing."
        }), 400

    user_question = data["question"].strip()

    if not user_question:
        return jsonify({
            "answer": "Please enter a question."
        }), 400

    try:

        prompt = f"""
You are AYUSHQ, a helpful AI assistant.

Answer the user's question clearly and accurately.

User question:
{user_question}

Rules:
- Use simple language when possible.
- For maths, show the steps.
- For education, explain like a helpful teacher.
- Do not make up facts.
- If you are uncertain, say so.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return jsonify({
            "answer": response.text
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "answer": "AI se answer lene mein problem aa gayi."
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
