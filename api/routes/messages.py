import falcon
from twilio.rest import Client
from bson.json_util import dumps, loads
from datetime import datetime


class Messages:
    VALID_ATTRIBUTES = {
        'message',
        'otp',
        'mobile',
    }

    REQUIRED_ATTRIBUTES = {
        'message',
        'otp',
        'mobile',
    }

    def on_get(self, req, resp, mobile=None):

        # return messages only sent to a specific mobile no
        if mobile:
            messages = self.db.messages.find({"mobile": mobile})
            if messages:
                resp.body = dumps(messages)
                return
            # no message sent to this mobile
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "No sms has sent to this mobile no"})
            return

        # return all messages
        messages = []
        for msg in self.db.messages.find():
            messages.append(msg)

        resp.body = dumps(messages)
        return

    def on_post(self, req, resp):

        # grab data for new contact
        data = req.context['data'] if 'data' in req.context else None

        # sanity
        if not data:
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Mobile and message data missing"})
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

        from_ = "+14847256550"
        body = data['message']
        mobile = data['mobile']

        for ch in ['(', ')', ' ']:
            if ch in mobile:
                mobile = mobile.replace(ch, '')

        to = mobile
        client = Client('AC8522d195a4158a641a89d5cb38af3c08', '41e82d7c8826f19a36c793b7730e2b78')
        message = client.messages.create(to=mobile, from_=from_,
                                         body=body)

        # as this is a trial period api access of twilio, message status for successful sending is 'queued'
        # for production code we should check with 'sent' for instant notification
        if message.status == 'queued':
            data['time'] = datetime.now()
            data['mobile'] = mobile
            data['twilio_sid'] = message.sid
            self.db.messages.insert_one(data)
            resp.body = dumps({"error": "ok", "data": data})
            return
        # sending failed
        resp.status = falcon.HTTP_500
        resp.body = dumps({"error": "Sending failed"})
        return
