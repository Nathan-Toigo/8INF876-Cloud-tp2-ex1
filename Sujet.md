# Question I
Dans ce projet, vous allez déployer une application web à deux niveaux avec une base de données et un frontend,
en utilisant des services, des déploiements et des volumes persistants.

## Étape 1: Prérequis
Assurez-vous d'avoir Minikube, Docker et kubectl installés.
1) Installer Docker: Kubernetes utilise Docker pour gérer les conteneurs.
Sur Ubuntu:
```bash
sudo apt-get update
sudo apt-get install docker.io
docker --version
```
2) Installer kubectl: C'est l'outil de ligne de commande pour interagir avec le cluster Kubernetes.
Sur Ubuntu:

```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - echo "deb https://apt.kubernetes.io/
kubernetes-xenial main" | sudo tee -a /etc/apt/sourc
sudo apt-get update
sudo apt-get install -y kubectl
*ENFAIT NON : *
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```

3) Installer Minikube: C'est un outil qui permet de créer un cluster Kubernetes localement.
Sur Ubuntu:
```bash
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux
sudo mv minikube /usr/local/bin/
*ENFAIT NON : *
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```
## Étape 2: Déployer une base de données
1. Déploiement de la base de données:
Créez un fichier mysql-deployment.yaml:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:5.7
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "password"
          ports:
            - containerPort: 3306

```
Appliquez le déploiement:
```bash
kubectl apply -f mysql-deployment.yaml
```
2. Service MySQL:
Créez un fichier mysql-service.yaml:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
    - port: 3306
  selector:
    app: mysql
```
Appliquez le service:
```bash
kubectl apply -f mysql-service.yaml
```
## Étape 3: Déployer une application frontend

1) Déploiement du frontend:
Créez un fichier frontend-deployment.yaml:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: [VOTRE_IMAGE_FRONTEND]
          ports:
            - containerPort: 80
```
Remplacez [VOTRE_IMAGE_FRONTEND] par l'image Docker de votre frontend.
Appliquez le déploiement:
```bash
kubectl apply -f frontend-deployment.yaml
```
2) Service Frontend:
Créez un fichier frontend-service.yaml:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: frontend
```
Appliquez le service:
```bash
kubectl apply -f frontend-service.yaml
```

## Étape 4: Volumes Persistants
Pour que la base de données conserve ses données même après un redémarrage, nous utiliserons unvolume
persistant.
1. Créer un PersistentVolumeClaim:
Créez un fichier mysql-pvc.yaml:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Appliquez le PVC:
```bash
kubectl apply -f mysql-pvc.yaml 
```

1. Modifiez le fichier mysql-deployment.yaml pour ajouter le volume:
```yaml
spec:
  containers:
    - name: mysql
      image: mysql:5.7
      env:
        - name: MYSQL_ROOT_PASSWORD
          value: "password"
      ports:
        - containerPort: 3306
      volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
  volumes:
    - name: mysql-persistent-storage
      persistentVolumeClaim:
        claimName: mysql-pvc
```

Appliquez les modifications:
```bash
kubectl apply -f mysql-deployment.yaml
```
## Étape 5: Accéder à l'application

Utilisez la commande suivante pour obtenir l'URL du frontend:
```bash
minikube service frontend --url
```

Visitez l'URL pour accéder à votre application.
## Étape 6: Nettoyage

Supprimez les ressources créées:
```bash
kubectl delete -f frontend-service.yaml
kubectl delete -f frontend-deployment.yaml
kubectl delete -f mysql-service.yaml
kubectl delete -f mysql-deployment.yaml
kubectl delete -f mysql-pvc.yaml
```
Arrêtez Minikube:
```bash
minikube stop
```


## Description du Projet Kubernetes à Deux Niveaux
Dans ce projet, nous avons déployé une application web structurée en deux niveaux sur un clusterKubernetes local à l'aide de Minikube. L'architecture est composée des éléments suivants:
1) Base de données (Backend):
- Déploiement MySQL: Nous avons utilisé une image Docker officielle de MySQL pour déployer une instance de base de données dans notre cluster.
- Service MySQL: Pour permettre à d'autres composants du cluster de communiquer avec MySQL, nous avons créé un service Kubernetes.
- Volume Persistant: Afin de garantir la persistance des données de la base de données, même après le redémarrage des pods ou du cluster, nous avons utilisé un volume persistant. Ce volume est lié à un Persistent
- Volume Claim (PVC) qui réserve une certaine quantité d'espace de stockage pour notre base de données.
- Application Frontend: Déploiement Frontend: Cette partie représente l'interface utilisateur de notre application. Nous avons supposé que vous aviez une image Docker pour le frontend, qui serait déployée dans le cluster.
2) Service Frontend: Pour rendre l'application frontend accessible depuis l'extérieur du cluster, nous avons
créé un service de type NodePort.

L'application frontend communique avec la base de données MySQL pour effectuer diverses opérations CRUD (Create, Read, Update, Delete). Grâce à l'architecture de Kubernetes, il est possible de mettre à l'échelle, de surveiller et de gérer facilement cette application à deux niveaux.
Dans cette question :
- Montrez et exécutez ces étapes dans cette question utilisant vos ordinateurs
- Expliquez le type NodePort avec un exemple (executable).
