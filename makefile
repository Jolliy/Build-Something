build_app: 
	docker build -t app ./App/

run_app: 
	docker run --rm -p 5000:5000 app