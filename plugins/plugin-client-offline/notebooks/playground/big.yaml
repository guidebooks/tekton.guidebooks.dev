apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  annotations:
    automation.cio.ibm.com/step-number-build-app-image: "10"
    automation.cio.ibm.com/step-number-build-verification-image: "11"
    automation.cio.ibm.com/step-number-clone: "01"
    automation.cio.ibm.com/step-number-compile: "02"
    automation.cio.ibm.com/step-number-cosign-sign-app-image: 10b
    automation.cio.ibm.com/step-number-cosign-sign-verification-image: 11b
    automation.cio.ibm.com/step-number-deploy-to-test-environment: "12"
    automation.cio.ibm.com/step-number-deploy-verification-test-environment: "13"
    automation.cio.ibm.com/step-number-detect-secrets: 01a
    automation.cio.ibm.com/step-number-git-version: "06"
    automation.cio.ibm.com/step-number-gradle-version: "07"
    automation.cio.ibm.com/step-number-lint: "05"
    automation.cio.ibm.com/step-number-mend-scan: "03"
    automation.cio.ibm.com/step-number-package: "08"
    automation.cio.ibm.com/step-number-sonarqube-scan: "09"
    automation.cio.ibm.com/step-number-twistlock-scan-app-image: 10a
    automation.cio.ibm.com/step-number-twistlock-scan-verification-image: 11a
    automation.cio.ibm.com/step-number-unit-test: "04"
    automation.cio/repository-secret-access: "true"
  labels:
    automation.cio/branch-deployment-type: non-default
    automation.cio/catalog-release-name: all-resources
    automation.cio/catalog-status: community
    automation.cio/pipeline-artifact: container-image
    automation.cio/pipeline-name: java-v11-gradle-container-image
    automation.cio/pipeline-platform: java
    automation.cio/pipeline-platform-tool: gradle
    automation.cio/pipeline-platform-version: v11
    automation.cio/pipeline-type: deploy
    automation.cio/pipeline-version: v1
    w3.ci-cd/pipeline-name: java-v11-gradle-container-image
    w3.ci-cd/pipeline-version: v1
  name: java-v11-gradle-branch-container-image-v1
  namespace: w3-github-app-automation
spec:
  description: The java-v11-gradle-container-image v1 non-default branch pipeline automates the creation of a java image using java v11 and gradle. This pipeline executes for builds of feature branches only. The successful execution of this pipeline results in a new image being pushed to a Cirrus pipeline and deployed to a the test application, with end to end tests run as well.
  params:
  - description: What is the GitHub owner name? (usually org or username)
    name: ownerName
    type: string
  - description: What is the GitHub owner ID?
    name: ownerId
    type: string
  - description: What is the GitHub repository name?
    name: repoName
    type: string
  - description: What is the GitHub repository ID?
    name: repoId
    type: string
  - default: "false"
    description: Is this commit on the default branch?
    name: isDefaultBranch
    type: string
  - default: ""
    description: What is the full git commit sha?
    name: revision
    type: string
  - description: What is the name of the git branch?
    name: branch
    type: string
  - description: What is the https url to clone the repo?
    name: REPOSITORY_GIT_CLONE_HTTPS_URL
    type: string
  - default: ""
    description: What is the Git Pull Request number for this branch?
    name: pull-number
    type: string
  - default: ""
    description: What is the name of the Git branch into which the open Pull Request will be merged?
    name: pull-base
    type: string
  - default: "false"
    description: Should verbose logging be enabled?
    name: verbose
    type: string
  - default: .
    description: What is the location of pom.xml in the repo?
    name: gradle-project-path
    type: string
  - default: ""
    description: What is the location of settings.xml in the repo?
    name: gradle-config
    type: string
  - default: ""
    description: Do you want to deploy the packge applications to apps folder?
    name: deploy-to-apps
    type: string
  - default: ""
    description: What is the username used to resolve gradle dependencies?
    name: gradle-repo-username
    type: string
  - default: ""
    description: What is the password used to resolve gradle dependencies?
    name: gradle-repo-password
    type: string
  - description: What is the name of the Cirrus project, exactly as it appears on Cirrus?
    name: cirrus-project-name
    type: string
  - description: What is the name of the Cirrus pipeline?
    name: cirrus-pipeline-name
    type: string
  - description: What is the username to authenticate with the Cirrus pipeline? Must be Encrypted.
    name: cirrus-pipeline-username
    type: string
  - description: What is the password to authenticate with the Cirrus pipeline? Must be Encrypted.
    name: cirrus-pipeline-password
    type: string
  - description: What is the Cirrus region where the application is deployed?
    name: cirrus-region
    type: string
  - description: The key name of the username secret used to connect to openshift
    name: cirrus-api-username
    type: string
  - description: What is the key name of the password secret used to connect to openshift?
    name: cirrus-api-password
    type: string
  - default: ""
    description: (Optional) What should the Cirrus Application be named for the test environment?
    name: cirrus-test-application-name
    type: string
  - default: q1gb
    description: How much memory should the deployment verification pods be given? Example - q256mb, q512mb, q1gb
    name: deploy-verification-memory-request
    type: string
  - default: "9080"
    description: What port should the container expose?
    name: service-port
    type: string
  - default: .secrets.baseline
    description: What is the relative path to the detect secrets baseline file? Defaults to .secrets.baseline
    name: detect-secrets-baseline-file
    type: string
  - default: ""
    description: (Optional) What is the name of the secret to mount in the verification job for the test environment?
    name: deploy-verification-secret-test
    type: string
  - default: ""
    description: (Deprecated) What additional packages should be installed in both the application and e2e-test container images?
    name: install-packages
    type: string
  - default: ""
    description: What additional packages should be installed in the application's container image?
    name: install-packages-app
    type: string
  - default: ""
    description: What additional packages should be installed in the verification test image?
    name: install-packages-verification
    type: string
  tasks:
  - name: clone
    params:
    - name: repository-git-clone-https-url
      value: $(params.REPOSITORY_GIT_CLONE_HTTPS_URL)
    - name: git-revision
      value: $(params.revision)
    - name: debug-mode
      value: $(params.verbose)
    - name: uid
      value: "1001"
    taskRef:
      name: git-clone-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
  - name: detect-secrets
    params:
    - name: baseline-filename
      value: $(params.detect-secrets-baseline-file)
    runAfter:
    - clone
    taskRef:
      name: detect-secrets-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
  - name: compile
    params:
    - name: project-path
      value: $(params.gradle-project-path)
    - name: gradle-config
      value: $(params.gradle-config)
    - name: gradle-repo-username
      value: $(params.gradle-repo-username)
    - name: gradle-repo-password
      value: $(params.gradle-repo-password)
    - name: gradle-image
      value: registry.cirrus.ibm.com/cio-ci-cd/java11-maven-image:1.0.0
    runAfter:
    - clone
    taskRef:
      name: gradle-compile-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
    - name: secrets
      workspace: secrets
  - name: mend-scan
    params:
    - name: scan-image
      value: registry.cirrus.ibm.com/cio-ci-cd/mend-unified-agent:java-11-0.0.10
    - name: product-name
      value: $(params.ownerName)
    - name: project-name
      value: $(params.repoName)
    - name: project-subpath
      value: $(params.gradle-project-path)
    runAfter:
    - compile
    taskRef:
      name: whitesource-scan-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
  - name: unit-test
    params:
    - name: project-path
      value: $(params.gradle-project-path)
    - name: gradle-config
      value: $(params.gradle-config)
    - name: gradle-repo-username
      value: $(params.gradle-repo-username)
    - name: gradle-repo-password
      value: $(params.gradle-repo-password)
    - name: gradle-image
      value: registry.cirrus.ibm.com/cio-ci-cd/java11-maven-image:1.0.0
    runAfter:
    - compile
    taskRef:
      name: gradle-unit-test-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
    - name: secrets
      workspace: secrets
  - name: lint
    params:
    - name: project-path
      value: $(params.gradle-project-path)
    - name: gradle-config
      value: $(params.gradle-config)
    - name: gradle-repo-username
      value: $(params.gradle-repo-username)
    - name: gradle-repo-password
      value: $(params.gradle-repo-password)
    - name: gradle-image
      value: registry.cirrus.ibm.com/cio-ci-cd/java11-maven-image:1.0.0
    runAfter:
    - unit-test
    taskRef:
      name: gradle-lint-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
    - name: secrets
      workspace: secrets
  - name: git-version
    params:
    - name: config-file-path
      value: ""
    - name: version-regex
      value: ""
    - name: base-version
      value: $(tasks.compile.results.build-version)
    - name: is-default-branch
      value: $(params.isDefaultBranch)
    - name: git-commit-sha
      value: $(params.revision)
    - name: debug
      value: $(params.verbose)
    runAfter:
    - unit-test
    - detect-secrets
    taskRef:
      name: git-version-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
  - name: gradle-version
    params:
    - name: project-path
      value: $(params.gradle-project-path)
    - name: gradle-image
      value: registry.cirrus.ibm.com/cio-ci-cd/java11-maven-image:1.0.0
    - name: version
      value: $(tasks.git-version.results.build-version)
    runAfter:
    - lint
    taskRef:
      name: gradle-version-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
  - name: package
    params:
    - name: project-path
      value: $(params.gradle-project-path)
    - name: gradle-config
      value: $(params.gradle-config)
    - name: gradle-repo-username
      value: $(params.gradle-repo-username)
    - name: gradle-repo-password
      value: $(params.gradle-repo-password)
    - name: gradle-image
      value: registry.cirrus.ibm.com/cio-ci-cd/java11-maven-image:1.0.0
    runAfter:
    - gradle-version
    taskRef:
      name: gradle-bootjar-v1
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
    - name: secrets
      workspace: secrets
  - name: sonarqube-scan
    params:
    - name: version
      value: $(tasks.git-version.results.build-version)
    - name: git-repo
      value: $(params.repoName)
    - name: git-owner
      value: $(params.ownerName)
    - name: git-repo-id
      value: $(params.repoId)
    - name: git-owner-id
      value: $(params.ownerId)
    - name: git-branch
      value: $(params.branch)
    - name: git-pull-number
      value: $(params.pull-number)
    - name: git-pull-base
      value: $(params.pull-base)
    - name: is-default-branch
      value: $(params.isDefaultBranch)
    - name: project-path
      value: $(params.gradle-project-path)
    - name: java-binaries-path
      value: .
    runAfter:
    - package
    taskRef:
      name: sonarqube-scan-v2
    workspaces:
    - name: cloned-git-repository
      subPath: repo
      workspace: shared-data
  - name: build-app-image
    params:
    - name: path-to-dockerfile
      value: java11-gradle-svc.Dockerfile
    - name: image-registry
      value: registry.cirrus.ibm.com
    - name: image-repository
      value: $(params.cirrus-project-name)
    - name: image-name
      value: $(params.cirrus-pipeline-name)
    - name: image-version-tag
      value: $(tasks.git-version.results.build-version)
    - name: registry-username
      value: $(params.cirrus-pipeline-username)
    - name: registry-password
      value: $(params.cirrus-pipeline-password)
    - name: git-repo
      value: $(params.repoName)
    - name: git-owner
      value: $(params.ownerName)
    - name: git-repo-id
      value: $(params.repoId)
    - name: git-owner-id
      value: $(params.ownerId)
    - name: git-branch-name
      value: $(params.branch)
    - name: git-commit-sha
      value: $(params.revision)
    - name: is-default-branch
      value: $(params.isDefaultBranch)
    - name: build-extra-args
      value: --build-arg=SERVICE_PORT=$(params.service-port)
    - name: install-packages
      value: $(params.install-packages) $(params.install-packages-app)
    runAfter:
    - package
    - sonarqube-scan
    - mend-scan
    taskRef:
      name: buildah-image-builder-v1
    workspaces:
    - name: context
      subPath: repo/build
      workspace: shared-data
    - name: docker-config
      subPath: .docker
      workspace: shared-data
    - name: secrets
      workspace: secrets
  - name: build-verification-image
    params:
    - name: path-to-dockerfile
      value: java11-gradle-deploy-test.Dockerfile
    - name: image-registry
      value: registry.cirrus.ibm.com
    - name: image-repository
      value: $(params.cirrus-project-name)
    - name: image-name
      value: $(params.cirrus-pipeline-name)
    - name: image-version-tag
      value: $(tasks.git-version.results.build-version)-test
    - name: registry-username
      value: $(params.cirrus-pipeline-username)
    - name: registry-password
      value: $(params.cirrus-pipeline-password)
    - name: git-repo
      value: $(params.repoName)
    - name: git-owner
      value: $(params.ownerName)
    - name: git-repo-id
      value: $(params.repoId)
    - name: git-owner-id
      value: $(params.ownerId)
    - name: git-branch-name
      value: $(params.branch)
    - name: git-commit-sha
      value: $(params.revision)
    - name: install-packages
      value: $(params.install-packages) $(params.install-packages-verification)
    runAfter:
    - package
    - build-app-image
    taskRef:
      name: buildah-image-builder-v1
    workspaces:
    - name: context
      subPath: repo
      workspace: shared-data
    - name: docker-config
      subPath: .docker
      workspace: shared-data
    - name: secrets
      workspace: secrets
  - name: twistlock-scan-app-image
    params:
    - name: registry-username
      value: $(params.cirrus-pipeline-username)
    - name: registry-password
      value: $(params.cirrus-pipeline-password)
    - name: image-registry
      value: registry.cirrus.ibm.com
    - name: image-repository
      value: $(params.cirrus-project-name)
    - name: image-name
      value: $(params.cirrus-pipeline-name)
    - name: image-version-tag
      value: $(tasks.git-version.results.build-version)
    - name: git-repo-id
      value: $(params.repoId)
    - name: git-commit-sha
      value: $(params.revision)
    runAfter:
    - build-app-image
    taskRef:
      name: twistlock-scan-v2
    workspaces:
    - name: secrets
      workspace: secrets
  - name: twistlock-scan-verification-image
    params:
    - name: registry-username
      value: $(params.cirrus-pipeline-username)
    - name: registry-password
      value: $(params.cirrus-pipeline-password)
    - name: image-registry
      value: registry.cirrus.ibm.com
    - name: image-repository
      value: $(params.cirrus-project-name)
    - name: image-name
      value: $(params.cirrus-pipeline-name)
    - name: image-version-tag
      value: $(tasks.git-version.results.build-version)-test
    - name: git-repo-id
      value: $(params.repoId)
    - name: git-commit-sha
      value: $(params.revision)
    runAfter:
    - build-verification-image
    taskRef:
      name: twistlock-scan-v2
    workspaces:
    - name: secrets
      workspace: secrets
  - name: cosign-sign-app-image
    params:
    - name: registry-username
      value: $(params.cirrus-pipeline-username)
    - name: registry-password
      value: $(params.cirrus-pipeline-password)
    - name: image-registry
      value: registry.cirrus.ibm.com
    - name: image-repository
      value: $(params.cirrus-project-name)
    - name: sign-image
      value: $(tasks.build-app-image.results.image-digest)
    - name: verify-image
      value: $(tasks.build-app-image.results.image-tag)
    runAfter:
    - build-app-image
    taskRef:
      name: cosign-sign-image-v1
    workspaces:
    - name: secrets
      workspace: secrets
  - name: cosign-sign-verification-image
    params:
    - name: registry-username
      value: $(params.cirrus-pipeline-username)
    - name: registry-password
      value: $(params.cirrus-pipeline-password)
    - name: image-registry
      value: registry.cirrus.ibm.com
    - name: image-repository
      value: $(params.cirrus-project-name)
    - name: sign-image
      value: $(tasks.build-verification-image.results.image-digest)
    - name: verify-image
      value: $(tasks.build-verification-image.results.image-tag)
    runAfter:
    - build-verification-image
    taskRef:
      name: cosign-sign-image-v1
    workspaces:
    - name: secrets
      workspace: secrets
  - name: deploy-to-test-environment
    params:
    - name: app-name
      value: $(params.cirrus-test-application-name)
    - name: deploy-env
      value: test
    - name: deploy-image
      value: $(tasks.build-app-image.results.image-tag)
    - name: deploy-kind
      value: Application
    - name: deploy-version
      value: $(tasks.git-version.results.build-version)
    - name: cirrus-api-username
      value: $(params.cirrus-api-username)
    - name: cirrus-api-password
      value: $(params.cirrus-api-password)
    - name: cirrus-project-name
      value: $(params.cirrus-project-name)
    - name: cirrus-region
      value: $(params.cirrus-region)
    - name: git-owner-id
      value: $(params.ownerId)
    - name: git-owner-name
      value: $(params.ownerName)
    - name: git-repo-id
      value: $(params.repoId)
    - name: git-repo-name
      value: $(params.repoName)
    - name: git-branch-name
      value: $(params.branch)
    - name: git-commit-sha
      value: $(params.revision)
    - name: service-port
      value: $(params.service-port)
    runAfter:
    - build-app-image
    - build-verification-image
    - cosign-sign-app-image
    taskRef:
      name: cirrus-deploy-v1
    workspaces:
    - name: secrets
      workspace: secrets
    - name: repo-deploy
      subPath: repo/deploy
      workspace: shared-data
  - name: deploy-verification-test-environment
    params:
    - name: cirrus-api-username
      value: $(params.cirrus-api-username)
    - name: cirrus-api-password
      value: $(params.cirrus-api-password)
    - name: cirrus-region
      value: $(params.cirrus-region)
    - name: project-name
      value: $(params.cirrus-project-name)
    - name: app-environment
      value: test
    - name: app-hostname
      value: $(tasks.deploy-to-test-environment.results.app-host)
    - name: app-port
      value: $(tasks.deploy-to-test-environment.results.app-port)
    - name: app-test-image
      value: $(tasks.build-verification-image.results.image-tag)
    - name: memory-quota
      value: $(params.deploy-verification-memory-request)
    - name: env-secret-name
      value: $(params.deploy-verification-secret-test)
    runAfter:
    - deploy-to-test-environment
    - build-verification-image
    - cosign-sign-verification-image
    taskRef:
      name: openshift-deploy-test-v1
    workspaces:
    - name: secrets
      workspace: secrets
  workspaces:
  - name: shared-data
  - description: |
      The workspace containing the repository secrets required for this pipeline.
    name: secrets
    optional: true
