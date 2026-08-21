from flask import Flask, request, jsonify
app = Flask(__name__)
@app.route("/", methods=["GET"])
def status():
    authorization = request.headers.get("Authorization")
    if not authorization:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({
        "status": {
            "website": "online",
            "roblox": "online"
        }
    })
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)