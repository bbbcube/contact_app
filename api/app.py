import falcon
from falcon_cors import CORS
from api.middlewares.db import Db
from api.middlewares.jsonhandler import Jsonhandler
from api.routes.pingtest import Pingtest
from api.routes.contacts import Contacts
from api.routes.messages import Messages


def create_app():
    cors = CORS(
        allow_all_origins=True,
        allow_all_headers=True,
        allow_all_methods=True,
        allow_credentials_all_origins=True
    )
    # Middleware
    jsonhandler = Jsonhandler()
    db = Db("contact_app")

    # API components
    ping = Pingtest()
    contacts = Contacts()
    message = Messages()

    # Create wsgi app instance
    api = falcon.API(middleware=[
        cors.middleware,
        jsonhandler,
        db
    ])

    api.add_route('/ping', ping)
    api.add_route('/contacts/{id}', contacts)
    api.add_route('/contacts/', contacts)
    api.add_route('/messages/', message)

    return api


app = create_app()
