# AWS Deployment - EC2 Instance - Ubuntu

- Frontend    
    - npm install  -> dependencies install
    - npm run build
    - sudo apt update
    - sudo apt install nginx (Nginx is highly efficient at serving static files, and it does so with minimal overhead, making it an ideal choice for hosting these files.)
    - sudo systemctl start nginx
    - sudo systemctl enable nginx
    - Copy code from dist(build files) to /var/www/html/ -> sudo scp -r dist/* /var/www/html/
    - Enable port :80 of your instance from AWS (use http)

- Backend
    - allowed ec2 instance public IP on mongodb server - from Atlas site
    - npm install pm2 -g (Process management library which will help to run node in background)
    - pm2 start npm --name "devTinder-backend" -- start (it will start the node server via pm2 with given name ).
    - pm2 logs
    - pm2 list, pm2 flush <name> , pm2 stop <name>, pm2 delete <name>
    - config nginx -> `/etc/nginx/sites-available/default`
    - restart nginx -> `sudo systemctl restart nginx`
    - Modify the BASEURL in frontend project to "/api"
    - to restart pm2 -> pm2 restart <id>


# Ngxinx config (for Proxy Pass):

```
    Frontend = http://http://13.126.4.135/
    Backend = http://http://13.126.4.135:7777/

    Domain name = devtinder.com => 13.126.4.135

    Frontend = devtinder.com
    Backend = devtinder.com:7777 => devtinder.com/api

    nginx config : 

    server_name 43.204.96.49;

    # when the path is  /api/ it will serve it as http://localhost:7777/
    location /api/ {
        proxy_pass http://localhost:7777/;  # Pass the request to the Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        # Try to serve the request as a file, or fallback to index.html
        try_files $uri $uri/ /index.html;
    }
```