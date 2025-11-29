## 1. Create and run virtual environment
### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 2. Install essential library from `requirements.txt`

After activating the virtual environment, run:

```bash
pip install -r requirements.txt
```

This command will install all the dependencies in `requirements.txt`.

---

## 3. Run app using uvicorn

### Run server (development mode)

```bash
uvicorn src.main:app --reload
```

### Run server with customized host and port

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### Run production mode (no reload)

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 4. Note

* Always activate the virtual environment before running uvicorn
* If the file structure is changed, remember to update the path to `app.main:app`.

---

## 5. Quick start

```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```
