# THESORIA AI Master Agent - Production Dockerfile
# Optimisé pour latence minimale et autonomie totale

FROM python:3.11-slim

# Métadonnées
LABEL maintainer="THESORIA Graal Team"
LABEL description="AI Master Agent - Autonomous MEV System"
LABEL version="2.0.0"

# Variables d'environnement
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Créer user non-root
RUN useradd -m -u 1000 thesoria && \
    mkdir -p /app && \
    chown -R thesoria:thesoria /app

# Workdir
WORKDIR /app

# Copier requirements
COPY requirements.txt .

# Installer dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY --chown=thesoria:thesoria . .

# User non-root pour sécurité
USER thesoria

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import os; exit(0 if os.path.exists('/tmp/agent_healthy') else 1)"

# Exposer port Prometheus
EXPOSE 9000

# Point d'entrée
CMD ["python", "master/ai_master_agent.py"]
