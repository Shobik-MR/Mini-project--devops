# TaskFlow — Docker & Kubernetes Mini Project

A simple, responsive task management web application built with HTML, CSS, and JavaScript, containerized using Docker, and deployed locally on Kubernetes.

##  Project Overview

TaskFlow allows users to manage daily tasks through a clean and responsive interface. This project demonstrates how to package a web application into a Docker image and deploy it using Kubernetes.

**Project objectives:**

* Develop a simple task management web application.
* Containerize the application using Docker and Nginx.
* Deploy the container on a local Kubernetes cluster.
* Expose the application using a Kubernetes Service.
* Demonstrate scaling, self-healing, and rolling updates.

##  Features

* Add and delete tasks.
* Mark tasks as completed or incomplete.
* Track task counts and progress.
* Save tasks using browser localStorage.
* Responsive user interface.
* Serve the application using Nginx inside a Docker container.
* Manage application replicas using Kubernetes.

##  Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript
* **Web Server:** Nginx
* **Containerization:** Docker
* **Orchestration:** Kubernetes
* **Local Environment:** Docker Desktop
* **Version Control:** Git and GitHub

##  Project Structure

```text
kubernetes-mini-project/
├── app/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
├── Dockerfile
├── .dockerignore
└── README.md
```

##  Docker Setup

### 1. Build the Docker image

Open a terminal in the project root directory:

```powershell
docker build -t k8s-mini-web:v1 .
```

### 2. Run the container

```powershell
docker run -d -p 8081:80 --name taskflow-container k8s-mini-web:v1
```

### 3. Access the application

Open the following URL in your browser:

http://localhost:8081

### 4. Verify the container

```powershell
docker ps
```

To view container logs:

```powershell
docker logs taskflow-container
```

##  Kubernetes Deployment

This project uses the Kubernetes cluster provided by Docker Desktop.

### 1. Verify the cluster

Enable Kubernetes in Docker Desktop and run:

```powershell
kubectl get nodes
```

Confirm that the node status is `Ready`.

### 2. Deploy TaskFlow

Apply the Deployment configuration:

```powershell
kubectl apply -f k8s/deployment.yaml
```

Verify the Deployment and Pods:

```powershell
kubectl get deployments
kubectl get pods
```

### 3. Create the Kubernetes Service

```powershell
kubectl apply -f k8s/service.yaml
```

Verify the Service:

```powershell
kubectl get services
kubectl get endpoints taskflow-service
```

### 4. Access the application

Open:

http://localhost:30080

The NodePort Service forwards requests to port 80 in the TaskFlow Pods.

## Scaling

Scale the application to three replicas:

```powershell
kubectl scale deployment taskflow-deployment --replicas=3
```

Verify the replicas:

```powershell
kubectl get deployments
kubectl get pods
```

The Deployment maintains the desired number of Pods.

## Self-Healing

Kubernetes can replace a deleted Pod managed by a Deployment.

List the Pods:

```powershell
kubectl get pods
```

Delete one Pod using its actual name:

```powershell
kubectl delete pod <pod-name>
```

Check the Pods again:

```powershell
kubectl get pods
```

Kubernetes creates a replacement to maintain the desired replica count.

##  Rolling Update

A rolling update replaces application Pods gradually when the Deployment's Pod template changes.

### 1. Build a new image version

After making a change to the application files, build the new image:

```powershell
docker build -t k8s-mini-web:v2 .
```

### 2. Update the Deployment

```powershell
kubectl set image deployment/taskflow-deployment taskflow-container=k8s-mini-web:v2
```

### 3. Verify the rollout

```powershell
kubectl rollout status deployment/taskflow-deployment
kubectl get deployments
kubectl get pods
```

The rollout is successful when the Deployment reports that it has successfully rolled out and all desired replicas are ready.

##  Verification Summary

The following milestones were completed and tested in the local environment:

* Docker image built successfully.
* TaskFlow container ran successfully.
* Kubernetes node reached the `Ready` state.
* Deployment created with one running Pod.
* NodePort Service exposed the application.
* Application accessed through `http://localhost:30080`.
* Deployment scaled to three replicas.
* Deleted Pod automatically replaced by Kubernetes.
* Application image updated from `k8s-mini-web:v1` to `k8s-mini-web:v2`.
* Rolling update completed successfully with three ready replicas.

##  Learning Outcomes

Through this project, I learned how to:

* Build and run Docker containers.
* Use Nginx to serve a static web application.
* Create Kubernetes Deployments and Services.
* Scale application replicas.
* Demonstrate Kubernetes self-healing.
* Perform a rolling update.
* Use Git and GitHub to manage project versions.

##  Author

**Student Mini Project**

##  License

This project is intended for educational and learning purposes.
