
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
import models
import schemas

# CREATE
async def create_todo(db: AsyncSession, todo: schemas.TodoCreate):
    new_todo = models.Todo(**todo.dict())
    db.add(new_todo)
    await db.commit()
    await db.refresh(new_todo)
    return new_todo

# READ
async def get_todos(db: AsyncSession):
    result = await db.execute(select(models.Todo))
    return result.scalars().all()

async def get_todo(db: AsyncSession, todo_id: int):
    result = await db.execute(select(models.Todo).where(models.Todo.id == todo_id))
    return result.scalar_one_or_none()

# UPDATE
async def update_todo(db: AsyncSession, todo_id: int, todo: schemas.TodoUpdate):
    existing = await get_todo(db, todo_id)
    if existing is None:
        return None
    for key, value in todo.dict().items():
        setattr(existing, key, value)
    await db.commit()
    await db.refresh(existing)
    return existing

# DELETE
async def delete_todo(db: AsyncSession, todo_id: int):
    todo = await get_todo(db, todo_id)
    if todo is None:
        return False
    await db.delete(todo)
    await db.commit()
    return True
