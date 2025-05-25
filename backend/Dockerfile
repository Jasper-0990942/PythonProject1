# Gebruik de Alpine base image waarin Python al geïnstalleerd staat
FROM python:3.11-alpine
# Stel de actieve folder in de container in op /app.
WORKDIR /app
# Kopieer de bestanden van jouw applicatie op jouw computer naar decontainer.
COPY ./ /app/
# Installeer de verschillende pip-modules.
RUN pip install -r requirements.txt
# Open port 5000 in de container zodat we van buiten naar binnen kunnen
EXPOSE 5000
# Run the application
CMD ["python", "app.py"]