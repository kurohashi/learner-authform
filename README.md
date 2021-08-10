# Pre-requisites
1. The server runs on port "30000". You will be needing nginx/apache/... configuration to call the APIs as the browser will give CORS error.
2. For nginx, you can do: 
    ```
    location /mean_stack/apis {
        proxy_pass http://localhost:30000/apis;
    }

    location /mean_stack {
        try_files $uri $uri/ /mean_stack/index.html;
    }
    ```
3. To use the FE part, you will have to build the app using `ng build --base-href /mean_stack/`
4. Please do `npm install` before anything else once to download and install all the project dependencies.