docker build -t Lunme .
docker stop Lunme
docker rm Lunme
docker run -d --env-file .env -p 3000:3000 --name Lunme Lunme

clear
npm run build
git add *
git commit -m "Atualização da aplicação"
git push origin main
clear
echo "Deploy finalizado com sucesso!"
npm run dev

clear
npm run build
clear
npm run dev
echo "Deploy finalizado com sucesso!"