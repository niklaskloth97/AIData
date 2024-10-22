# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables for Python and Flask
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py \
    FLASK_ENV=development

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt into the container
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Expose port 5000 to the outside world
EXPOSE 5000

# Set environment variables to load your .env file for secrets and configurations
COPY .env /app/.env

# Command to run the Flask app using gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]
