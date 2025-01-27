from dataclasses import dataclass
from firebase_functions.params import SecretParam

@dataclass
class Settings:
    airtable_base_id = SecretParam('AIRTABLE_BASE_ID')
    airtable_api_key = SecretParam('AIRTABLE_API_KEY')

settings = Settings()
