# Deployment

- Signup on AWS 
- Launch instance
- chmod 400 <secret>.pem
- ssh -i "devTinder-secret.pem" ubuntu@ec2-43-204-96-49.ap-south-1.compute.amazonaws.com
- Install Node version 16.17.0
- Git clone
- Frontend    
    - npm install  -> dependencies install
    - npm run build
    - sudo apt update
    - sudo apt install nginx (Nginx is highly efficient at serving static files, and it does so with minimal overhead, making it an ideal choice for hosting these files.)
    - sudo systemctl start nginx
    - sudo systemctl enable nginx
    - Copy code from dist(build files) to /var/www/html/
    - sudo scp -r dist/* /var/www/html/
    - Enable port :80 of your instance from AWS