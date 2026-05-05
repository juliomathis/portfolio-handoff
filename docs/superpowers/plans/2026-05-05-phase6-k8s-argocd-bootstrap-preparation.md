# Phase 6 Kubernetes + ArgoCD Bootstrap Preparation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Phase 6 Kubernetes manifests and ArgoCD app-of-apps bootstrap structure so the portfolio stack can be reconciled declaratively after infrastructure is started.

**Architecture:** Keep bootstrap ownership split: Terraform/cloud-init brings up k3s and initial ArgoCD primitives, while this phase adds repository-native desired state under `k8s/` for Argo Applications and manifests. Helm-backed infra components (cert-manager and ingress-nginx) are managed as Argo Applications, and portfolio workload resources are managed via kustomize manifests.

**Tech Stack:** k3s, ArgoCD Application/AppProject CRDs, Kubernetes manifests (YAML), kustomize, Helm charts via Argo source definitions

---

## File Map (Phase 6)

### Create
- `k8s/bootstrap/argocd-install.yaml`
- `k8s/bootstrap/argocd-appproject.yaml`
- `k8s/bootstrap/argocd-root-app.yaml`
- `k8s/apps/root.yaml`
- `k8s/apps/cert-manager.yaml`
- `k8s/apps/ingress-nginx.yaml`
- `k8s/apps/portfolio.yaml`
- `k8s/apps/cert-manager-issuers.yaml`
- `k8s/manifests/cert-manager/configmap-letsencrypt.yaml`
- `k8s/manifests/cert-manager/clusterissuer-http01.yaml`
- `k8s/manifests/cert-manager/kustomization.yaml`
- `k8s/manifests/portfolio/namespace.yaml`
- `k8s/manifests/portfolio/configmap-ingress.yaml`
- `k8s/manifests/portfolio/deployment.yaml`
- `k8s/manifests/portfolio/service.yaml`
- `k8s/manifests/portfolio/ingress.yaml`
- `k8s/manifests/portfolio/networkpolicy.yaml`
- `k8s/manifests/portfolio/kustomization.yaml`

### Validate
- `kustomize build k8s/manifests/cert-manager`
- `kustomize build k8s/manifests/portfolio`
- cluster checks during an on-demand window (`./infra/terraform/up.sh` / `./infra/terraform/down.sh`)

---

### Task 1: Add ArgoCD bootstrap manifests in-repo

**Files:**
- Create: `k8s/bootstrap/argocd-install.yaml`
- Create: `k8s/bootstrap/argocd-appproject.yaml`
- Create: `k8s/bootstrap/argocd-root-app.yaml`

- [ ] **Step 1: Add pinned ArgoCD install manifest**

```bash
mkdir -p k8s/bootstrap
curl -fsSL "https://raw.githubusercontent.com/argoproj/argo-cd/v2.12.4/manifests/install.yaml" -o k8s/bootstrap/argocd-install.yaml
```

- [ ] **Step 2: Add scoped AppProject manifest**

```yaml
# k8s/bootstrap/argocd-appproject.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: portfolio
  namespace: argocd
spec:
  description: Portfolio site and supporting platform components
  sourceRepos:
    - https://github.com/juliomathis/portfolio-handoff
    - https://charts.jetstack.io
    - https://kubernetes.github.io/ingress-nginx
  destinations:
    - namespace: argocd
      server: https://kubernetes.default.svc
    - namespace: cert-manager
      server: https://kubernetes.default.svc
    - namespace: ingress-nginx
      server: https://kubernetes.default.svc
    - namespace: portfolio
      server: https://kubernetes.default.svc
  clusterResourceWhitelist:
    - group: ""
      kind: Namespace
    - group: apiextensions.k8s.io
      kind: CustomResourceDefinition
    - group: rbac.authorization.k8s.io
      kind: ClusterRole
    - group: rbac.authorization.k8s.io
      kind: ClusterRoleBinding
    - group: cert-manager.io
      kind: ClusterIssuer
    - group: networking.k8s.io
      kind: IngressClass
  namespaceResourceWhitelist:
    - group: "*"
      kind: "*"
```

- [ ] **Step 3: Add root app-of-apps manifest**

```yaml
# k8s/bootstrap/argocd-root-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root
  namespace: argocd
spec:
  project: portfolio
  source:
    repoURL: https://github.com/juliomathis/portfolio-handoff
    targetRevision: main
    path: k8s/apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

- [ ] **Step 4: Commit Task 1**

```bash
git add k8s/bootstrap/argocd-install.yaml k8s/bootstrap/argocd-appproject.yaml k8s/bootstrap/argocd-root-app.yaml
git commit -m "feat(phase6): add argocd bootstrap manifests"
```

---

### Task 2: Define ArgoCD applications under `k8s/apps`

**Files:**
- Create: `k8s/apps/root.yaml`
- Create: `k8s/apps/cert-manager.yaml`
- Create: `k8s/apps/ingress-nginx.yaml`
- Create: `k8s/apps/portfolio.yaml`
- Create: `k8s/apps/cert-manager-issuers.yaml`

- [ ] **Step 1: Create app directory and root list**

```yaml
# k8s/apps/root.yaml
apiVersion: v1
kind: List
items:
  - apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
      name: cert-manager
      namespace: argocd
    spec:
      project: portfolio
      source:
        repoURL: https://github.com/juliomathis/portfolio-handoff
        targetRevision: main
        path: k8s/apps/cert-manager.yaml
      destination:
        server: https://kubernetes.default.svc
        namespace: argocd
  - apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
      name: ingress-nginx
      namespace: argocd
    spec:
      project: portfolio
      source:
        repoURL: https://github.com/juliomathis/portfolio-handoff
        targetRevision: main
        path: k8s/apps/ingress-nginx.yaml
      destination:
        server: https://kubernetes.default.svc
        namespace: argocd
```

- [ ] **Step 2: Add cert-manager and ingress-nginx applications**

```yaml
# k8s/apps/cert-manager.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cert-manager
  namespace: argocd
spec:
  project: portfolio
  source:
    repoURL: https://charts.jetstack.io
    chart: cert-manager
    targetRevision: v1.16.3
    helm:
      values: |
        installCRDs: true
  destination:
    server: https://kubernetes.default.svc
    namespace: cert-manager
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

```yaml
# k8s/apps/ingress-nginx.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ingress-nginx
  namespace: argocd
spec:
  project: portfolio
  source:
    repoURL: https://kubernetes.github.io/ingress-nginx
    chart: ingress-nginx
    targetRevision: 4.11.2
    helm:
      values: |
        controller:
          hostNetwork: true
          service:
            enabled: false
  destination:
    server: https://kubernetes.default.svc
    namespace: ingress-nginx
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

- [ ] **Step 3: Add portfolio and cert-manager-issuers applications**

```yaml
# k8s/apps/portfolio.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: portfolio
  namespace: argocd
spec:
  project: portfolio
  source:
    repoURL: https://github.com/juliomathis/portfolio-handoff
    targetRevision: main
    path: k8s/manifests/portfolio
  destination:
    server: https://kubernetes.default.svc
    namespace: portfolio
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

```yaml
# k8s/apps/cert-manager-issuers.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cert-manager-issuers
  namespace: argocd
spec:
  project: portfolio
  source:
    repoURL: https://github.com/juliomathis/portfolio-handoff
    targetRevision: main
    path: k8s/manifests/cert-manager
  destination:
    server: https://kubernetes.default.svc
    namespace: cert-manager
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

- [ ] **Step 4: Commit Task 2**

```bash
git add k8s/apps/
git commit -m "feat(phase6): add argocd app-of-apps application set"
```

---

### Task 3: Add cert-manager issuer manifest set

**Files:**
- Create: `k8s/manifests/cert-manager/configmap-letsencrypt.yaml`
- Create: `k8s/manifests/cert-manager/clusterissuer-http01.yaml`
- Create: `k8s/manifests/cert-manager/kustomization.yaml`

- [ ] **Step 1: Add letsencrypt config map and issuer manifest**

```yaml
# k8s/manifests/cert-manager/configmap-letsencrypt.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: letsencrypt-config
  namespace: cert-manager
data:
  email: jumathis@proton.me
```

```yaml
# k8s/manifests/cert-manager/clusterissuer-http01.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-http01
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: PLACEHOLDER_EMAIL
    privateKeySecretRef:
      name: letsencrypt-http01-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

- [ ] **Step 2: Add kustomization with replacement**

```yaml
# k8s/manifests/cert-manager/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - configmap-letsencrypt.yaml
  - clusterissuer-http01.yaml
replacements:
  - source:
      kind: ConfigMap
      name: letsencrypt-config
      fieldPath: data.email
    targets:
      - select:
          kind: ClusterIssuer
          name: letsencrypt-http01
        fieldPaths:
          - spec.acme.email
```

- [ ] **Step 3: Commit Task 3**

```bash
git add k8s/manifests/cert-manager/
git commit -m "feat(phase6): add cert-manager issuer kustomize manifests"
```

---

### Task 4: Add portfolio workload manifests

**Files:**
- Create: `k8s/manifests/portfolio/namespace.yaml`
- Create: `k8s/manifests/portfolio/configmap-ingress.yaml`
- Create: `k8s/manifests/portfolio/deployment.yaml`
- Create: `k8s/manifests/portfolio/service.yaml`
- Create: `k8s/manifests/portfolio/ingress.yaml`
- Create: `k8s/manifests/portfolio/networkpolicy.yaml`
- Create: `k8s/manifests/portfolio/kustomization.yaml`

- [ ] **Step 1: Add namespace and ingress host config**

```yaml
# k8s/manifests/portfolio/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: portfolio
```

```yaml
# k8s/manifests/portfolio/configmap-ingress.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: portfolio-ingress-config
  namespace: portfolio
data:
  host: portfolio.178-105-89-214.nip.io
```

- [ ] **Step 2: Add deployment/service/ingress/networkpolicy manifests**

```yaml
# k8s/manifests/portfolio/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  namespace: portfolio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: portfolio
  template:
    metadata:
      labels:
        app: portfolio
    spec:
      containers:
        - name: portfolio
          image: ghcr.io/juliomathis/portfolio:PLACEHOLDER_TAG
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /healthz
              port: 8080
```

```yaml
# k8s/manifests/portfolio/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: portfolio
  namespace: portfolio
spec:
  selector:
    app: portfolio
  ports:
    - port: 80
      targetPort: 8080
```

```yaml
# k8s/manifests/portfolio/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio
  namespace: portfolio
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-http01
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - PLACEHOLDER_HOST
      secretName: portfolio-tls
  rules:
    - host: PLACEHOLDER_HOST
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolio
                port:
                  number: 80
```

```yaml
# k8s/manifests/portfolio/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: portfolio-default
  namespace: portfolio
spec:
  podSelector:
    matchLabels:
      app: portfolio
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
```

- [ ] **Step 3: Add kustomization and host replacement**

```yaml
# k8s/manifests/portfolio/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - configmap-ingress.yaml
  - deployment.yaml
  - service.yaml
  - ingress.yaml
  - networkpolicy.yaml
replacements:
  - source:
      kind: ConfigMap
      name: portfolio-ingress-config
      fieldPath: data.host
    targets:
      - select:
          kind: Ingress
          name: portfolio
        fieldPaths:
          - spec.rules.0.host
          - spec.tls.0.hosts.0
```

- [ ] **Step 4: Commit Task 4**

```bash
git add k8s/manifests/portfolio/
git commit -m "feat(phase6): add portfolio kubernetes manifests"
```

---

### Task 5: Local manifest validation gates

**Files:**
- Validate only

- [ ] **Step 1: Validate cert-manager kustomize render**

Run: `kustomize build k8s/manifests/cert-manager`

Expected:
- Render succeeds with no replacement errors
- `ClusterIssuer` manifest has resolved email value

- [ ] **Step 2: Validate portfolio kustomize render**

Run: `kustomize build k8s/manifests/portfolio`

Expected:
- Render succeeds with no replacement errors
- `Ingress` host fields are populated from ConfigMap replacement

- [ ] **Step 3: Commit validation-ready manifest fixes (if needed)**

```bash
git add k8s/
git commit -m "fix(phase6): resolve kustomize replacement and render issues"
```

---

### Task 6: On-demand bootstrap verification session

**Files:**
- Modify if needed: `k8s/**` and `infra/terraform/terraform.tfvars.example`

- [ ] **Step 1: Start infrastructure window**

Run: `./infra/terraform/up.sh`

Expected:
- Terraform apply succeeds
- `terraform output` prints `vps_ip` and `nip_io_url`

- [ ] **Step 2: Verify node and control plane readiness**

Run:

```bash
ssh -i ~/.ssh/portfolio_hcloud_ed25519 root@<vps_ip> "cloud-init status --wait"
ssh -i ~/.ssh/portfolio_hcloud_ed25519 root@<vps_ip> "/usr/local/bin/k3s kubectl get nodes -o wide"
ssh -i ~/.ssh/portfolio_hcloud_ed25519 root@<vps_ip> "/usr/local/bin/k3s kubectl get pods -A"
```

Expected:
- `cloud-init` reports `status: done`
- node reports `Ready`
- ArgoCD + kube-system pods are Running

- [ ] **Step 3: Verify workload exposure path**

Run: `curl -I https://portfolio.<ip-with-dashes>.nip.io`

Expected:
- 200 response once ingress + cert-manager + portfolio app reconcile complete

- [ ] **Step 4: Stop spend immediately after validation**

Run: `./infra/terraform/down.sh`

Expected:
- Terraform destroy succeeds
- `terraform output` reports no outputs / empty state

---

## Testing Strategy

- Local manifest rendering via `kustomize build` for all kustomization trees.
- Runtime checks only inside explicit on-demand validation windows.
- No always-on server posture; teardown after every verification session.

---

## Scope Guardrails

- Keep `.github/workflows/` out of scope (Phase 7).
- Keep remote Terraform backend work out of scope (Phase 1.5).
- Keep secret-runtime hardening changes (KSOPS narrowing) for later phase unless required by blocker.

---

## Total Estimate

**Time:** 1–1.5 working days  
**Complexity:** High

## Notes

- Use `cx23` baseline in all validation windows unless a deliberate cost/perf decision changes it.
- Keep `k8s/` paths aligned with expected canonical structure in `.opencode/context/project-intelligence/technical-domain.md`.
