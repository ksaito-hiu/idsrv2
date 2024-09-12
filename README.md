# idsrv2

アカウントをGoogle Workspaceなどで管理しており、
そのアカウントのメールアドレスが、規則的な形をしていることを
前提にしたSolid認証サーバです。認証のみを担当するサーバなので、
Podは提供しません。




idsrv2.json中のmailToIdに入っているarg1とarg2は、
GoogleのOpenID Connectで得られるメールアドレスから
idsrv2で使う簡単なidを生成するための情報で、
単純に文字列のreplaceメソッドを使って実装されている。
replaceメソッドの第一引数がarg1で第二引数がarg2。
arg1は正規表現と考えてRegExpオブジェクトに変換してから
replaceメソッドに与えられる。なのでarg1の設定は、
バックスラッシュをエスケープするのを忘れずに。
例えば`"taro@gmail.com"`から`"id-taro"`を生成するには
arg1に`"^(.*)@gmail\\.com$"`を指定してarg2に`"id-$1"`を
指定すれば良い。この設定なら`"jiro@gmail.com"`は
`"id-jiro"`となる。もしreplace適用後に文字列に変更が
無い時はreplace失敗と見做して例外発生して処理を中断させる。
