pipeline {
    agent any

    tools {
        nodejs 'nodejs'  // This name must match the Node.js installation name in Jenkins
    }

    environment {
        GIT_CREDENTIALS_ID = 'github-credentials' // Set this in Jenkins
        REPO_URL = 'https://github.com/twangpodorji/DSO101_Final_project.git'
        BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${env.BRANCH}"]],
                    userRemoteConfigs: [[
                        url: "${env.REPO_URL}",
                        credentialsId: "${env.GIT_CREDENTIALS_ID}"
                    ]]
                ])
            }
        }

        stage('Check Commit Message') {
            steps {
                script {
                    env.GIT_COMMIT_MESSAGE = sh(
                        script: "git log -1 --pretty=%B",
                        returnStdout: true
                    ).trim()
                    echo "Commit message: ${env.GIT_COMMIT_MESSAGE}"
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'cd backend && npm install && npm test'
            }
        }

        stage('Push to GitHub if @push') {
            when {
                expression {
                    return env.GIT_COMMIT_MESSAGE.contains('@push')
                }
            }
            steps {
                script {
                    sh '''
                        git config user.name "jenkins"
                        git config user.email "jenkins@example.com"
                        
                        git add .
                        if git diff --cached --quiet; then
                            echo "No changes to commit."
                        else
                            git commit -m "Auto commit from Jenkins [ci skip]"
                            git push origin ${BRANCH}
                        fi
                    '''
                }
            }
        }
    }
}
