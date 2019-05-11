#!/bin/sh
# download rutracker torrent file

login=_alekkk____
password=secyrLRT2011alU
torrent_id=$1 # 5291059

rutracker_cookie=$(http -hf post 'http://rutracker.org/forum/login.php' 'redirect=index.php' "login_username=$login" "login_password=$password" 'login=%C2%F5%EE%E4' \
	| grep Set-Cookie \
	| grep -oE 'bb_data=[^;]+')

http "http://rutracker.org/forum/dl.php?t=$torrent_id" "Cookie: $rutracker_cookie"
