# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.9-bullseye

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONDONTWRITEBYTECODE TRUE
ENV PYTHONUNBUFFERED TRUE

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Install production dependencies.
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --no-cache-dir

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
# CMD exec gunicorn --bind :8000 --workers 1 --timeout 0 main:app --preload
# CMD gunicorn -b :8000 --timeout 0 main:app --preload --log-level=debug --access-logfile -
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app --log-level=debug --access-logfile -