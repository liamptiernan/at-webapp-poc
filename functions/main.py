# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`
import json

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from pyairtable import Api
from pyairtable.formulas import match

from settings import settings

initialize_app()

def create_airtable_client(api_key: str) -> Api:
    return Api(api_key)

cors_origins = ["http://localhost:3000"]


@https_fn.on_request(
        secrets=[settings.airtable_base_id, settings.airtable_api_key],        
        cors=options.CorsOptions(
        cors_origins=cors_origins,
        cors_methods=["get", "post"],
    ))
def fetch_projects(req: https_fn.Request) -> https_fn.Response:
    airtable = create_airtable_client(settings.airtable_api_key.value)
    table = airtable.table(settings.airtable_base_id.value, "Projects")

    return {"data": {"records": table.all(sort=["Name"])}}

@https_fn.on_request(
        secrets=[settings.airtable_base_id, settings.airtable_api_key],        
        cors=options.CorsOptions(
        cors_origins=cors_origins,
        cors_methods=["get", "post"],
    ))
def fetch_expenses_for_project(req: https_fn.Request) -> https_fn.Response:
    data_dict = json.loads(req.data)
    airtable = create_airtable_client(settings.airtable_api_key.value)
    table = airtable.table(settings.airtable_base_id.value, "Expenses")
    print(data_dict['data']['projectId'])
    res = table.all(formula=match({"Project Record ID": data_dict['data']['projectId']}))

    return {"data": {"records": res}}

@https_fn.on_request(
        secrets=[settings.airtable_base_id, settings.airtable_api_key],        
        cors=options.CorsOptions(
        cors_origins=cors_origins,
        cors_methods=["get", "post"],
    ))
def update_expense(req: https_fn.Request) -> https_fn.Response:
    data_dict = json.loads(req.data)["data"]
    airtable = create_airtable_client(settings.airtable_api_key.value)
    table = airtable.table(settings.airtable_base_id.value, "Expenses")
    table.update(data_dict["expenseId"], data_dict["fields"])

    return {"data": "success"}

@https_fn.on_request(
        secrets=[settings.airtable_base_id, settings.airtable_api_key],        
        cors=options.CorsOptions(
        cors_origins=cors_origins,
        cors_methods=["get", "post"],
    ))
def create_expense(req: https_fn.Request) -> https_fn.Response:
    data_dict = json.loads(req.data)["data"]
    airtable = create_airtable_client(settings.airtable_api_key.value)
    table = airtable.table(settings.airtable_base_id.value, "Expenses")
    res = table.create(data_dict["fields"])

    return {"data": res}
