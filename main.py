from fastapi import FastAPI, File, UploadFile, HTTPException
import os
import pandas as pd
from PyPDF2 import PdfReader
from fastapi.middleware.cors import CORSMiddleware



UPLOAD_FOLDER = "./uploaded_files"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ensure this matches your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith((".csv", ".xlsx", ".pdf")):
        raise HTTPException(status_code=400, detail="Only .csv, .xlsx, or .pdf files are allowed")

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"filename": file.filename, "message": "File uploaded successfully"}

@app.get("/query/")
async def query_file(filename: str, keyword: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Handle PDF files
    if filename.endswith(".pdf"):
        try:
            reader = PdfReader(file_path)
            full_text = ""
            for page in reader.pages:
                full_text += page.extract_text()
            
            if keyword.lower() in full_text.lower():
                return {"message": f"Keyword '{keyword}' found in the document."}
            else:
                return {"message": f"Keyword '{keyword}' not found in the document."}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

    # Handle CSV and Excel files
    if filename.endswith((".csv", ".xlsx")):
        try:
            if filename.endswith(".csv"):
                data = pd.read_csv(file_path)
            else:
                data = pd.read_excel(file_path)

            if data.apply(lambda row: row.astype(str).str.contains(keyword, case=False).any(), axis=1).any():
                return {"message": f"Keyword '{keyword}' found in the file."}
            else:
                return {"message": f"Keyword '{keyword}' not found in the file."}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

    raise HTTPException(status_code=400, detail="File format not supported")
