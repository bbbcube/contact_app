import falcon
from bson.json_util import dumps
from datetime import datetime
from api.lib.mongoutils import mongoid


class Contacts:
    VALID_ATTRIBUTES = {
        'first_name',
        'last_name',
        'mobile',
    }

    REQUIRED_ATTRIBUTES = {
        'first_name',
        'last_name',
        'mobile',
    }

    def on_get(self, req, resp, id=None):

        # Return a single contact details
        if id:
            id = mongoid(id)
            contact = self.db.contacts.find_one({"_id": id}, {"created": 0})
            if contact:
                resp.body = dumps(contact)
                return
            # we didn't find the contact details
            resp.status = falcon.HTTP_404
            return

        # return all contacts
        contacts = []
        for contact in self.db.contacts.find({}, {"created": 0}):
            contacts.append(contact)

        resp.body = dumps(contacts)
        return

    def on_post(self, req, resp):
        # grab data for new contact
        data = req.context['data'] if 'data' in req.context else None
        # sanity
        if not data:
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing contact data"})
            return

        # sanity check, do we have any invalid data
        for param in data:
            if param not in self.VALID_ATTRIBUTES:
                resp.status = falcon.HTTP_400
                resp.body = dumps({"error": f"Invalid attribute {param}"})
                return

        # do we have all essential data
        for param in self.REQUIRED_ATTRIBUTES:
            if param not in data:
                resp.status = falcon.HTTP_400
                resp.body = dumps({"error": f"Missing required attribute {param}"})
                return

        data['created'] = datetime.now()

        self.db.contacts.insert_one(data)

        resp.body = dumps({"error": "ok"})
        return

    def on_put(self, req, resp, id=None):

        # grab data for new contact
        data = req.context['data'] if 'data' in req.context else None

        # sanity
        if (not id) or (not data):
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing contact data"})

        id = mongoid(id)

        # do we have all essential data
        for param in self.REQUIRED_ATTRIBUTES:
            if param not in data:
                resp.status = falcon.HTTP_400
                resp.body = dumps({"error": f"Missing required attribute {param}"})
                return

        contact = self.db.contacts.update_one(
            {"_id": id},
            {"$set": data}
        )
        if contact.matched_count != 1:
            resp.status = falcon.HTTP_404
            return

        return

    def on_delete(self, req, resp, id=None):

        # sanity
        if (not id):
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing contact data"})

        id = mongoid(id)

        self.db.contacts.delete_one(
            {"_id": id}
        )

        return