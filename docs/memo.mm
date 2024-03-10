

* <https://github.com/CommunitySolidServer/CommunitySolidServer/blob/main/documentation/markdown/usage/account/login-method.md>

-----

一時的

```
vi /etc/nginx/mime.types
    text/turtle                           ttl;
vi /etc/nginx/sites-available/default
        try_files $uri $uri.ttl $uri/ =404;
```

2024,03/10: 上の実験で、あとプロファイルだけ
用意すれば良さそうだと判明。
