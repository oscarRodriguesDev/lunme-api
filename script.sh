docker build -t Lunme .
docker stop Lunme
docker rm Lunme
docker run -d --env-file .env -p 3000:3000 --name Lunme Lunme

git add *
git commit -m "Atualização da aplicação"
git push origin main