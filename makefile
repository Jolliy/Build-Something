kubernetes_cleanup: 
	kubectl delete --cascade='foreground' -f ./kubernetes/bookList.yaml

get_logs_dataHandler:
	kubectl logs deployment/datahandler-dep

get_logs_bookListApp:
	kubectl logs deployment/app-dep

get_logs_export:
	kubectl logs deployment/export-dep

mongosh:
	kubectl exec -it db-booklist-0 -- mongosh