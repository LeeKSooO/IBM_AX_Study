from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Release Test"}

@app.get("/echo")
def echo(msg: str):
    return {"you_said": msg}