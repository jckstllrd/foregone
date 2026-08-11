import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")


def connect():
    try:
        with psycopg2.connect(
            host=DATABASE_HOST,
            database=DATABASE_NAME,
            user=DATABASE_USERNAME,
            password=DATABASE_PASSWORD,
        ) as conn:
            print("Connected to the PostgreSQL server.")
            return conn
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)


if __name__ == "__main__":
    connect()
