#!/bin/sh

# You need to setup node.js.
#export PATH="/usr/local/anyenv/bin:$PATH"
#export ANYENV_ROOT="/usr/local/anyenv"
#export ANYENV_DEFINITION_ROOT="/usr/local/anyenv-install"
#eval "$(anyenv init -)"
# 上の行#!/bin/shを使うと"eval: source: not found"に
# なっちゃう


# function to find the real file by pursuing symbolic links
# the argument must be an absolute path or a relative path from
# current directory. The return value is always an absolute path.
# This function is a substitute of command `readlink -f` on linux.
# On Mac OS X, "-f" option is not supported.
# http://stackoverflow.com/questions/1055671/how-can-i-get-the-behavior-of-gnus-readlink-f-on-a-mac
pursueSymbolicLink() {
    #_dirBackup=$(pwd)
    _TARGET_FILE=$1
    cd ${_TARGET_FILE%/*}
    _TARGET_FILE=${_TARGET_FILE##*/}
    while [ -L "$_TARGET_FILE" ]
    do
	_TARGET_FILE=$(readlink $_TARGET_FILE)
	cd ${_TARGET_FILE%/*}
	_TARGET_FILE=${_TARGET_FILE##*/}
    done
    _TARGET_FILE=$(pwd -P)/$_TARGET_FILE
    #cd $_dirBackup
    echo $_TARGET_FILE
}

SCRIPT_FILE=$(pursueSymbolicLink $0)
INSTALL_DIR=$(dirname $SCRIPT_FILE)
INSTALL_DIR=`echo $INSTALL_DIR | sed -e 's/\/bin//'`

cd $INSTALL_DIR

#export MONGODB_URI='mongodb://127.0.0.1:27017'
#export CSS_BASE_URL='https://id.mydomain.com/'

if [ -z $CSS_BASE_URL ]; then
    CSS_BASE_URL='http://localhost:3000/'
fi

npx community-solid-server -b $CSS_BASE_URL -c ./config/idsrv2.json idsrv2-config.json -f data -m .
#node src/app.js

