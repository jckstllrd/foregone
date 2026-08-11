import os

from dotenv import load_dotenv
from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel


class Message(BaseModel):
    conversationId: int
    messageContent: str


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
    return res
