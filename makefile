build_app:
	docker build -t app ./Containers/bookListApp

run_app: build_app
	docker run --rm -p 8080:8080 app

temp_compose_for_dev: 
	docker compose -f ./kubernetes/bookList.yaml up


build_dataHandler:
	docker build -t datahandler ./Containers/dataHandler

run_dataHandler: build_dataHandler
	docker run --rm -p 3000:3000 datahandler