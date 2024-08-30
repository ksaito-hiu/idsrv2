

This directory ("admin.example") contains a sample of "admin" directory.
idsrv2 uses WAC (Web Access Control) to authorize against administration
action. The "admin" directory in the "settings" directory is copied to
the resource storage at idsrv2 is started for the first time.

So, copy the "admin.example" directory to "admin" directory.
And edit the "admin/wac/.acl" file. It contains a sample WebID
(https://kenji.solidcommunity.net/profile/card#me). Please
change it to your WebID.

    cp -r admin.example admin
    vi admin/wac/.acl

