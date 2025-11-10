# Mise en place

## Installations et execution


### 1️⃣ Prérequis
- Docker
- kubectl
- Minikube

### 2️⃣ Installations

Docker
```bash
sudo apt-get update
sudo apt-get install docker.io -y
docker --version
```

Kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```
Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```

## Lancement de la solution

### Déploiement de la BD

Lancement de Minikube

```bash
minikube start
```

Déploiement de la base de donnée : 

```bash
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
```

### Build et déploiement du frontend

Build et application des configs : 

```bash
eval $(minikube docker-env)
docker build -t frontend_ex:latest .

kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

## Accès au serveur déployé

Récuperation de l'adresse du serveur
```bash
minikube service frontend
```

## 🧹 Nettoyage

```bash
kubectl delete -f frontend-service.yaml
kubectl delete -f frontend-deployment.yaml
kubectl delete -f mysql-service.yaml
kubectl delete -f mysql-deployment.yaml
kubectl delete -f mysql-pvc.yaml
```

# Infos

## 🧰 Technologies utilisées

| Technologie | Rôle | Détails |
|--------------|------|----------|
| **React + Vite** | Frontend | Interface utilisateur compilée avec Vite pour rapidité et simplicité |
| **Docker** | Conteneurisation | Création de l’image du frontend (`frontend_ex:latest`) |
| **MySQL 5.7** | Base de données | Stocke les données, déployée dans le cluster Kubernetes |
| **Kubernetes (Minikube)** | Orchestrateur | Gère le déploiement, les services et les volumes persistants |

## 🏗️ Architecture

Le projet repose sur une architecture à deux niveaux :
1. **Frontend React** : application web accessible via un service NodePort.
2. **Base de données MySQL** : accessible uniquement depuis le cluster via un service interne.

```plaintext
Utilisateur 👤
     │
     ▼
[Frontend React + Vite]  ← (Service NodePort)
     │
     ▼
   [MySQL Database]      ← (Service ClusterIP + PVC)
```