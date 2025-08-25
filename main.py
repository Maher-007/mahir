from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import AsyncSessionLocal
from schemas import TodoCreate
from crud import create_todo, get_todos
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
import models
import database
import schemas
import crud

app = FastAPI()

# Allow frontend CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Session Dependency
async def get_db():
    async with database.AsyncSessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

@app.post("/todos/", response_model=schemas.TodoOut)
async def create(todo: schemas.TodoCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_todo(db, todo)

@app.get("/todos/", response_model=list[schemas.TodoOut])
async def read_all(db: AsyncSession = Depends(get_db)):
    return await crud.get_todos(db)

@app.get("/todos/{todo_id}", response_model=schemas.TodoOut)
async def read_one(todo_id: int, db: AsyncSession = Depends(get_db)):
    todo = await crud.get_todo(db, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.put("/todos/{todo_id}", response_model=schemas.TodoOut)
async def update(todo_id: int, todo: schemas.TodoUpdate, db: AsyncSession = Depends(get_db)):
    updated = await crud.update_todo(db, todo_id, todo)
    if updated is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated

@app.delete("/todos/{todo_id}")
async def delete(todo_id: int, db: AsyncSession = Depends(get_db)):
    success = await crud.delete_todo(db, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"ok": True}
