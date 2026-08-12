import os
import uuid

import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel

from app.db.connect import connect


class Message(BaseModel):
    conversationId: int
    messageContent: str


def add_message_to_db(message):
    insert_query = """INSERT INTO messages (conversation_id, content) VALUES (%s, %s) RETURNING id, conversation_id, content;"""
    data = ("dfd389d4-f57b-4b49-afff-1074918fc7da", message)
    conn = connect()
    try:
        with conn.cursor() as cur:
            print(cur)
            cur.execute(insert_query, data)
            data = cur.fetchone()
            print("Message ID for latest entry: ", data)

    except (psycopg2.DatabaseError, Exception) as error:
        print(error)
    conn.commit()


app = FastAPI()
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
ORGANISATION_KEY = os.getenv("OPENAI_ORGANISATION_ID")
client = OpenAI(api_key=API_KEY, organization=ORGANISATION_KEY)


async def call_ai(message):
    response = client.responses.create(
        model="gpt-4.1-nano",
        instructions="You are a golf instructor, only ever give golf and drills to the user",
        input=message,
    )
    return response.output_text


@app.post("/")
async def send_message(req: Message):
    res = await call_ai(req.messageContent)
    add_message_to_db(res)
    return res
