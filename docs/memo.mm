

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

2024,03/25: サーバー起動時にbaseUrlを指定しなければ
デフォルトhttp://localhost:3000となって、運用する時には
上手くいかない。--baseUrlというオプションを付けてやるか、
環境変数`CSS_BASE_URL`を設定する。idsrv2-config.jsonで
指定できるのがベストだったけどできなかったし、オプション
だとstart.shの書き換えが必要なので、環境変数で設定して
もらうことにした。

