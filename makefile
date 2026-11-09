build_app:
	docker build -t app ./Containers/App

run_app: build_app
	docker run --rm -p 5000:5000 app
