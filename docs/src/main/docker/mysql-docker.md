进入容器

docker exec -it fe29171467c4 /bin/bash



导出sql 文件 

mysqldump -u root -p gastrodia > /home/gastrodia.sql



从容器中拷贝出来

docker cp fe29171467c4:/home/gastrodia.sql /home