# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from pyairtable import Api

from settings import settings

initialize_app()

def create_airtable_client(api_key: str) -> Api:
    return Api(api_key)


@https_fn.on_request(
        secrets=[settings.airtable_base_id, settings.airtable_api_key],        
        cors=options.CorsOptions(
        cors_origins=["http://localhost:3000"],
        cors_methods=["get", "post"],
    ))
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    print("yes")
    airtable = create_airtable_client(settings.airtable_api_key.value)
    table = airtable.table(settings.airtable_base_id.value, "Projects")

    return {"data": {"records": table.all()}}
