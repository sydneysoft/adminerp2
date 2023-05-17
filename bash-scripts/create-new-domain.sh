
#!/bin/bash
# -*- ENCODING: UTF-8 -*-

cd /etc/nginx/sites-available/
subdomain="$1.tiendavirtual.online"
port=$2


contain='
server {
    
	listen 80;

  server_name '$subdomain' www.'$subdomain';
    
	location / {
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header Host $http_host;
			
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
			
		proxy_pass http://216.238.72.179:'$port'/;
		proxy_redirect off;
		proxy_read_timeout 240s;
	}
}
'
echo $contain > $subdomain

cd /etc/nginx/sites-enabled
ln -s ../sites-available/$subdomain


nginx -s reload
sudo ufw allow 'Nginx Full' # Allow Nginx Full

# Esto es para crear una zona en bind9
# agregando la zona al archivo /etc/bind/named.conf.local
# new_zone='

# zone "'$subdomain'" IN {
#     type master;
#     file "/etc/bind/zones/'$subdomain'.zone";
# };

# '

# echo $new_zone >> /etc/bind/named.conf.local

# cp /etc/bind/zones/template "/etc/bind/zones/"$subdomain".zone"

# sed -i 's/subdomain/'$subdomain'/g' "/etc/bind/zones/"$subdomain".zone"

# service bind9 restart



exit
