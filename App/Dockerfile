FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN useradd -m appuser
USER appuser

EXPOSE 5000

# Run the app from the package path copied into the image
CMD ["python", "src/app.py"]