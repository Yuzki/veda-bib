from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open("data/jaibs-1.json", encoding="utf-8") as f:
    data = json.load(f)


@app.route("/search")
def search():
    query = request.args.get("q", "").lower()
    if not query:
        return jsonify(data)

    results = {
        k: v for k, v in data.items() if query in k.lower() or any(query in str(e).lower() for e in v.get("abbreviation", []))
    }
    return jsonify(results)


if __name__ == "__main__":
    app.run(host="0.0.0.0")
