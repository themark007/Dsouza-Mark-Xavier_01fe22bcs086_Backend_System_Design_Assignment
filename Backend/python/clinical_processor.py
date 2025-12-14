import sys
import json
import re
import pdfplumber
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ---- LOAD ONCE ----
model = SentenceTransformer("all-MiniLM-L6-v2")

icd_df = pd.read_excel("ICD_code_Assignment.xlsx")[["ICD Code", "Description"]]
icd_df.columns = ["Code", "Description"]
icd_embeddings = model.encode(icd_df["Description"].tolist())

def extract_text_from_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for p in pdf.pages:
            if p.extract_text():
                text += p.extract_text()
    return text

def preprocess(t):
    return re.sub(r'\s+', ' ', t.lower()).strip()

def retrieve_codes(query, top_k=5):
    emb = model.encode([query])
    scores = cosine_similarity(emb, icd_embeddings)[0]
    idx = scores.argsort()[-top_k:][::-1]
    return icd_df.iloc[idx]["Code"].tolist()

# ---- MAIN ----
payload = json.loads(sys.stdin.read())

if "pdfPath" in payload:
    text = extract_text_from_pdf(payload["pdfPath"])
else:
    text = payload["text"]

text = preprocess(text)

result = {
    "Clinical Terms": ["Gastritis"] if "gastritis" in text else [],
    "Procedures": ["EGD"] if "egd" in text else [],
    "ICD-10": retrieve_codes(text),
    "CPT": ["43239"] if "biopsy" in text else [],
    "HCPCS": ["J3490"] if "propofol" in text else []
}

print(json.dumps(result))
